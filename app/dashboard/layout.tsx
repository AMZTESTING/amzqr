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
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  { title: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Orders", icon: ClipboardList, path: "/dashboard/orders" },
  { title: "Products", icon: Coffee, path: "/dashboard/products" },
  { title: "Users", icon: Users, path: "/dashboard/users" },
  { title: "Discounts", icon: Percent, path: "/dashboard/discounts" },
  { title: "Reports", icon: TrendingUp, path: "/dashboard/reports" },
  { title: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  { title: "Feedback", icon: MessageSquare, path: "/dashboard/feedback" },
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },
  { title: "Blog", icon: FileText, path: "/dashboard/blog" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    
    // Auto-open sidebar on desktop
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
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

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white border-r border-gray-200 transition-transform duration-300 flex flex-col fixed inset-y-0 left-0 z-30 lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xl font-bold text-[#C08552]">AMZQR</span>
          <button
            onClick={closeSidebar}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 lg:hidden"
          >
            <X size={18} />
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
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-[#C08552] text-white shadow-md shadow-[#C08552]/20"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
            <div className="w-9 h-9 rounded-full bg-[#C08552] flex items-center justify-center text-white flex-shrink-0">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{staffUser?.full_name || "Staff"}</p>
              <p className="text-xs text-gray-500 capitalize">{staffUser?.role || "staff"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header with hamburger */}
        <div className="lg:hidden flex items-center gap-3 p-4 bg-white border-b border-gray-100">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-[#C08552]">AMZQR</span>
        </div>

        {children}
      </main>
    </div>
  );
}