"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Coffee, Car, Gift } from "lucide-react";

export default function Header() {
  const [orderMode, setOrderMode] = useState("dinein");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem("orderMode");
    if (mode) setOrderMode(mode);
  }, []);

  const changeMode = (mode: string) => {
    setOrderMode(mode);
    localStorage.setItem("orderMode", mode);
    setOpen(false);
  };

  const getLabel = () => {
    switch (orderMode) {
      case "car":
        return "Car Order";
      case "gift":
        return "Gift Card";
      default:
        return "Dine In";
    }
  };

  const getIcon = () => {
    switch (orderMode) {
      case "car":
        return <Car size={18} />;
      case "gift":
        return <Gift size={18} />;
      default:
        return <Coffee size={18} />;
    }
  };

  return (
    <div className="bg-[#C08552] text-[#F3E9DC] px-5 py-6 rounded-b-[30px] relative">
      
      <div className="flex justify-between items-center">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-bold">AMZQR</h1>
          <p className="text-sm opacity-80">Specialty Coffee</p>
        </div>

        {/* CENTER MODE SWITCH */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition"
          >
            {getIcon()}
            <span className="text-sm font-medium">
              {getLabel()}
            </span>
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute top-12 left-0 w-44 bg-white text-black rounded-xl shadow-xl overflow-hidden z-50">

              <button
                onClick={() => changeMode("dinein")}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
              >
                <Coffee size={16} />
                Dine In
              </button>

              <button
                onClick={() => changeMode("car")}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
              >
                <Car size={16} />
                Car Order
              </button>

              <button
                onClick={() => changeMode("gift")}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
              >
                <Gift size={16} />
                Gift Card
              </button>

            </div>
          )}

        </div>

        {/* RIGHT */}
        <div className="w-10 h-10 bg-[#F3E9DC]/20 rounded-full backdrop-blur-md" />

      </div>
    </div>
  );
}