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
      <div className="relative z-10 px-6 py-6">

        {/* Top Bar */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-full bg-white/50 px-5 py-3 backdrop-blur-xl shadow-md">
            <Globe size={18} />
            EN
          </button>
        </div>

        {/* Logo */}
        <div className="mt-8 flex flex-col items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/60 text-3xl font-bold shadow-xl backdrop-blur-xl">
            A
          </div>

          <h1 className="mt-5 text-6xl font-bold text-[#1a1a1a]">
            AMZQR
          </h1>

          <p className="mt-2 text-lg text-black/70">
            Smart Coffee Ordering
          </p>

        </div>

        {/* Hero */}
        <div className="mt-14 text-center">

          <h2 className="text-5xl font-bold leading-tight text-[#111]">
            Order Your Coffee

            <span className="block text-[#b07b4f]">
              Instantly
            </span>
          </h2>

          <p className="mt-5 text-lg text-black/60">
            Skip the queue and enjoy your coffee experience
          </p>

        </div>

        {/* Cards */}
        <div className="mt-12 space-y-5">

          {/* DINE IN */}
          <Link
            href="/menu"
            className="block"
            onClick={() => {
              localStorage.setItem("orderMode", "dinein");
            }}
          >

            <div className="flex items-center justify-between rounded-[32px] bg-white/35 p-5 shadow-xl backdrop-blur-2xl border border-white/30">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-md">
                  <Coffee size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Dine In
                  </h3>

                  <p className="text-black/60">
                    Order from your table
                  </p>
                </div>

              </div>

              <ChevronRight />

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

            <div className="flex items-center justify-between rounded-[32px] bg-white/35 p-5 shadow-xl backdrop-blur-2xl border border-white/30">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-md">
                  <Car size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Car Order
                  </h3>

                  <p className="text-black/60">
                    We’ll bring it to your car
                  </p>
                </div>

              </div>

              <ChevronRight />

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

            <div className="flex items-center justify-between rounded-[32px] bg-white/35 p-5 shadow-xl backdrop-blur-2xl border border-white/30">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-md">
                  <Gift size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Gift Cards
                  </h3>

                  <p className="text-black/60">
                    Send gifts instantly
                  </p>
                </div>

              </div>

              <ChevronRight />

            </div>

          </Link>

        </div>

        {/* AI BOX */}
        <div className="mt-6 rounded-[32px] bg-gradient-to-r from-[#b07b4f] to-[#8d5d37] p-6 text-white shadow-2xl">

          <div className="flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2">
                <Sparkles size={20} />

                <h4 className="text-xl font-semibold">
                  Ask AMZ AI
                </h4>
              </div>

              <p className="mt-2 text-white/80">
                Let AI recommend your perfect order
              </p>

            </div>

            <ChevronRight />

          </div>

        </div>

      </div>

    </main>
  );
}