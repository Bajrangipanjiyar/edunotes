"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, UserPlus } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Email & Password Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          firebaseUID: user.uid,
        }),
      });

      if (!response.ok) throw new Error("Failed to save user in database");
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Signup/Login
  const handleGoogleSignup = async () => {
    setError("");
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName || "Student",
          email: user.email,
          firebaseUID: user.uid,
        }),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError("Google sign-up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-orange-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 text-[#1a4a8d] hover:opacity-80 transition z-10">
        <GraduationCap size={48} />
        <span className="font-extrabold text-4xl tracking-tight">EduNotes</span>
      </Link>

      {/* Signup Card */}
      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Join EduNotes!</h2>
          <p className="text-slate-500 font-medium">Create an account to get started.</p>
        </div>
        
        {error && (
          <div className="bg-red-50/80 border-l-4 border-red-500 text-red-600 p-4 rounded-md text-sm mb-6 font-medium shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f58a33] focus:border-transparent transition-all outline-none"
                placeholder="Shobhit"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f58a33] focus:border-transparent transition-all outline-none"
                placeholder="student@example.com"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#f58a33] focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#f58a33] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-md shadow-orange-500/30 flex justify-center items-center gap-2 group disabled:opacity-70 mt-4"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
            {!isLoading && <UserPlus size={20} className="group-hover:scale-110 transition-transform" />}
          </button>
        </form>

        <div className="my-8 flex items-center justify-center space-x-4">
          <span className="h-px w-full bg-slate-200"></span>
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Or</span>
          <span className="h-px w-full bg-slate-200"></span>
        </div>

        {/* Google Button */}
        <button 
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition duration-300 shadow-sm flex justify-center items-center gap-3 disabled:opacity-70"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button>

        <p className="mt-8 text-center text-slate-600 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-[#1a5eb0] font-bold hover:text-blue-800 transition">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}