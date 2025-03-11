import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const artificialDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 1000));

export async function getGeminiResponse(prompt: string, imageUrl?: string): Promise<string> {
  try {
    if (!prompt.trim()) {
      throw new Error('Empty prompt');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    await artificialDelay();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    if (!text) {
      throw new Error('Empty response from AI');
    }

    return text;
  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    throw new Error("Failed to get AI response. Please try again.");
  }
}
