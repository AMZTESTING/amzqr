"use client";

import { useState } from "react";
import {
  Store,
  Globe,
  Clock,
  Bell,
  Shield,
  Save,
  Coffee,
} from "lucide-react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("AMZQR");
  const [currency, setCurrency] = useState("OMR");
  const [language, setLanguage] = useState("en");
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("23:00");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("storeSettings", JSON.stringify({
      storeName, currency, language, openingTime, closingTime, phone, address
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your store preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition"
        >
          <Save size={18} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#C08552]/10 flex items-center justify-center">
              <Store size={20} className="text-[#C08552]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Store Information</h2>
              <p className="text-xs text-gray-500">Basic details about your coffee shop</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="+968 ..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="Street, City..." />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#C08552]/10 flex items-center justify-center">
              <Globe size={20} className="text-[#C08552]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Preferences</h2>
              <p className="text-xs text-gray-500">Currency and language settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm">
                <option value="OMR">OMR (Omani Rial)</option>
                <option value="AED">AED (UAE Dirham)</option>
                <option value="SAR">SAR (Saudi Riyal)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm">
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#C08552]/10 flex items-center justify-center">
              <Clock size={20} className="text-[#C08552]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Operating Hours</h2>
              <p className="text-xs text-gray-500">Set your opening and closing times</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">Opening Time</label>
              <input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Closing Time</label>
              <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#C08552]/10 flex items-center justify-center">
              <Shield size={20} className="text-[#C08552]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Security</h2>
              <p className="text-xs text-gray-500">Admin PIN and access control</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Manage staff PINs and roles from the Users page.</p>
        </div>
      </div>
    </div>
  );
}