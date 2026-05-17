import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent("Hello");

    const text = result.response.text();

    return Response.json({
      reply: text,
    });

  } catch (error: any) {
    console.log("ERROR:", error);

    return Response.json({
      reply: "FAILED",
    });
  }
}