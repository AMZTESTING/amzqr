"use client";

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
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1ed]">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 px-5 py-5 max-w-lg mx-auto">

        {/* Top Bar */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2.5 backdrop-blur-xl shadow-md text-sm">
            <Globe size={16} />
            EN
          </button>
        </div>

        {/* Logo */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 text-2xl font-bold shadow-xl backdrop-blur-xl">
            A
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#1a1a1a]">
            AMZQR
          </h1>
          <p className="mt-1.5 text-sm text-black/70">
            Smart Coffee Ordering
          </p>
        </div>

        {/* Hero */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111]">
            Order Your Coffee
            <span className="block text-[#b07b4f]">
              Instantly
            </span>
          </h2>
          <p className="mt-3 text-sm text-black/60">
            Skip the queue and enjoy your coffee experience
          </p>
        </div>

        {/* Cards */}
        <div className="mt-8 space-y-4">

          {/* DINE IN */}
          <Link
            href="/menu"
            className="block"
            onClick={() => {
              localStorage.setItem("orderMode", "dinein");
            }}
          >
            <div className="flex items-center justify-between rounded-[28px] bg-white/35 p-4 shadow-xl backdrop-blur-2xl border border-white/30 active:scale-[0.98] transition">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md">
                  <Coffee size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dine In</h3>
                  <p className="text-xs text-black/60">Order from your table</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </div>
          </Link>

          {/* CAR ORDER */}
          <Link
            href="/menu"
            className="block"
            onClick={() => {
              localStorage.setItem("orderMode", "car");
            }}
          >
            <div className="flex items-center justify-between rounded-[28px] bg-white/35 p-4 shadow-xl backdrop-blur-2xl border border-white/30 active:scale-[0.98] transition">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Car Order</h3>
                  <p className="text-xs text-black/60">We'll bring it to your car</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </div>
          </Link>

          {/* GIFT CARD */}
          <Link
            href="/menu"
            className="block"
            onClick={() => {
              localStorage.setItem("orderMode", "gift");
            }}
          >
            <div className="flex items-center justify-between rounded-[28px] bg-white/35 p-4 shadow-xl backdrop-blur-2xl border border-white/30 active:scale-[0.98] transition">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-md">
                  <Gift size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gift Cards</h3>
                  <p className="text-xs text-black/60">Send gifts instantly</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </div>
          </Link>

        </div>

        {/* AI BOX */}
        <div className="mt-5 rounded-[28px] bg-gradient-to-r from-[#b07b4f] to-[#8d5d37] p-5 text-white shadow-2xl active:scale-[0.98] transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <h4 className="text-base font-semibold">Ask AMZ AI</h4>
              </div>
              <p className="mt-1.5 text-sm text-white/80">
                Let AI recommend your perfect order
              </p>
            </div>
            <ChevronRight size={20} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pb-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-1 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#b07b4f] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="text-lg font-bold text-[#1a1a1a]">AMZQR</span>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-12 bg-black/10" />
            <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-medium">
              Powered by
            </p>
            <div className="h-px w-12 bg-black/10" />
          </div>

          {/* Name */}
          <p className="text-sm font-bold text-[#b07b4f] tracking-wide">
            Ali Zakeri
          </p>
          
          {/* Subtitle */}
          <p className="text-[10px] text-black/30 mt-0.5">
            Smart Coffee Ordering System
          </p>
        </div>

      </div>
    </main>
  );
}