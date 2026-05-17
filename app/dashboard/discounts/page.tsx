"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    const { data } = await supabase
      .from("discounts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDiscounts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("discounts").insert([
      {
        code: code.toUpperCase(),
        percentage: parseInt(percentage),
        expiry_date: expiryDate || null,
        is_active: true,
      },
    ]);
    setCode("");
    setPercentage("");
    setExpiryDate("");
    setShowForm(false);
    fetchDiscounts();
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    await supabase.from("discounts").update({ is_active: !currentStatus }).eq("id", id);
    fetchDiscounts();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      await supabase.from("discounts").delete().eq("id", id);
      fetchDiscounts();
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
        <h1 className="text-3xl font-bold">🏷️ Discount Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#C08552] text-white px-6 py-3 rounded-xl font-medium"
        >
          + Add Discount
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Discount Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="e.g. COFFEE10"
                className="w-full border rounded-xl p-3 uppercase"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Percentage (%) *</label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                required
                placeholder="e.g. 10"
                max="100"
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#C08552] text-white px-8 py-3 rounded-xl font-medium"
          >
            Add Discount
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-medium text-gray-500">Code</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Percentage</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Expiry Date</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Status</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6 font-bold">{discount.code}</td>
                <td className="py-4 px-6">{discount.percentage}%</td>
                <td className="py-4 px-6 text-gray-500">
                  {discount.expiry_date
                    ? new Date(discount.expiry_date).toLocaleDateString()
                    : "No expiry"}
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => toggleActive(discount.id, discount.is_active)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      discount.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {discount.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleDelete(discount.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
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