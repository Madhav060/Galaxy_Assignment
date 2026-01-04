import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const generateRequestSchema = z.object({
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  userMessage: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = generateRequestSchema.parse(body);
    const { systemPrompt, userMessage, images } = validatedData;

    // Validate inputs - userMessage (Prompt*) is required
    if (!userMessage || userMessage.trim() === "") {
      return NextResponse.json(
        { error: "Prompt* (user message) is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use the working multimodal model from your list
    const modelToUse = "gemini-2.5-flash";
    
    const genModel = genAI.getGenerativeModel({ model: modelToUse });

    // --- KEY FIX: Contextualize the Prompt ---
    // We prefix the user's message to force the model to look at the image.
    // This solves the "clubbing" issue.
    let finalPrompt = "";
    
    if (systemPrompt) {
      finalPrompt += `System Instructions: ${systemPrompt}\n\n`;
    }
    
    // Explicitly link the image to the question
    if (images && images.length > 0) {
      finalPrompt += `Refer to the attached image(s) to answer the following user question. \nUser Question: ${userMessage || "Describe this image."}`;
    } else {
      finalPrompt += userMessage || "";
    }

    let result;

    if (images && images.length > 0) {
      const imageParts = images.map((imageData) => {
        let base64Data = imageData;
        let mimeType = "image/jpeg";
        if (imageData.includes(",")) {
          const [header, data] = imageData.split(",");
          base64Data = data;
          const mimeMatch = header.match(/data:([^;]+)/);
          if (mimeMatch) mimeType = mimeMatch[1];
        }
        return {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        };
      });

      // Pass the images FIRST, then the text prompt
      // This helps the model "see" the image before reading the question
      const parts: any[] = [...imageParts, { text: finalPrompt }];

      result = await genModel.generateContent(parts);
    } else {
      result = await genModel.generateContent(finalPrompt);
    }

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text }, { status: 200 });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Detailed error logging for debugging
    let errorMessage = "Failed to generate content";
    if (error instanceof Error) errorMessage = error.message;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}