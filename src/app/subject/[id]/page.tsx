"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BookOpen, CheckCircle2, IndianRupee, ShieldCheck, Loader2, Lock } from "lucide-react";
import { CLASSES } from "@/src/lib/constants";

export default function SubjectDetailsPage({ params }: { params: { id: string } }) {
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  // 1. Auth check karna aur Subject fetch karna
  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch Subject details
    const fetchSubjectDetails = async () => {
      try {
        const res = await fetch("/api/subjects");
        const data = await res.json();
        if (res.ok) {
          // Saare subjects me se wo subject dhoondho jiski ID URL mein hai
          const foundSubject = data.subjects.find((s: any) => s._id === params.id);
          setSubject(foundSubject);
        }
      } catch (error) {
        console.error("Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
    return () => unsubscribe();
  }, [params.id]);

  const getClassName = (id: string) => {
    const foundClass = CLASSES.find(c => c.id === id);
    return foundClass ? foundClass.name : id;
  };

  // 2. Buy Now Function
  const handlePurchase = async () => {
    // Agar login nahi hai, toh pehle login page bhej do
    if (!user) {
      router.push(`/login?redirect=/subject/${params.id}`);
      return;
    }

    setIsProcessing(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUID: user.uid,
          subjectId: subject._id,
          amount: subject.price,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        setMessage({ type: "success", text: "You already own these notes! Redirecting to dashboard..." });
        setTimeout(() => router.push("/dashboard"), 2000);
        return;
      }

      if (response.ok) {
        setMessage({ type: "success", text: "Payment Successful! Unlocking your notes..." });
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Payment failed. Please try again." });
        setIsProcessing(false);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please check your connection." });
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <BookOpen className="text-slate-300 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-slate-800">Subject Not Found</h1>
        <p className="text-slate-500 mt-2">The notes you are looking for do not exist or were removed.</p>
        <button onClick={() => router.push("/")} className="mt-6 text-blue-600 hover:underline">Go back home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-8 flex items-center gap-2">
          <button onClick={() => router.push("/")} className="hover:text-blue-600">Home</button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{getClassName(subject.classId)}</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{subject.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Details */}
          <div className="p-8 md:p-12 flex-1 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen size={32} />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              {getClassName(subject.classId)} Notes
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              {subject.name} Complete Study Material
            </h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Get access to premium, high-quality PDF notes designed specifically for your exams. Includes all chapters, important formulas, and easy-to-understand explanations.
            </p>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">What's included in this PDF?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                  Complete syllabus coverage
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                  High-quality printable format
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                  Lifetime access on your dashboard
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Checkout Card */}
          <div className="p-8 md:p-12 w-full md:w-96 bg-slate-50 flex flex-col justify-center">
            
            {message.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-semibold border ${
                message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-2">Total Price</p>
              <div className="flex items-center justify-center gap-1 text-5xl font-extrabold text-slate-900">
                <IndianRupee size={36} className="text-slate-400" />
                {subject.price}
              </div>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full bg-[#f58a33] hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg shadow-orange-500/30 flex justify-center items-center gap-2 group"
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" size={20}/> Processing...</>
              ) : (
                <>{user ? "Pay Now & Unlock" : "Login to Buy Now"}</>
              )}
            </button>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                <ShieldCheck size={16} className="text-green-500" />
                Secure 256-bit encrypted checkout
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                <Lock size={16} className="text-blue-500" />
                Instant PDF Delivery
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}