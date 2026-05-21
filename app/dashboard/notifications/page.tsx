"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bell,
  BellRing,
  Coffee,
  CheckCircle,
  Clock,
  X,
  Volume2,
  VolumeX,
  Trash2,
} from "lucide-react";

export default function NotificationsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastOrderId, setLastOrderId] = useState<number>(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(checkNewOrders, 5000);
    return () => clearInterval(interval);
  }, [lastOrderId]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setNotifications(data);
  };

  const checkNewOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (data && data.id > lastOrderId && lastOrderId > 0) {
      // New order detected
      playNotificationSound();
      showPopupNotification(data);
    }
    if (data) setLastOrderId(data.id);
  };

  const playNotificationSound = () => {
    if (soundEnabled) {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    }
  };

  const showPopupNotification = (order: any) => {
    if (popupEnabled && "Notification" in window && Notification.permission === "granted") {
      new Notification("New Order!", {
        body: `${order.customer_name || "Customer"} placed an order - ${order.total} OMR`,
        icon: "/favicon.ico",
      });
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with new orders</p>
        </div>
        <button
          onClick={requestNotificationPermission}
          className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition"
        >
          <BellRing size={18} /> Enable Alerts
        </button>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C08552]/10 flex items-center justify-center">
                {soundEnabled ? <Volume2 size={20} className="text-[#C08552]" /> : <VolumeX size={20} className="text-gray-400" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Sound Alert</h3>
                <p className="text-xs text-gray-500">Play sound on new order</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-7 rounded-full transition relative ${soundEnabled ? "bg-[#C08552]" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${soundEnabled ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C08552]/10 flex items-center justify-center">
                <Bell size={20} className="text-[#C08552]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Popup Alert</h3>
                <p className="text-xs text-gray-500">Show popup notification</p>
              </div>
            </div>
            <button
              onClick={() => setPopupEnabled(!popupEnabled)}
              className={`w-12 h-7 rounded-full transition relative ${popupEnabled ? "bg-[#C08552]" : "bg-gray-300"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${popupEnabled ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {notifications.map((n) => (
            <div key={n.id} className="p-5 flex items-center gap-4 hover:bg-gray-50/50 transition">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                n.status === "completed" ? "bg-green-50" :
                n.status === "preparing" ? "bg-blue-50" :
                "bg-yellow-50"
              }`}>
                {n.status === "completed" ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : n.status === "preparing" ? (
                  <Clock size={20} className="text-blue-600" />
                ) : (
                  <Coffee size={20} className="text-yellow-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  New order from {n.customer_name || "Customer"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {n.total} OMR • {n.order_mode} • {new Date(n.created_at).toLocaleTimeString()}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                n.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                n.status === "preparing" ? "bg-blue-100 text-blue-700" :
                "bg-green-100 text-green-700"
              }`}>
                {n.status}
              </span>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-gray-400">No activity yet</div>
          )}
        </div>
      </div>
    </div>
  );
}