import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY
});

export interface ImageAnalysisResult {
  original: {
    description: string;
    elements: string[];
    mood: string;
  };
  mirror: {
    description: string;
    elements: string[];
    mood: string;
  };
}

export async function analyzeImage(base64Image: string): Promise<ImageAnalysisResult> {
  try {
    // First, get the original analysis
    const originalContents = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
      `Analyze this image in detail. Describe what you see, identify key visual elements (limit to 4 most important), and describe the overall mood or atmosphere. 
      
      Respond with JSON in this exact format: { "description": "detailed description", "elements": ["element1", "element2", "element3", "element4"], "mood": "mood description" }`,
    ];

    const originalResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: "You are an expert image analyst. Analyze the image and provide a detailed description, key elements, and mood.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            description: { type: "string" },
            elements: { 
              type: "array",
              items: { type: "string" },
              maxItems: 4
            },
            mood: { type: "string" },
          },
          required: ["description", "elements", "mood"],
        },
      },
      contents: originalContents,
    });

    const originalAnalysis = JSON.parse(originalResponse.text || "{}");

    // Now generate the mirror universe version
    const mirrorResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: "You are a creative AI that generates 'mirror universe' interpretations. Given an original image analysis, create a completely opposite, alternative reality version that inverts the key concepts, mood, and elements while maintaining the same structural format. Be creative and imaginative.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            description: { type: "string" },
            elements: { 
              type: "array",
              items: { type: "string" },
              maxItems: 4
            },
            mood: { type: "string" },
          },
          required: ["description", "elements", "mood"],
        },
      },
      contents: `Create a mirror universe interpretation of this image analysis. Invert and reverse all concepts to create an opposite reality version:

Original Analysis:
- Description: ${originalAnalysis.description}
- Elements: ${originalAnalysis.elements?.join(', ')}
- Mood: ${originalAnalysis.mood}

Generate the complete opposite interpretation as if this image existed in a parallel universe where everything is inverted.`,
    });

    const mirrorAnalysis = JSON.parse(mirrorResponse.text || "{}");

    return {
      original: {
        description: originalAnalysis.description || "Unable to analyze image",
        elements: originalAnalysis.elements || [],
        mood: originalAnalysis.mood || "Unknown"
      },
      mirror: {
        description: mirrorAnalysis.description || "Unable to generate mirror analysis",
        elements: mirrorAnalysis.elements || [],
        mood: mirrorAnalysis.mood || "Unknown"
      }
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please check your Gemini API key and try again.");
  }
}