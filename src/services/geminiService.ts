import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const enhancedPrompt = `
Please provide a well-structured response to: "${prompt}"

Format your response using the following markdown structure:

# Introduction
[Brief overview of the topic]

## Key Points
- Point 1
- Point 2
- Point 3

## Detailed Explanation
[Main content divided into paragraphs]

### Subtopics (if applicable)
1. [First subtopic]
2. [Second subtopic]

## Examples
- Example 1
- Example 2

## Practical Applications
[Real-world applications]

## Summary
[Brief conclusion]

Please ensure proper markdown formatting with headers, lists, and paragraphs.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error calling Gemini AI:', error);
    throw new Error('Failed to get AI response');
  }
}