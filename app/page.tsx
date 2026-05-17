"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Coffee,
  Car,
  Gift,
  Sparkles,
  ChevronRight,
  Globe,
} from "lucide-react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: "ai", text: "☕ Hey! Ask me anything!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const sendToAI = async (userMsg: string) => {
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAQWoxRVdWf2wjZ1Mbku0_DXfJbbBMkoas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMsg }] }],
          }),
        }
      );
      const data = await res.json();
      const reply = data.candidates[0].content.parts[0].text;
      setChatMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "ai", text: "Sorry, try again!" }]);
    }
    setChatLoading(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1ed]">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

      <div className="relative z-10 px-5 py-5 max-w-lg mx-auto">
        
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2.5 backdrop-blur-xl shadow-md text-sm">
            <Globe size={16} /> EN
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 text-2xl font-bold shadow-xl backdrop-blur-xl">A</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#1a1a1a]">AMZQR</h1>
          <p className="mt-1.5 text-sm text-black/70">Smart Coffee Ordering</p>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111]">
            Order Your Coffee <span className="block text-[#b07b4f]">Instantly</span>
          </h2>
          <p className="mt-3 text-sm text-black/60">Skip the queue and enjoy your coffee experience</p>
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/menu" className="block" onClick={() => localStorage.setItem("orderMode", "dinein")}>
            <div className="flex items-center justify-between rounded-[28px] bg-white/35 p-4 shadow-xl backdrop-blur-2xl border border-white/30 active:scale-[0.98] transition">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md"><Coffee size={24} /></div>
                <div><h3 className="text-lg font-semibold">Dine In</h3><p className="text-xs text-black/60">Order from your table</p></div>
              </div>
              <ChevronRight size={20} />
            </div>
          </Link>

          <Link href="/menu" className="block" onClick={() => localStorage.setItem("orderMode", "car")}>
            <div className="flex items-center justify-between rounded-[28px] bg-white/35 p-4 shadow-xl backdrop-blur-2xl border border-white/30 active:scale-[0.98] transition">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md"><Car size={24} /></div>
                <div><h3 className="text-lg font-semibold">Car Order</h3><p className="text-xs text-black/60">We'll bring it to your car</p></div>
              </div>
              <ChevronRight size={20} />
            </div>
          </Link>

          <Link href="/menu" className="block" onClick={() => localStorage.setItem("orderMode", "gift")}>
            <div className="flex items-center justify-between rounded-[28px] bg-white/35 p-4 shadow-xl backdrop-blur-2xl border border-white/30 active:scale-[0.98] transition">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md"><Gift size={24} /></div>
                <div><h3 className="text-lg font-semibold">Gift Cards</h3><p className="text-xs text-black/60">Send gifts instantly</p></div>
              </div>
              <ChevronRight size={20} />
            </div>
          </Link>
        </div>

        <div onClick={() => setChatOpen(true)} className="mt-5 rounded-[28px] bg-gradient-to-r from-[#b07b4f] to-[#8d5d37] p-5 text-white shadow-2xl active:scale-[0.98] transition cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2"><Sparkles size={18} /><h4 className="text-base font-semibold">Ask AMZ AI</h4></div>
              <p className="mt-1.5 text-sm text-white/80">Chat with AI</p>
            </div>
            <ChevronRight size={20} />
          </div>
        </div>

        <div className="mt-10 pb-8 text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#b07b4f] flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-lg font-bold text-[#1a1a1a]">AMZQR</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-12 bg-black/10" />
            <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-medium">Powered by</p>
            <div className="h-px w-12 bg-black/10" />
          </div>
          <p className="text-sm font-bold text-[#b07b4f] tracking-wide">Ali Zakeri</p>
          <p className="text-[10px] text-black/30 mt-0.5">Smart Coffee Ordering System</p>
        </div>
      </div>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-[450px] rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-[#b07b4f] to-[#8d5d37] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
                <div><h3 className="font-bold">AMZ AI</h3><p className="text-xs text-white/70">Ask me anything</p></div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg: any, i: number) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === "user" ? "bg-[#C08552] text-white rounded-br-lg" : "bg-gray-100 text-gray-800 rounded-bl-lg"}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl"><p className="text-sm text-gray-400 animate-pulse">...</p></div>
                </div>
              )}
            </div>

            <div className="p-3 border-t">
              <form onSubmit={(e) => { e.preventDefault(); if (!chatInput.trim()) return; sendToAI(chatInput.trim()); }} className="flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type anything..." className="flex-1 border rounded-xl px-4 py-2 text-sm" />
                <button type="submit" className="bg-[#C08552] text-white px-4 py-2 rounded-xl text-sm font-bold">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}