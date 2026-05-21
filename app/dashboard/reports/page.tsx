"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Coffee,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-react";

export default function ReportsPage() {
  const [period, setPeriod] = useState("today");
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrder: 0,
    topProduct: null,
    hourlyData: [],
    categoryData: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [period]);

  const fetchReportData = async () => {
    setLoading(true);

    // Fetch all orders
    const { data: orders } = await supabase.from("orders").select("*");
    
    if (!orders) {
      setLoading(false);
      return;
    }

    // Calculate stats
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + parseFloat(o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top product
    const productCount: any = {};
    orders.forEach((o: any) => {
      o.cart?.forEach((item: any) => {
        productCount[item.name] = (productCount[item.name] || 0) + (item.qty || 1);
      });
    });
    const topProduct = Object.entries(productCount).sort((a: any, b: any) => b[1] - a[1])[0];

    // Category distribution
    const categoryCount: any = {};
    orders.forEach((o: any) => {
      const cat = o.order_mode || "unknown";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    const categoryData = Object.entries(categoryCount).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
      percentage: Math.round((Number(count) / totalOrders) * 100),
    }));

    // Recent transactions
    const recentTransactions = orders.slice(0, 8).map((o: any) => ({
      id: o.id,
      customer: o.customer_name || "Walk-in",
      amount: parseFloat(o.total || 0),
      type: o.order_mode,
      time: new Date(o.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }));

    setStats({
      totalRevenue,
      totalOrders,
      averageOrder: Math.round(averageOrder * 100) / 100,
      topProduct: topProduct ? { name: topProduct[0], count: topProduct[1] as number } : null,
      categoryData,
      recentTransactions,
    });

    setLoading(false);
  };

  const periods = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Business performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                period === p.value
                  ? "bg-[#C08552] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <ArrowUp size={12} /> 12%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRevenue} OMR</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag size={20} className="text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <ArrowUp size={12} /> 8%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Average Order</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.averageOrder} OMR</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Top Product</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{stats.topProduct?.name || "N/A"}</p>
          <p className="text-xs text-gray-500">{stats.topProduct?.count || 0} sold</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Types</h2>
          <div className="space-y-4">
            {stats.categoryData.map((cat: any) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-gray-500">{cat.count} orders ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C08552] to-[#8d5d37] rounded-full transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {stats.recentTransactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C08552]/10 flex items-center justify-center">
                    <Coffee size={16} className="text-[#C08552]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.customer}</p>
                    <p className="text-xs text-gray-500 capitalize">{tx.type} • {tx.time}</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#C08552]">{tx.amount} OMR</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}