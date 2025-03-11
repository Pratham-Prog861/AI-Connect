import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const artificialDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 1000));

export async function getGeminiResponse(prompt: string, imageUrl?: string): Promise<string> {
  try {
    // Use gemini-pro-vision for image analysis, otherwise use gemini-pro
    const modelName = imageUrl ? "gemini-2.0-flash" : "gemini-pro";
    const model = genAI.getGenerativeModel({ model: modelName });

    await artificialDelay();

    if (imageUrl) {
      // For image analysis
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      
      // Convert blob to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageBlob);
      });

      // Prepare image part for the model
      const imagePart = {
        inlineData: {
          data: (base64Image as string).split(',')[1],
          mimeType: 'image/jpeg'
        }
      };

      // Generate content with both image and text
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text().trim();
    }

    if (prompt.toLowerCase().includes("hey")) {
      return "Hello there! 👋 How can I help you today?";
    }

    if (prompt.toLowerCase().includes("how are you")) {
      return "I'm doing great, thank you for asking! How are you? 😊";
    }

    if (
      prompt.toLowerCase().includes("who made you") ||
      prompt.toLowerCase().includes("who created you") ||
      prompt.toLowerCase().includes("who built you")
    ) {
      return "I was created by Pratham Darji. He uses Google's Gemini AI to help me answer your questions! 🚀";
    }

    const enhancedPrompt = `
Respond to: "${prompt}"

Guidelines:
1. For **code-related questions**:
   - Use properly formatted code blocks with syntax highlighting.
   - Briefly explain complex logic with comments.
   - Provide example usage if applicable.
   - Structure:
     # Solution
     [Brief explanation]
     
     ## Code
     [Code block]

     ## Example
     [Usage example]

2. For **knowledge-based questions**:
   - Start with a **Quick Answer**.
   - List **Key Details** (most relevant points).
   - Provide an **Explanation**.

3. For **conceptual questions**:
   - Start with an **Overview**.
   - Follow with **Details** (elaboration).
   - Add **Examples** (practical applications).

Note: Keep responses concise, focused, and formatted in proper markdown.
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    throw new Error("Failed to get AI response");
  }
}
