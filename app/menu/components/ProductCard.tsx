"use client";

import { useState } from "react";

type Size = {
  label: string;
  price: number;
};

type ProductProps = {
  name: string;
  description: string;
  price: number;
  image: string;
  hasSizes?: boolean;
  sizes?: Size[];
  onAdd: (product: any) => void;
};

export default function ProductCard({
  name,
  description,
  price,
  image,
  hasSizes = false,
  sizes = [],
  onAdd,
}: ProductProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const getDisplayPrice = () => {
    if (hasSizes && selectedSize) {
      const size = sizes.find((s) => s.label === selectedSize);
      return size ? size.price : 0;
    }
    if (hasSizes && !selectedSize) return 0;
    return price;
  };

  const handleAdd = () => {
    if (hasSizes && !selectedSize) {
      setShowError(true);
      return;
    }

    const selectedSizeData = sizes.find((s) => s.label === selectedSize);

    onAdd({
      name,
      description,
      image,
      price: selectedSizeData ? selectedSizeData.price : price,
      sizeLabel: selectedSize || null,
    });

    setSelectedSize("");
    setShowError(false);
  };

  return (
    <div className="bg-white rounded-3xl p-3 shadow-md hover:shadow-lg transition flex flex-col h-full">
      
      {/* IMAGE */}
      <div className="aspect-square rounded-2xl overflow-hidden flex-shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">☕</div>
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-2 flex flex-col flex-1">
        
        {/* NAME */}
        <h3 className="text-lg font-bold text-black">{name}</h3>
        
        {/* DESCRIPTION */}
        <p className="text-sm text-black/60 mt-0.5 line-clamp-2">
          {description}
        </p>

        {/* SIZES */}
        {hasSizes && sizes.length > 0 ? (
          <div className="flex gap-2 mt-2">
            {sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => {
                  setSelectedSize(size.label);
                  setShowError(false);
                }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  selectedSize === size.label
                    ? "bg-[#C08552] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{size.label}</span>
                <span className="block text-xs mt-0.5 opacity-80">{size.price} OMR</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {showError && hasSizes && (
          <p className="text-red-500 text-xs mt-1">Please select a size</p>
        )}

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-[#C08552]">
            {hasSizes && !selectedSize
              ? "Select size"
              : `${getDisplayPrice()} OMR`}
          </span>

          <button
            onClick={handleAdd}
            className="bg-[#C08552] text-white px-4 py-2 rounded-xl font-medium active:scale-95 transition"
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
}