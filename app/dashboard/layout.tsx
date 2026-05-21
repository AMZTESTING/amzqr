"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Coffee,
  Users,
  Percent,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  TrendingUp,
  Bell,
  MessageSquare,
  Settings,
} from "lucide-react";
import { title } from "process";

const sidebarItems = [
  { title: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Orders", icon: ClipboardList, path: "/dashboard/orders" },
  { title: "Products", icon: Coffee, path: "/dashboard/products" },
  { title: "Users", icon: Users, path: "/dashboard/users" },
  { title: "Discounts", icon: Percent, path: "/dashboard/discounts" },
  { title: "Reports", icon: TrendingUp, path: "/dashboard/reports" },      // جديد
  { title: "Notifications", icon: Bell, path: "/dashboard/notifications" }, // جديد
  { title: "Feedback", icon: MessageSquare, path: "/dashboard/feedback" },  // جديد
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },       // جديد
  { title: "Blog", icon: FileText, path: "/dashboard/blog" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [staffUser, setStaffUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("staffLoggedIn");
    const user = localStorage.getItem("staffUser");
    if (loggedIn !== "true") {
      router.push("/login");
    } else {
      setAuthorized(true);
      if (user) setStaffUser(JSON.parse(user));
    }
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C08552] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Checking access...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("staffLoggedIn");
    localStorage.removeItem("staffUser");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-30`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          {isSidebarOpen && (
            <span className="text-xl font-bold text-[#C08552]">AMZQR</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-[#C08552] text-white shadow-md shadow-[#C08552]/20"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && (
                  <span className="font-medium text-sm">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t border-gray-100">
          <div className={`flex items-center gap-3 p-2 rounded-xl ${isSidebarOpen ? "bg-gray-50" : "justify-center"}`}>
            <div className="w-9 h-9 rounded-full bg-[#C08552] flex items-center justify-center text-white flex-shrink-0">
              <User size={16} />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{staffUser?.full_name || "Staff"}</p>
                <p className="text-xs text-gray-500 capitalize">{staffUser?.role || "staff"}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition text-sm font-medium"
          >
            <LogOut size={18} />
            {isSidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {children}
      </main>
    </div>
  );
}