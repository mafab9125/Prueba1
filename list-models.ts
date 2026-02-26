import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

async function listModels() {
    console.log(`--- Listing all model names ---`);
    const ai = new GoogleGenAI({ apiKey });

    try {
        const result: any = await ai.models.list();
        console.log("Keys of result:", Object.keys(result));
        // In some versions it's result.results, in others it's result.models
        const models = result.results || result.models || result.items || [];
        console.log(`✅ Success! Found ${models.length} models.`);

        // Let's try to see if it's a generator
        if (typeof result[Symbol.asyncIterator] === 'function') {
            console.log("Result is an async iterator!");
            for await (const model of result) {
                console.log(` - ${model.name}`);
            }
        } else if (typeof result[Symbol.iterator] === 'function') {
            console.log("Result is an iterator!");
            for (const model of result) {
                console.log(` - ${model.name}`);
            }
        }
    } catch (error: any) {
        console.error(`❌ Error:`, error);
    }
}

listModels();
