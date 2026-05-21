"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Coffee, CheckCircle, Clock, Package, ArrowRight, ArrowLeft, Receipt, MapPin } from "lucide-react";

export default function TrackingPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("pending");
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lastOrder");
    if (saved) {
      const data = JSON.parse(saved);
      setOrder(data);
      checkOrderStatus(data.orderId);
      const interval = setInterval(() => checkOrderStatus(data.orderId), 3000);
      return () => clearInterval(interval);
    } else {
      router.push("/menu");
    }
  }, []);

  const checkOrderStatus = async (orderId: string) => {
    const savedStatus = localStorage.getItem(`order_status_${orderId}`);
    if (savedStatus) setStatus(savedStatus);
    try {
      const { data } = await supabase.from("orders").select("status").eq("id", orderId).single();
      if (data?.status) {
        setStatus(data.status);
        localStorage.setItem(`order_status_${orderId}`, data.status);
      }
    } catch (err) {}
  };

  const getStatusStep = () => {
    if (status === "completed" || status === "ready") return 3;
    if (status === "preparing") return 2;
    return 1;
  };

  const step = getStatusStep();
  const stepPercent = Math.round((step / 3) * 100);

  const steps = [
    { id: 1, title: "Order Received", desc: "Your order has been confirmed", icon: Package },
    { id: 2, title: "Preparing", desc: "Crafting your coffee with care", icon: Coffee },
    { id: 3, title: "Ready to Enjoy", desc: "Your order is complete!", icon: CheckCircle },
  ];

  if (!order) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#C08552] to-[#8d5d37] flex items-center justify-center">
        <p className="text-white/80">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#C08552] via-[#9b6b43] to-[#6f4e37]">
      
      {/* Top Navigation */}
      <div className="px-5 pt-12 pb-6 flex items-center justify-between">
        <button onClick={() => router.push("/menu")} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="text-white/80 text-sm font-medium">Order Tracking</span>
        <button onClick={() => setShowReceipt(!showReceipt)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Receipt size={20} className="text-white" />
        </button>
      </div>

      {!showReceipt ? (
        <>
          {/* Order Info Card */}
          <div className="mx-5 bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Order Number</p>
                <p className="text-2xl font-bold text-[#1a1a1a] mt-1">#{String(order.orderNumber).padStart(4, '0')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <span className="text-sm font-medium text-green-600">Live</span>
              </div>
            </div>

            {/* Item Preview */}
            <div className="flex items-center gap-3 bg-[#F3E9DC]/50 rounded-2xl p-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#C08552]/20 flex items-center justify-center">
                <Coffee size={24} className="text-[#C08552]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#1a1a1a]">{order.items?.[0]?.name || "Your Coffee"}</p>
                <p className="text-xs text-gray-500">{order.items?.length || 1} item(s) · {order.total || 0} OMR</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                status === "completed" ? "bg-green-100 text-green-700" :
                status === "preparing" ? "bg-blue-100 text-blue-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {status === "completed" ? "Ready" : status === "preparing" ? "Preparing" : "Pending"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Progress</span>
                <span className="font-bold text-[#C08552]">{stepPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C08552] to-[#8d5d37] rounded-full transition-all duration-700"
                  style={{ width: `${stepPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mx-5 mt-4 bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-5">Order Progress</p>
            
            <div className="relative">
              {steps.map((s, i) => (
                <div key={s.id} className="relative flex gap-4 pb-8 last:pb-0">
                  
                  {i < steps.length - 1 && (
                    <div className={`absolute left-5 top-12 w-0.5 h-[calc(100%-12px)] -translate-x-1/2 transition-all duration-700 ${
                      step > s.id ? "bg-[#C08552]" : "bg-gray-100"
                    }`} />
                  )}

                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step > s.id 
                      ? "bg-[#C08552] text-white shadow-lg shadow-[#C08552]/30"
                      : step === s.id
                      ? "bg-[#C08552] text-white shadow-lg shadow-[#C08552]/30 ring-4 ring-[#C08552]/20"
                      : "bg-gray-50 text-gray-300 border-2 border-gray-200"
                  }`}>
                    {step > s.id ? (
                      <CheckCircle size={20} />
                    ) : (
                      <s.icon size={20} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-2">
                    <h3 className={`font-bold text-sm transition-colors duration-500 ${
                      step >= s.id ? "text-[#1a1a1a]" : "text-gray-300"
                    }`}>
                      {s.title}
                    </h3>
                    <p className={`text-xs mt-0.5 transition-colors duration-500 ${
                      step >= s.id ? "text-gray-500" : "text-gray-300"
                    }`}>
                      {s.desc}
                    </p>
                    
                    {step === s.id && (
                      <span className="inline-flex items-center gap-1 mt-2 bg-[#90ee90]/10 text-[#C08552] text-xs font-bold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008000] animate-pulse" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mx-5 mt-4 mb-8">
            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 w-full bg-white text-[#C08552] py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-[0.98] transition"
            >
              <Coffee size={18} />
              Order Another Coffee
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Receipt View */}
          <div className="mx-5 bg-white rounded-3xl p-6 shadow-2xl mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C08552] flex items-center justify-center text-white font-bold text-lg">A</div>
                <div>
                  <span className="font-bold text-base block">AMZQR</span>
                  <span className="text-xs text-gray-400">
                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <span className="font-bold text-sm text-[#C08552]">#{String(order.orderNumber).padStart(4, '0')}</span>
            </div>

            <div className="border-t border-dashed border-gray-200 my-4" />

            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name}
                    {item.sizeLabel && <span className="text-gray-400 text-xs ml-1">({item.sizeLabel})</span>}
                    <span className="text-gray-400 ml-1">x{item.qty || 1}</span>
                  </span>
                  <span className="font-bold">{(item.price || 0) * (item.qty || 1)} OMR</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">{order.total || 0} OMR</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-[#C08552]">{order.total || 0} OMR</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 pt-1">
                <span>Payment</span>
                <span className="font-medium text-gray-600 capitalize">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#F3E9DC]/50 rounded-2xl text-center">
              <p className="text-xs text-gray-500">Thank you for your order</p>
              <p className="text-[10px] text-gray-300 mt-0.5">Small coffee, big moments</p>
            </div>
          </div>

          <div className="mx-5 mb-8">
            <button
              onClick={() => setShowReceipt(false)}
              className="flex items-center justify-center gap-2 w-full bg-white/20 backdrop-blur-sm text-white py-4 rounded-2xl font-bold text-sm border border-white/30 active:scale-[0.98] transition"
            >
              <ArrowLeft size={18} />
              Back to Tracking
            </button>
          </div>
        </>
      )}
    </main>
  );
}