import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

async function testConnection() {
    console.log("Testing Gemini API connection with v1, gemini-2.5-flash and JSON...");
    const ai = new GoogleGenAI({ apiKey, apiVersion: "v1" });

    try {
        const response: any = await (ai.models as any).generateContent({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            },
            contents: [{
                role: "user",
                parts: [{ text: "Responde con un JSON que tenga una llave 'status' con valor 'OK'." }]
            }]
        });

        console.log("✅ Response received:", response.text);
    } catch (error: any) {
        console.error("❌ Error during test:", error.message || JSON.stringify(error, null, 2));
    }
}

testConnection();
