"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const slides = [
  {
    id: "mood",
    title: "What's Your Mood?",
    button: "Play Now",
    emoji: "🎭",
  },
  {
    id: "dice",
    title: "Random Coffee Challenge",
    button: "Roll Dice",
    emoji: "🎲",
  },
];

const moods = [
  { id: "chill", label: "Chill Flow", emoji: "🌿" },
  { id: "energy", label: "Energy Boost", emoji: "⚡" },
  { id: "sweet", label: "Sweet Escape", emoji: "🍫" },
  { id: "focus", label: "Focus Mode", emoji: "🧠" },
];

const moodKeywords: any = {
  chill: ["latte", "flat white", "spanish", "iced", "cold", "caramel", "vanilla"],
  energy: ["espresso", "double", "americano", "black", "strong", "dark"],
  sweet: ["mocha", "chocolate", "pistachio", "caramel", "hazelnut", "sweet"],
  focus: ["cold brew", "black", "americano", "green tea", "matcha", "brew"],
};

export default function MoodSection({ onAddToCart }: { onAddToCart?: (product: any) => void }) {
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  // MODALS
  const [moodOpen, setMoodOpen] = useState(false);
  const [diceOpen, setDiceOpen] = useState(false);

  // MOOD STATE
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [moodResult, setMoodResult] = useState<any>(null);

  // DICE STATE
  const [rolling, setRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<any>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      setProducts(data);
    }
  };

  function next() {
    setIndex((prev) => (prev + 1) % slides.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function pickMood(mood: any) {
    setSelectedMood(mood);

    const keywords = moodKeywords[mood.id] || [];

    let matches = products.filter((p) =>
      keywords.some(
        (kw: string) =>
          p.name.toLowerCase().includes(kw) ||
          (p.description && p.description.toLowerCase().includes(kw))
      )
    );

    if (matches.length === 0) {
      matches = products;
    }

    const random = matches[Math.floor(Math.random() * matches.length)];
    setMoodResult(random);
  }

  function rollDice() {
    if (products.length === 0) return;

    setRolling(true);
    setDiceResult(null);

    let count = 0;
    const interval = setInterval(() => {
      const random = products[Math.floor(Math.random() * products.length)];
      setDiceResult(random);
      count++;

      if (count > 12) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);
  }

  function addResultToCart(product: any) {
    if (onAddToCart && product) {
      if (product.hasSizes && product.sizes && product.sizes.length > 0) {
        onAddToCart({
          ...product,
          price: product.sizes[0].price,
          sizeLabel: product.sizes[0].label,
        });
      } else {
        onAddToCart(product);
      }
    }
  }

  const getProductPrice = (product: any) => {
    if (product && product.hasSizes && product.sizes && product.sizes.length > 0) {
      return `From ${product.sizes[0].price} OMR`;
    }
    return product ? `${product.price} OMR` : "";
  };

  return (
    <div className="mt-5">
      {/* SLIDER */}
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {/* MOOD SLIDE */}
          <div className="min-w-full p-5 flex justify-between items-center shadow-xl rounded-3xl border border-white/20 bg-gradient-to-br from-[#C08552] via-[#9b6b43] to-[#6f4e37] text-white min-h-[110px]">
            <div>
              <h2 className="text-xl font-bold">What's Your Mood?</h2>
              <button
                onClick={() => setMoodOpen(true)}
                className="mt-3 bg-white text-[#C08552] px-5 py-2 rounded-xl font-semibold active:scale-95"
              >
                Play Now
              </button>
            </div>
            <div className="text-4xl drop-shadow-lg animate-bounce">🎭</div>
          </div>

          {/* DICE SLIDE */}
          <div className="min-w-full p-5 flex justify-between items-center shadow-xl rounded-3xl border border-white/20 bg-gradient-to-br from-[#C08552] via-[#9b6b43] to-[#6f4e37] text-white min-h-[110px]">
            <div>
              <h2 className="text-xl font-bold">Random Coffee Challenge</h2>
              <button
                onClick={() => setDiceOpen(true)}
                className="mt-3 bg-white text-[#C08552] px-5 py-2 rounded-xl font-semibold active:scale-95"
              >
                Roll Dice
              </button>
            </div>
            <div className="text-4xl drop-shadow-lg animate-bounce">🎲</div>
          </div>
        </div>
      </div>

      {/* ARROWS */}
      <div className="flex justify-between mt-3 px-2">
        <button onClick={prev} className="text-2xl text-[#C08552] font-bold">‹</button>
        <button onClick={next} className="text-2xl text-[#C08552] font-bold">›</button>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              index === i ? "bg-[#C08552] w-4" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>

      {/* ==================== MOOD MODAL ==================== */}
      {moodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-popIn relative overflow-hidden">
            
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C08552]/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#C08552]/10 rounded-full" />

            <div className="relative z-10">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl">How are you feeling?</h3>
                <button
                  onClick={() => {
                    setMoodOpen(false);
                    setSelectedMood(null);
                    setMoodResult(null);
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              {/* Mood Grid or Result */}
              {!selectedMood ? (
                <div className="grid grid-cols-2 gap-3">
                  {moods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => pickMood(m)}
                      className="group p-5 bg-gray-50 rounded-2xl hover:bg-[#C08552] hover:text-white transition-all duration-300 active:scale-95"
                    >
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{m.emoji}</div>
                      <div className="font-semibold text-sm">{m.label}</div>
                    </button>
                  ))}
                </div>
              ) : moodResult ? (
                <div className="text-center">
                  <div className="text-4xl mb-2 animate-bounce">{selectedMood.emoji}</div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Recommended for you</p>
                  
                  <div className="mt-3 flex justify-center">
                    <div className="w-48 aspect-square rounded-2xl overflow-hidden shadow-md">
                      {moodResult.image ? (
                        <img src={moodResult.image} alt={moodResult.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-5xl">☕</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h2 className="font-bold text-[#C08552] text-xl">{moodResult.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">{getProductPrice(moodResult)}</p>
                    {moodResult.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{moodResult.description}</p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { setSelectedMood(null); setMoodResult(null); }}
                      className="flex-1 border-2 border-gray-200 py-3 rounded-2xl font-medium hover:bg-gray-50 transition"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => {
                        addResultToCart(moodResult);
                        setMoodOpen(false);
                        setSelectedMood(null);
                        setMoodResult(null);
                      }}
                      className="flex-1 bg-[#C08552] text-white py-3 rounded-2xl font-bold hover:opacity-90 transition active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🔍</div>
                  <p className="text-gray-400">No match found</p>
                  <button
                    onClick={() => { setSelectedMood(null); setMoodResult(null); }}
                    className="mt-4 border px-6 py-2 rounded-xl font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== DICE MODAL ==================== */}
      {diceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-popIn relative overflow-hidden">
            
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C08552]/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#C08552]/10 rounded-full" />

            <div className="relative z-10 text-center">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl">🎲 Random Coffee</h3>
                <button
                  onClick={() => {
                    setDiceOpen(false);
                    setDiceResult(null);
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              {/* Dice Animation Area */}
              <div className="py-6">
                {rolling ? (
                  <div className="space-y-4">
                    <div className="text-6xl animate-bounce">🎲</div>
                    <p className="text-gray-400 font-medium animate-pulse">Rolling...</p>
                    {diceResult && (
                      <p className="text-[#C08552] font-bold text-lg animate-pulse">
                        {diceResult.name}
                      </p>
                    )}
                  </div>
                ) : diceResult ? (
                  <div className="space-y-4">
                    <div className="text-4xl">🎉</div>
                    
                    <div className="flex justify-center">
                      <div className="w-48 aspect-square rounded-2xl overflow-hidden shadow-md">
                        {diceResult.image ? (
                          <img src={diceResult.image} alt={diceResult.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-5xl">☕</div>
                        )}
                      </div>
                    </div>

                    <h2 className="font-bold text-[#C08552] text-xl">{diceResult.name}</h2>
                    <p className="text-gray-400 text-sm">{getProductPrice(diceResult)}</p>
                    {diceResult.description && (
                      <p className="text-gray-500 text-xs line-clamp-2">{diceResult.description}</p>
                    )}

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={rollDice}
                        className="flex-1 border-2 border-gray-200 py-3 rounded-2xl font-medium hover:bg-gray-50 transition"
                      >
                        🔄 Roll Again
                      </button>
                      <button
                        onClick={() => {
                          addResultToCart(diceResult);
                          setDiceOpen(false);
                          setDiceResult(null);
                        }}
                        className="flex-1 bg-[#C08552] text-white py-3 rounded-2xl font-bold hover:opacity-90 transition active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-7xl">🎲</div>
                    <p className="text-gray-500">Let fate choose your coffee!</p>
                    <button
                      onClick={rollDice}
                      className="bg-[#C08552] text-white px-8 py-4 rounded-2xl font-bold text-lg active:scale-95 hover:opacity-90 transition"
                    >
                      🎲 Roll the Dice
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style jsx>{`
        .animate-popIn {
          animation: popIn 0.35s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        @keyframes popIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          70% {
            transform: scale(1.02);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}