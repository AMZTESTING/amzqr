"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("cashier");
  const [pin, setPin] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("users").insert([
      { full_name: fullName, email, role, pin },
    ]);
    setFullName("");
    setEmail("");
    setRole("cashier");
    setPin("");
    setShowForm(false);
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await supabase.from("users").delete().eq("id", id);
      fetchUsers();
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
        <h1 className="text-3xl font-bold">👥 Users</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#C08552] text-white px-6 py-3 rounded-xl font-medium"
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
                <option value="barista">Barista</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">PIN Code</label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                placeholder="******"
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#C08552] text-white px-8 py-3 rounded-xl font-medium"
          >
            Add User
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-medium text-gray-500">Name</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Email</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Role</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">PIN</th>
              <th className="text-left py-4 px-6 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{user.full_name}</td>
                <td className="py-4 px-6 text-gray-500">{user.email || "-"}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">{user.pin || "-"}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleDelete(user.id)}
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