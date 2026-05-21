"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  X,
  Percent,
  Tag,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => { fetchDiscounts(); }, []);

  const fetchDiscounts = async () => {
    const { data } = await supabase.from("discounts").select("*").order("created_at", { ascending: false });
    if (data) setDiscounts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("discounts").insert([{ code: code.toUpperCase(), percentage: parseFloat(percentage), expiry_date: expiryDate || null, is_active: true }]);
    setCode(""); setPercentage(""); setExpiryDate(""); setShowForm(false);
    fetchDiscounts();
  };

  const toggleActive = async (id: number, current: boolean) => {
    await supabase.from("discounts").update({ is_active: !current }).eq("id", id);
    fetchDiscounts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this discount?")) return;
    await supabase.from("discounts").delete().eq("id", id);
    fetchDiscounts();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#C08552] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-500 mt-1">{discounts.length} code{discounts.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition">
          <Plus size={18} /> Add Discount
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">New Discount Code</h2>
            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Tag size={12} /> Code *</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm uppercase" placeholder="COFFEE10" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Percent size={12} /> Percentage *</label>
              <input type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} required max="100" className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="10" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Calendar size={12} /> Expiry Date</label>
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="w-full bg-[#C08552] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#a07042] transition">Add Discount</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Discount</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-5 font-mono font-bold text-sm">{d.code}</td>
                <td className="py-3 px-5 text-sm font-bold text-[#C08552]">{d.percentage}%</td>
                <td className="py-3 px-5 text-sm text-gray-500">{d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : "No expiry"}</td>
                <td className="py-3 px-5">
                  <button onClick={() => toggleActive(d.id, d.is_active)} className="flex items-center gap-1.5">
                    {d.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium text-xs"><ToggleRight size={18} /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 font-medium text-xs"><ToggleLeft size={18} /> Inactive</span>
                    )}
                  </button>
                </td>
                <td className="py-3 px-5">
                  <button onClick={() => handleDelete(d.id)} className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}