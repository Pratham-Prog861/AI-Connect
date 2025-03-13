import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const artificialDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 1000));

// Function to check if the question is about who created the AI
const isCreatorQuestion = (prompt: string): boolean => {
  const creatorKeywords = [
    'who made you',
    'who created you',
    'who developed you',
    'who built you',
    'your creator',
    'who programmed you'
  ];
  return creatorKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
};

export async function getGeminiResponse(prompt: string, imageUrl?: string): Promise<string> {
  try {
    if (!prompt.trim()) {
      throw new Error('Empty prompt');
    }

    // Check if the question is about who created the AI
    if (isCreatorQuestion(prompt)) {
      return "I am AI Connect, created by Pratham Darji. I'm an intelligent chat interface powered by Google's Gemini AI, designed to make AI interactions more accessible and intuitive. While I use Gemini's capabilities for processing, my interface and implementation were developed by Pratham Darji.";
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
