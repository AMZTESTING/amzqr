"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("pin", pin)
      .single();

    if (data) {
      localStorage.setItem("staffUser", JSON.stringify(data));
      localStorage.setItem("staffLoggedIn", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid PIN code");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#C08552] to-[#6f4e37] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C08552]/10 mb-4">
            <Lock size={32} className="text-[#C08552]" />
          </div>
          <h1 className="text-2xl font-bold">Staff Login</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your PIN to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              maxLength={6}
              className="w-full border rounded-xl px-4 py-3 text-center text-2xl tracking-widest"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full bg-[#C08552] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}