"use client";

import { categories } from "@/lib/categories";

export default function Categories({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-5 text-center">Categories</h3>

      <div className="flex gap-4 overflow-x-auto px-2">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => onSelect(cat.name)}
            className={`min-w-[110px] flex flex-col items-center transition ${
              selected === cat.name
                ? "opacity-100 scale-105"
                : "opacity-60 hover:opacity-80"
            }`}
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-sm mt-2 font-medium text-black/80 text-center">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}