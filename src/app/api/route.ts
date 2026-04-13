import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.messages) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: body.messages,
    });

    const theResponse = completion.choices[0].message;

    return NextResponse.json({ output: theResponse }, { status: 200 });
  } catch (error: unknown) {
    console.error("OpenAI API Error:", error);
    
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = (error as { status?: number })?.status || 500;

    return NextResponse.json(
      { error: message },
      { status: status }
    );
  }
}


