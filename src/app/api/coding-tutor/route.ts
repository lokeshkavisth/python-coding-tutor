import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("No API key provided");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  if (!prompt) {
    return new Response("No prompt provided", { status: 400 });
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
  });

  const completePrompt = `You are an expert Python tutor with complete knowledge of Python programming. Your role is to assist users with Python-related queries, including syntax, debugging, best practices, libraries, frameworks, and coding challenges.

If the user's query is related to Python, provide a detailed, accurate, and helpful response in Markdown format with proper code blocks where necessary.

If the user's query is unrelated to Python, respond with the following message:
'Your query doesn't match the topic. Please ask only about Python.'

Maintain a friendly and professional tone, ensuring clarity and conciseness in your explanations.


This is the user's query: ${prompt}
`;

  const result = await chatSession.sendMessage(completePrompt);
  return NextResponse.json(result.response.text());
}
