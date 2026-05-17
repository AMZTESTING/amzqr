"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    fetchOrders();
  };

  const deleteOrder = async (orderId: number) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await supabase.from("orders").delete().eq("id", orderId);
      fetchOrders();
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">📋 Orders</h1>
        <div className="flex gap-2">
          {["all", "pending", "preparing", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
                filter === f
                  ? "bg-[#C08552] text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-xl text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">
                    Order #{order.id}
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "preparing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateStatus(order.id, "completed")}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Complete
                    </button>
                  )}
                  {(order.status === "pending" || order.status === "preparing") && (
                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-bold">{order.customer_name || order.sender_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-bold">{order.phone || order.sender_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Type</p>
                  <p className="font-bold capitalize">{order.order_mode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-bold capitalize">{order.payment_method}</p>
                </div>
                {order.table_number && (
                  <div>
                    <p className="text-sm text-gray-500">Table</p>
                    <p className="font-bold">{order.table_number}</p>
                  </div>
                )}
                {order.car_number && (
                  <div>
                    <p className="text-sm text-gray-500">Car</p>
                    <p className="font-bold">{order.car_number} - {order.car_model}</p>
                  </div>
                )}
                {order.receiver_name && (
                  <div>
                    <p className="text-sm text-gray-500">Receiver</p>
                    <p className="font-bold">{order.receiver_name}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Items:</h3>
                <div className="space-y-1">
                  {order.cart?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.qty}</span>
                      <span>{item.price * item.qty} AED</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <div>
                  {order.special_request && (
                    <p className="text-sm text-gray-500">Note: {order.special_request}</p>
                  )}
                </div>
                <div className="text-right">
                  {order.discount_amount > 0 && (
                    <p className="text-sm text-green-600">Discount: -{order.discount_amount} AED</p>
                  )}
                  <p className="text-xl font-bold text-[#C08552]">{order.total} AED</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}