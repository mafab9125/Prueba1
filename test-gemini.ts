import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

async function testConnection() {
    console.log("Testing Gemini API connection with v1...");
    const ai = new GoogleGenAI({ apiKey, apiVersion: "v1" });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{
                role: "user",
                parts: [{ text: "Hola, responde con 'OK' si recibes este mensaje." }]
            }]
        });

        console.log("✅ Response received:", response.text);
    } catch (error) {
        console.error("❌ Error during test:", error);
    }
}

testConnection();
