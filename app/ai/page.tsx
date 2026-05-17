"use client";

import { useState } from "react";

export default function AIPage() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {

    if (!message) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await res.json();

    const aiMessage = {
      role: "ai",
      text: data.reply,
    };

    setMessages((prev) => [...prev, aiMessage]);

    setMessage("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#F3E9DC] p-5">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-5">
          Coffee AI ☕
        </h1>

        {/* CHAT */}
        <div className="bg-white rounded-3xl p-4 h-[500px] overflow-y-auto shadow-md">

          <div className="space-y-3">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`p-3 rounded-2xl max-w-[80%] ${
                  msg.role === "user"
                    ? "ml-auto bg-[#C08552] text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {msg.text}
              </div>

            ))}

            {loading && (
              <div className="bg-gray-100 p-3 rounded-2xl w-fit">
                Typing...
              </div>
            )}

          </div>

        </div>

        {/* INPUT */}
        <div className="flex gap-2 mt-4">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 border rounded-2xl p-4"
          />

          <button
            onClick={sendMessage}
            className="bg-[#C08552] text-white px-6 rounded-2xl"
          >
            Send
          </button>

        </div>

      </div>

    </main>
  );
}