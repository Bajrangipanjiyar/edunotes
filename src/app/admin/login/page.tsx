"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, User, Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Thoda delay add kar rahe hain taki professional feel aaye
    setTimeout(() => {
      // Tumhare diye gaye credentials check ho rahe hain
      if (userId === "ahom" && password === "aabir@781022") {
        
        // Login success hone par localStorage mein token set kar diya
        localStorage.setItem("isAdminAuthenticated", "true");
        
        // Dashboard par bhej diya
        router.push("/admin/dashboard");
      } else {
        // Galat hone par error message
        setError("Invalid User ID or Password. Unauthorized access.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Dark Theme Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

      {/* Admin Login Card */}
      <div className="bg-slate-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-slate-400 font-medium">Restricted Area. Authorized personnel only.</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-md text-sm mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User ID</label>
            <div className="relative">
              {/* Mail icon ki jagah User icon laga diya */}
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter User ID"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 group disabled:opacity-70 mt-6"
          >
            {isLoading ? "Authenticating..." : "Secure Login"}
            {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
           <p className="text-slate-500 text-sm">EduNotes Management System</p>
        </div>
      </div>
    </div>
  );
}