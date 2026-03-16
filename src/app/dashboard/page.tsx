"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, LogOut, BookOpen, Clock, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Yeh check karega ki user logged in hai ya nahi
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Agar login nahi hai, toh wapas login page bhej do
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Jab tak Firebase check kar raha hai ki user login hai ya nahi, tab tak loading screen dikhao
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a5eb0]"></div>
      </div>
    );
  }

  // Agar user null hai (jo ki ideally nahi hona chahiye yahan tak aate aate), toh kuch mat dikhao
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Dashboard Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#1a4a8d] font-bold text-xl md:text-2xl hover:opacity-80 transition">
            <GraduationCap size={32} />
            <span>EduNotes</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-slate-600 font-medium">
              <UserIcon size={18} />
              <span>{user.displayName || "Student"}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-semibold transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#1a5eb0] to-blue-800 rounded-2xl p-8 text-white shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.displayName || "Student"}! 👋</h1>
          <p className="text-blue-100 opacity-90">Ready to continue your learning journey? Check your purchased notes below.</p>
        </div>

        {/* Dashboard Stats / Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-14 h-14 bg-blue-50 text-[#1a5eb0] rounded-full flex items-center justify-center">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">My Notes</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-14 h-14 bg-orange-50 text-[#f58a33] rounded-full flex items-center justify-center">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Recent Activity</p>
              <h3 className="text-lg font-bold text-slate-800 mt-1">No recent purchases</h3>
            </div>
          </div>
        </div>

        {/* Purchased Notes Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[300px]">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-[#1a5eb0]" /> 
            Purchased Notes
          </h2>
          
          {/* Empty State (Since user hasn't bought anything yet) */}
          <div className="flex flex-col items-center justify-center text-center h-full py-12">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <BookOpen size={48} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No notes found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              You haven't purchased any study materials yet. Browse our collection and start learning today!
            </p>
            <Link href="/" className="bg-[#f58a33] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition">
              Browse Notes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}