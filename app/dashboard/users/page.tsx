"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  X,
  Users,
  User,
  Mail,
  Shield,
  Key,
  Trash2,
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("cashier");
  const [pin, setPin] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("users").insert([{ full_name: fullName, email, role, pin }]);
    setFullName(""); setEmail(""); setRole("cashier"); setPin("");
    setShowForm(false);
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await supabase.from("users").delete().eq("id", id);
    fetchUsers();
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
          <h1 className="text-3xl font-bold text-gray-900">Staff Users</h1>
          <p className="text-gray-500 mt-1">{users.length} user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">New Staff User</h2>
            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><User size={12} /> Full Name *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="Ahmed Al Balushi" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Mail size={12} /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="ahmed@amzqr.com" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Shield size={12} /> Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
                <option value="barista">Barista</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium flex items-center gap-1"><Key size={12} /> PIN Code</label>
              <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={6} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="****" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-[#C08552] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#a07042] transition">Add User</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">PIN</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-5 text-sm font-medium">{user.full_name}</td>
                <td className="py-3 px-5 text-sm text-gray-500">{user.email || "-"}</td>
                <td className="py-3 px-5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                    user.role === "admin" ? "bg-purple-100 text-purple-700" :
                    user.role === "manager" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{user.role}</span>
                </td>
                <td className="py-3 px-5 text-sm font-mono">{user.pin || "-"}</td>
                <td className="py-3 px-5">
                  <button onClick={() => handleDelete(user.id)} className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition">
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