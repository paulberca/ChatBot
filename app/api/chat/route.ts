import { NextResponse } from "next/server";

function extractText(content: any): string {
  // content can be an array of objects or a string
  if (!content) return "";
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    // concatenate all text pieces
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item.type === "text" && item.text) return item.text;
        return "";
      })
      .join("\n");
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "My Chatbot",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = extractText(data.choices?.[0]?.message?.content);

    return NextResponse.json({ reply: reply || "No response" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching response." }, { status: 500 });
  }
}
