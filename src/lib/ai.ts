import { GoogleGenAI } from "@google/genai";
import { ScanResult, Violation } from "./types";

const getApiKey = () => {
    // Access via process.env as defined in vite.config.ts and per security rules
    // @ts-ignore
    const processKey = process.env.GEMINI_API_KEY;

    console.log("DEBUG [IA]: Intentando obtener API Key...");

    if (processKey && processKey !== "tu_llave_aqui" && processKey.startsWith("AIzaSy")) {
        console.log("✅ DEBUG [IA]: API Key detectada correctamente (", processKey.substring(0, 8), "...)");
        return processKey;
    }

    console.error("❌ DEBUG [IA]: No se encontró GEMINI_API_KEY en process.env o es inválida.");
    console.log("Environment Check:", { hasProcessEnv: typeof process !== 'undefined' && !!process.env });

    return "";
};

// Utility to clean markdown blocks and parse JSON
const safeJsonParse = (text: string) => {
    try {
        // Remove markdown code blocks if present (```json ... ``` or ``` ...)
        const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("❌ [IA] Error parseando JSON:", e);
        console.error("Contenido original:", text);
        throw new Error("La respuesta de la IA no tiene un formato JSON válido.");
    }
};

export const generateAiSummary = async (violations: Violation[]): Promise<string> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey, apiVersion: "v1" });

    try {
        const result = await (ai.models as any).generateContent({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            },
            contents: [{
                role: "user",
                parts: [{
                    text: `Como experto en seguridad de aplicaciones, resume de forma ejecutiva el estado de estas violaciones detectadas: ${JSON.stringify(violations)}. 
                Proporciona una recomendación de prioridad en español.
                FORMATO DE SALIDA (JSON): { "summary": "tu resumen aquí" }` }]
            }]
        });

        const parsed = safeJsonParse(result.text || "{}");
        return parsed.summary || "No se pudo generar el resumen.";
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
        onLog("❌ Error: No se detectó GEMINI_API_KEY en el entorno inyectado.");
        onLog("💡 Acción requerida: Verifica .env.local y reinicia el servidor.");
        throw new Error("API Key faltante.");
    }

    const ai = new GoogleGenAI({ apiKey, apiVersion: "v1" });
    onProgress(10);
    onLog("🚀 Iniciando Auditoría de Experto (Modelo 2.5-Flash)...");

    const prompt = `Actúa como un Auditor de Ciberseguridad de Élite. Realiza un análisis de profundidad sobre:
      Archivo: ${fileName}
      Contenido: ${content.substring(0, 20000)}
      
      MODOS: ${modes.length > 0 ? modes.join(', ') : 'Auditoría Integral'}
      
      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "classification": "Riesgo Crítico|Alto|Medio|Bajo",
        "architectureScore": 0-100,
        "dataSecurityScore": 0-100,
        "description": "Análisis ejecutivo.",
        "architectureDetails": [],
        "dataSecurityDetails": [],
        "findings": [{"file": "string", "policy": "string", "status": "Crítico|Alto|Medio|Informativo", "line": 0, "language": "string", "snippet": "string", "analysis": "string"}]
      }`;

    const runAiWithRetry = async (retryCount = 0): Promise<any> => {
        try {
            onLog(`🔍 Analizando vulnerabilidades [Fase ${retryCount + 1}]...`);

            const result = await (ai.models as any).generateContent({
                model: "gemini-2.5-flash",
                generationConfig: {
                    responseMimeType: "application/json"
                },
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            });

            const responseText = result.text;
            return safeJsonParse(responseText || "{}");
        } catch (error: any) {
            const msg = (error?.message || "").toLowerCase();
            if (msg.includes("429") || msg.includes("quota") || msg.includes("503")) {
                if (retryCount < 3) {
                    const delay = Math.pow(2, retryCount) * 3000;
                    onLog(`⚠️ [!] Límite de cuota o alta demanda. Reintentando en ${delay / 1000}s...`);
                    await new Promise(r => setTimeout(r, delay));
                    return runAiWithRetry(retryCount + 1);
                }
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
    result.findings = result.findings?.map((f: any) => ({
        ...f,
        snippet: f.snippet || "/* Revisar código fuente */",
        analysis: f.analysis || "Vulnerabilidad detectada."
    })) || [];

    onProgress(100);
    onLog("✅ Análisis completado con éxito.");

    return result;
};
