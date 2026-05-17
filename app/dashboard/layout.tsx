"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Overview",
    icon: "📊",
    path: "/dashboard",
  },
  {
    title: "Orders",
    icon: "📋",
    path: "/dashboard/orders",
  },
  {
    title: "Products",
    icon: "☕",
    path: "/dashboard/products",
  },
  {
    title: "Users",
    icon: "👥",
    path: "/dashboard/users",
  },
  {
    title: "Discounts",
    icon: "🏷️",
    path: "/dashboard/discounts",
  },
  {
    title: "Blog",
    icon: "📝",
    path: "/dashboard/blog",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl font-bold text-[#C08552]"
          >
            {isSidebarOpen ? "☕ Coffee" : "☕"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-[#C08552] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C08552] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            {isSidebarOpen && (
              <div>
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-gray-500">admin@coffee.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}