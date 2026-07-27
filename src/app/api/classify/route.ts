import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { VALID_CATEGORIES, TrashCategory } from "@/lib/categories";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const CLASSIFICATION_PROMPT = `You are helping classify trash items at a community recycling event in the Philippines.
Identify the item in this photo and respond with exactly one of these categories:
- plastic bottle
- plastic wrapper/sachet
- paper/cardboard
- glass
- metal/can
- e-waste
- organic/food waste
- styrofoam
- other

Rules:
- Respond with ONLY the category name, nothing else.
- If the image is unclear or not a trash item, respond with "other".
- Choose the single best matching category.`;

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Server configuration error: API key not set." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided." },
        { status: 400 }
      );
    }

    // image is expected as a base64 data URL: "data:image/jpeg;base64,..."
    const base64Match = image.match(
      /^data:(image\/\w+);base64,(.+)$/
    );

    if (!base64Match) {
      return NextResponse.json(
        { error: "Invalid image format. Send a base64 data URL." },
        { status: 400 }
      );
    }

    const mimeType = base64Match[1];
    const base64Data = base64Match[2];

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const result = await model.generateContent([
      CLASSIFICATION_PROMPT,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const response = result.response;
    const text = response.text().trim().toLowerCase();

    // Match against known categories
    const matchedCategory: TrashCategory = VALID_CATEGORIES.find(
      (cat) => text.includes(cat)
    ) || "other";

    return NextResponse.json({
      category: matchedCategory,
      raw: text,
    });
  } catch (error: unknown) {
    console.error("Classification error:", error);

    // Handle rate limiting
    if (
      error instanceof Error &&
      (error.message.includes("429") ||
        error.message.includes("RESOURCE_EXHAUSTED") ||
        error.message.includes("quota"))
    ) {
      return NextResponse.json(
        {
          error:
            "Rate limit reached. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to classify image. Please try again." },
      { status: 500 }
    );
  }
}
