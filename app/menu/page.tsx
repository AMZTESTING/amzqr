"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MoodSection from "./components/MoodSection";
import Categories from "./components/Categories";
import ProductCard from "./components/ProductCard";
import { staticProducts } from "./components/products";

export default function MenuPage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
  setLoading(true);
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading products:", error);
      // Use static products as fallback
      setProducts(staticProducts);
    } else if (data && data.length > 0) {
      setProducts(data);
    } else {
      setProducts(staticProducts);
    }
  } catch (err) {
    console.error("Failed to load products:", err);
    // Use static products as fallback
    setProducts(staticProducts);
  }
  
  // Stop loading after max 5 seconds
  setTimeout(() => {
    setLoading(false);
  }, 5000);
  
  setLoading(false);
};

  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (err) {
      console.log("Cart error:", err);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = selectedCategory === "all" ? true : p.category === selectedCategory;
    const matchesSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    setCart((prev) => {
      const cartItem = { ...product, cartId: Date.now(), qty: 1 };
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (cartId: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQty = (cartId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, qty: newQty } : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (parseInt(item.price) || 0) * (item.qty || 1), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#F3E9DC] pb-20">
      <Header />

      <div className="px-4 md:px-8 lg:px-12 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block">
            <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <MoodSection onAddToCart={(product) => addToCart(product)} />

            <div className="lg:hidden">
              <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                {selectedCategory === "all"
                  ? "Popular Menu"
                  : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h2>
              <button onClick={loadProducts} className="text-[#C08552] font-medium">
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    hasSizes={product.hasSizes}
                    sizes={product.sizes}
                    onAdd={(cartItem) => addToCart({ ...product, ...cartItem })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ FLOATING CART BUTTON (وسط الشاشة) ============ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3">
          
          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <div className="relative flex-shrink-0">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C08552] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="text-left min-w-0">
              <p className="text-[10px] text-gray-400">Your Order</p>
              {totalItems > 0 ? (
                <p className="font-bold text-[#C08552] text-xs">{totalPrice} AED</p>
              ) : (
                <p className="text-[10px] text-gray-400">Empty</p>
              )}
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-7 bg-gray-200 flex-shrink-0" />

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`px-3 py-2 rounded-xl font-bold text-xs text-white transition flex-shrink-0 ${
              cart.length > 0
                ? "bg-[#C08552] hover:opacity-90 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Checkout
          </button>

        </div>
      </div>

      {/* ============ CART POPUP ============ */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-[28px] p-5 shadow-2xl animate-slideUp max-h-[70vh] flex flex-col">
            
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">🛒 Your Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            {cart.length === 0 ? (
              <div className="text-center py-12 flex-1">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {cart.map((item: any) => (
                  <div
                    key={item.cartId || item.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    {/* Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">☕</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      {item.sizeLabel && (
                        <p className="text-xs text-gray-400">{item.sizeLabel}</p>
                      )}
                      <p className="text-[#C08552] font-bold text-sm mt-0.5">
                        {(parseInt(item.price) || 0) * (item.qty || 1)} AED
                      </p>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(item.cartId, (item.qty || 1) - 1)}
                        className="w-6 h-6 bg-gray-200 rounded-lg text-xs font-bold"
                      >-</button>
                      <span className="font-bold text-xs w-4 text-center">{item.qty || 1}</span>
                      <button
                        onClick={() => updateQty(item.cartId, (item.qty || 1) + 1)}
                        className="w-6 h-6 bg-gray-200 rounded-lg text-xs font-bold"
                      >+</button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-red-400 hover:text-red-600 text-lg"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom */}
            {cart.length > 0 && (
              <div className="border-t pt-3">
                <div className="flex justify-between mb-3">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-[#C08552] text-lg">{totalPrice} AED</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#C08552] text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition"
                >
                  Checkout • {totalPrice} AED
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.35s cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}