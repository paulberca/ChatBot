import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000", // optional, replace with your site URL when deployed
        "X-Title": "My Chatbot", // optional, your site name
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    // Log raw response for debugging
    const text = await response.text();
    console.log("OpenRouter raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json({ reply: "Invalid response from OpenRouter" });
    }

    // Extract reply safely
    const reply =
      data.choices?.[0]?.message?.content ||
      data.choices?.[0]?.message ||
      "No response";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Error fetching response." }, { status: 500 });
  }
}
