import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, Violation } from "./types";

const getApiKey = () => {
    // Vite constants are replaced at build time
    // @ts-ignore
    const viteKey = import.meta.env.VITE_GEMINI_API_KEY;

    console.log("DEBUG [IA]: Intentando obtener API Key...");

    if (viteKey && viteKey !== "tu_llave_aqui" && viteKey.startsWith("AIzaSy")) {
        console.log("✅ DEBUG [IA]: API Key detectada correctamente (", viteKey.substring(0, 8), "...)");
        return viteKey;
    }

    console.error("❌ DEBUG [IA]: No se encontró VITE_GEMINI_API_KEY en import.meta.env o es inválida.");
    console.log("Vite Env Object:", import.meta.env); // Log the whole object for debugging

    return "";
};

export const generateAiSummary = async (violations: Violation[]): Promise<string> => {
    const apiKey = getApiKey();
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const response = await model.generateContent(`Como experto en seguridad de aplicaciones, resume brevemente el estado de estas violaciones detectadas: ${JSON.stringify(violations)}. Proporciona una recomendación de prioridad en español.`);
        return response.response.text() || "No se pudo generar el resumen.";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Error al conectar con la IA. Verifica tu API Key.");
    }
};

export const performExpertScan = async (
    content: string,
    fileName: string,
    modes: string[],
    onProgress: (progress: number) => void,
    onLog: (log: string) => void
): Promise<ScanResult> => {
    const apiKey = getApiKey();

    if (!apiKey) {
        onLog("❌ Error: No se detectó la API Key en el entorno de la aplicación.");
        onLog("💡 Acción requerida: Asegúrate de que .env.local contenga VITE_GEMINI_API_KEY y reinicia el servidor con 'Ctrl+C' y 'npm run dev'.");
        throw new Error("API Key faltante: Revisa la consola del desarrollador (F12) para más detalles.");
    }

    const genAI = new GoogleGenAI(apiKey);
    onProgress(10);
    onLog("🚀 Iniciando Auditoría de Experto Nivel 300...");

    const prompt = `Actúa como un Auditor de Ciberseguridad de Élite y Arquitecto de Sistemas Principal. Tu tarea es realizar un análisis de profundidad "Nivel 300" sobre el código o contexto proporcionado.
      
      CONTENIDO A ANALIZAR: 
      Nombre: ${fileName}
      Contenido: ${content.substring(0, 20000)} ${content.length > 20000 ? "...(truncado)" : ""}
      
      MODOS SELECCIONADOS: ${modes.length > 0 ? modes.join(', ') : 'Auditoría Integral'}
      
      INSTRUCCIONES DE PUNTUACIÓN (ESTRICTO):
      - Inicia con 100 puntos en Arquitectura y Seguridad.
      - DEBES RESTAR entre 10 y 25 puntos por cada hallazgo "Crítico" o "Alto".
      - Si hay un Riesgo Crítico general, los puntajes NO PUEDEN ser 100/100.
      
      DIMENSIONES DE ANÁLISIS REQUERIDAS:
      1. ARQUITECTURA DE DATOS Y FLUJO: Analiza patrones de diseño, acoplamiento, cohesión, gestión de estado y eficiencia.
      2. SEGURIDAD DE DATOS DE ALTA RIGOR: Identifica falta de saneamiento, exposición de PII, gestión insegura de secretos, y riesgos de inyección (SQL, Prompt Injection, XSS) según OWASP y NIST CSF.
      
      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "classification": "Riesgo Crítico|Alto|Medio|Bajo",
        "architectureScore": 60,
        "dataSecurityScore": 45,
        "description": "Análisis ejecutivo detallado.",
        "architectureDetails": [{"failure": "string", "impact": "Crítico|Alto|Medio", "location": "string", "snippet": "string"}],
        "dataSecurityDetails": [{"failure": "string", "impact": "Crítico|Alto|Medio", "location": "string", "snippet": "string"}],
        "findings": [{"file": "string", "policy": "string", "status": "Crítico|Alto|Medio|Informativo", "line": 0, "language": "string", "snippet": "string", "analysis": "string"}]
      }`;

    const runAiWithRetry = async (retryCount = 0): Promise<any> => {
        try {
            onLog(`🔍 Analizando vulnerabilidades y arquitectura [Fase ${retryCount + 1}]...`);
            onLog(`⏳ Esperando respuesta de los servidores de Google AI...`);
            console.log("Gemini Prompt:", prompt.substring(0, 500) + "...");

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            });

            const responseText = result.response.text();
            console.log("Gemini Response:", responseText);
            return JSON.parse(responseText || "{}");
        } catch (error: any) {
            const msg = (error?.message || "").toLowerCase();
            const is503 = msg.includes("503") || msg.includes("high demand") || msg.includes("unavailable");
            if (is503 && retryCount < 3) {
                const delay = Math.pow(2, retryCount) * 3000;
                onLog(`⚠️ [!] Alta demanda en Gemini (503). Reintentando en ${delay / 1000}s...`);
                await new Promise(r => setTimeout(r, delay));
                return runAiWithRetry(retryCount + 1);
            }
            console.error("Gemini Error:", error);
            throw error;
        }
    };

    onProgress(40);
    const result = await runAiWithRetry();

    // Sanitización
    result.architectureScore = Number(result.architectureScore) || 0;
    result.dataSecurityScore = Number(result.dataSecurityScore) || 0;

    const hasCritical = result.findings?.some((f: any) => f.status === 'Crítico' || f.status === 'Alto');
    if (hasCritical) {
        if (result.architectureScore > 80) result.architectureScore = 75;
        if (result.dataSecurityScore > 80) result.dataSecurityScore = 70;
    }

    result.findings = result.findings?.map((f: any) => ({
        ...f,
        snippet: f.snippet || "/* Ver análisis del experto para más detalles */",
        analysis: f.analysis || "Se detectó una vulnerabilidad potencial que requiere revisión manual."
    })) || [];

    onProgress(100);
    onLog("✅ Análisis de profundidad completado.");

    return result;
};
