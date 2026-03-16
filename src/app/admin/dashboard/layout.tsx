"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  School, 
  BookOpen, 
  UploadCloud, 
  Users, 
  CreditCard, 
  LogOut,
  GraduationCap
} from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Security Check: Dekho ki admin login karke aaya hai ya nahi
    const authFlag = localStorage.getItem("isAdminAuthenticated");
    if (authFlag !== "true") {
      router.push("/admin/login"); // Agar login nahi hai toh wapas bhej do
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    router.push("/admin/login");
  };

  // Jab tak check chal raha hai, tab tak blank screen dikhao (flicker rokne ke liye)
  if (!isAuthorized) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Manage Classes", href: "/admin/dashboard/classes", icon: <School size={20} /> },
    { name: "Manage Subjects", href: "/admin/dashboard/subjects", icon: <BookOpen size={20} /> },
    { name: "Upload Notes", href: "/admin/dashboard/upload", icon: <UploadCloud size={20} /> },
    { name: "Users", href: "/admin/dashboard/users", icon: <Users size={20} /> },
    { name: "Payments", href: "/admin/dashboard/payments", icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex fixed h-full">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <GraduationCap size={28} className="text-blue-500 mr-2" />
          <span className="text-white font-bold text-xl">Admin Panel</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button in Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header (For mobile menu & Admin Profile) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="md:hidden flex items-center gap-2 text-slate-800 font-bold text-lg">
             <GraduationCap size={24} className="text-blue-600" /> EduNotes Admin
          </div>
          <div className="flex items-center justify-end w-full md:w-auto gap-4">
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                 A
               </div>
               <span className="text-sm font-semibold text-slate-700 hidden sm:block pr-2">Ahom</span>
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}