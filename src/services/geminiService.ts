import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const artificialDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    await artificialDelay();

    if (prompt.toLowerCase().includes('hey')) {
      return "Hello there! 👋 How can I help you today?";
    }
    
    if (prompt.toLowerCase().includes('how are you')) {
      return "I'm doing great, thank you for asking! How are you? 😊";
    }
    
    if (prompt.toLowerCase().includes('who made you') || prompt.toLowerCase().includes('who created you') || prompt.toLowerCase().includes('who built you')) {
      return "I was created by Pratham Darji. He uses Google's Gemini AI to help me answer your questions! 🚀";
    }

    const enhancedPrompt = `
Respond to: "${prompt}"

Guidelines for response:
1. For code-related questions:
   - Always wrap code blocks with triple backticks and specify the language
   - Format code with proper indentation
   - Add brief comments for complex logic
   - Include example usage where applicable
   - Structure the response as:
     # Solution
     [Brief explanation]
     
     ## Code Example
     [Properly formatted code block]
     
     ## Usage Example
     [How to use the code]

2. For knowledge-based questions:
   # Quick Answer
   [Concise answer]

   ## Key Details
   - Most relevant point
   - Second most relevant point
   - Third most relevant point

   ## Explanation
   [Focused explanation]

3. For conceptual questions:
   # Overview
   [Main concept]

   ## Details
   [Detailed explanation]

   ## Examples
   [Practical examples]

Note: 
- Keep responses focused and concise
- Use proper markdown formatting
- For code blocks, ensure syntax highlighting by specifying language
- Include only relevant sections`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    throw new Error("Failed to get AI response");
  }
}
