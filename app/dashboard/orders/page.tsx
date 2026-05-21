"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  User,
  MapPin,
  CreditCard,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Coffee,
  ClipboardList,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Order Form
  const [orderType, setOrderType] = useState("dinein");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [carModel, setCarModel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    if (data) setOrders(data);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) {
      localStorage.setItem(`order_status_${orderId}`, newStatus);
      fetchOrders();
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (confirm("Delete this order permanently?")) {
      await supabase.from("orders").delete().eq("id", orderId);
      fetchOrders();
    }
  };

  const addItemToOrder = (product: any) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      const price = product.hasSizes && product.sizes?.length > 0 ? product.sizes[0].price : product.price;
      return [...prev, { ...product, qty: 1, selectedPrice: price }];
    });
  };

  const removeItemFromOrder = (productId: number) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateItemQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeItemFromOrder(productId);
      return;
    }
    setSelectedItems((prev) => prev.map((i) => i.id === productId ? { ...i, qty } : i));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + parseFloat(item.selectedPrice || 0) * item.qty, 0);
  };

  const handleAddOrder = async () => {
    if (!customerName || !customerPhone || selectedItems.length === 0) {
      alert("Please fill customer name, phone, and at least one item.");
      return;
    }

    const orderData: any = {
      order_mode: orderType,
      customer_name: customerName,
      phone: customerPhone,
      cart: selectedItems.map((i) => ({
        name: i.name,
        price: i.selectedPrice,
        qty: i.qty,
        sizeLabel: i.sizeLabel || null,
      })),
      subtotal: String(calculateTotal()),
      total: String(calculateTotal()),
      discount_amount: "0",
      payment_method: paymentMethod,
      special_request: note || null,
      status: "pending",
      table_number: orderType === "dinein" ? tableNumber : null,
      car_number: orderType === "car" ? carNumber : null,
      car_model: orderType === "car" ? carModel : null,
    };

    const { error } = await supabase.from("orders").insert([orderData]);
    if (!error) {
      alert("Order added successfully!");
      setShowAddOrder(false);
      resetForm();
      fetchOrders();
    } else {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setTableNumber("");
    setCarNumber("");
    setCarModel("");
    setSelectedItems([]);
    setNote("");
    setOrderType("dinein");
    setPaymentMethod("cash");
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(o.id).includes(term) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(term)) ||
      (o.phone && o.phone.includes(term))
    );
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowAddOrder(!showAddOrder)}
          className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition"
        >
          <Plus size={18} />
          Add Order
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, name, or phone..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "preparing", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-[#C08552] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg text-gray-500 font-medium">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg">#{String(order.id).padStart(4, '0')}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "preparing" ? "bg-blue-100 text-blue-700" :
                    order.status === "completed" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {order.status === "pending" && (
                    <button onClick={() => updateStatus(order.id, "preparing")} className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition">
                      <Clock size={14} /> Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateStatus(order.id, "completed")} className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition">
                      <CheckCircle size={14} /> Complete
                    </button>
                  )}
                  {(order.status === "pending" || order.status === "preparing") && (
                    <button onClick={() => updateStatus(order.id, "cancelled")} className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition">
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                  <button onClick={() => deleteOrder(order.id)} className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-300 transition">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><User size={12} /> Customer</p>
                  <p className="font-bold text-sm">{order.customer_name || order.sender_name || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12} /> Phone</p>
                  <p className="font-bold text-sm">{order.phone || order.sender_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Type</p>
                  <p className="font-bold text-sm capitalize">{order.order_mode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><CreditCard size={12} /> Payment</p>
                  <p className="font-bold text-sm capitalize">{order.payment_method}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 font-medium mb-2">ITEMS</p>
                <div className="space-y-1">
                  {order.cart?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} x{item.qty}</span>
                      <span className="font-medium">{parseFloat(item.price || 0) * item.qty} OMR</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</div>
                <div>
                  {parseFloat(order.discount_amount || 0) > 0 && (
                    <p className="text-xs text-green-600 text-right">Discount: -{order.discount_amount} OMR</p>
                  )}
                  <p className="text-lg font-bold text-[#C08552]">{order.total} OMR</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Order Modal */}
      {showAddOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-10 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold">New Order</h2>
              <button onClick={() => setShowAddOrder(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Order Type */}
              <div className="flex gap-2">
                {["dinein", "car", "gift"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition ${
                      orderType === type ? "bg-[#C08552] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Customer Name *</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-1 text-sm" placeholder="Name" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Phone *</label>
                  <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-1 text-sm" placeholder="Phone" />
                </div>
                {orderType === "dinein" && (
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Table</label>
                    <select value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-1 text-sm">
                      <option value="">Select</option>
                      {[1,2,3,4,5,6,7,8].map((t) => <option key={t} value={`Table ${t}`}>Table {t}</option>)}
                    </select>
                  </div>
                )}
                {orderType === "car" && (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Car Number</label>
                      <input type="text" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-1 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Car Model</label>
                      <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-1 text-sm" />
                    </div>
                  </>
                )}
                <div>
                  <label className="text-xs text-gray-500 font-medium">Payment</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border rounded-xl px-3 py-2 mt-1 text-sm">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>

              {/* Products Selection */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2">Select Products</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addItemToOrder(product)}
                      className="text-left p-2 rounded-xl border border-gray-200 hover:border-[#C08552] hover:bg-[#C08552]/5 transition text-sm"
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="text-gray-500 ml-2">
                        {product.hasSizes && product.sizes?.length > 0 ? product.sizes[0].price : product.price} OMR
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium mb-2">ORDER ITEMS</p>
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateItemQty(item.id, item.qty - 1)} className="w-6 h-6 rounded bg-gray-200 text-xs font-bold">-</button>
                        <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateItemQty(item.id, item.qty + 1)} className="w-6 h-6 rounded bg-gray-200 text-xs font-bold">+</button>
                        <span className="text-sm font-bold text-[#C08552] w-16 text-right">{parseFloat(item.selectedPrice || 0) * item.qty} OMR</span>
                        <button onClick={() => removeItemFromOrder(item.id)} className="w-6 h-6 rounded bg-red-50 text-red-500 text-xs">x</button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span className="text-[#C08552]">{calculateTotal()} OMR</span>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="text-xs text-gray-500 font-medium">Note (optional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full border rounded-xl px-3 py-2 mt-1 text-sm" placeholder="Special instructions..." />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAddOrder(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-medium text-sm">Cancel</button>
              <button onClick={handleAddOrder} className="flex-1 py-3 rounded-xl bg-[#C08552] text-white font-bold text-sm hover:bg-[#a07042] transition">Place Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}