"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ClipboardList,
  Clock,
  Coffee,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true });
    const { count: pendingOrders } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending");
    const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });
    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });

    setStats({
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      totalRevenue: totalOrders ? totalOrders * 3.5 : 0,
    });
    setLoading(false);
  };

  const fetchRecentOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5);
    if (data) setRecentOrders(data);
  };

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: ClipboardList, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", textColor: "text-blue-600" },
    { title: "Pending", value: stats.pendingOrders, icon: Clock, color: "from-yellow-500 to-orange-500", bg: "bg-yellow-50", textColor: "text-yellow-600" },
    { title: "Products", value: stats.totalProducts, icon: Coffee, color: "from-green-500 to-emerald-600", bg: "bg-green-50", textColor: "text-green-600" },
    { title: "Staff", value: stats.totalUsers, icon: Users, color: "from-purple-500 to-violet-600", bg: "bg-purple-50", textColor: "text-purple-600" },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#C08552] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition"
        >
          <ClipboardList size={18} />
          View All Orders
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon size={20} className={card.textColor} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-[#C08552] font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-5 font-mono text-sm font-bold">#{String(order.id).padStart(4, '0')}</td>
                  <td className="py-3 px-5 text-sm">{order.customer_name || order.sender_name || "-"}</td>
                  <td className="py-3 px-5 text-sm capitalize">{order.order_mode}</td>
                  <td className="py-3 px-5 text-sm font-bold">{order.total} OMR</td>
                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "preparing" ? "bg-blue-100 text-blue-700" :
                      order.status === "completed" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}