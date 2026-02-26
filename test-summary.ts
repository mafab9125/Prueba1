import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

// Replicating safeJsonParse for independent test
const safeJsonParse = (text: string) => {
    try {
        const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        throw new Error("Invalid JSON format");
    }
};

async function testSummary() {
    console.log("Testing generateAiSummary logic (JSON response)...");
    const ai = new GoogleGenAI({ apiKey, apiVersion: "v1" });

    try {
        const result: any = await (ai.models as any).generateContent({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            },
            contents: [{
                role: "user",
                parts: [{
                    text: `Como experto en seguridad, resume estas violaciones: []. 
                FORMATO DE SALIDA (JSON): { "summary": "tu resumen aquí" }` }]
            }]
        });

        const text = result.text;
        console.log("Raw Response:", text);
        const parsed = safeJsonParse(text);

        if (parsed.summary) {
            console.log("✅ Validation SUCCESS: 'summary' key found and parsed.");
            console.log("Content:", parsed.summary);
        } else {
            console.error("❌ Validation FAILED: 'summary' key not found.");
        }
    } catch (error: any) {
        console.error("❌ Error during test:", error.message);
    }
}

testSummary();
