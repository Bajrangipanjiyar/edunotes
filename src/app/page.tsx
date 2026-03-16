import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Search, GraduationCap, Download, CreditCard, ShieldCheck, CheckCircle2, Star } from 'lucide-react';

import heroBg from '@/public/hero-bg.jpg'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1a4a8d] font-bold text-2xl">
            <GraduationCap size={32} />
            <span>EduNotes</span>
          </div>
          <nav className="hidden md:flex gap-8 text-slate-600 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="#features" className="hover:text-blue-600 transition">Why Us?</Link>
            <Link href="#notes" className="hover:text-blue-600 transition">Browse Notes</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login" className="bg-blue-50 text-blue-700 font-semibold px-5 py-2 hover:bg-blue-100 rounded-lg transition">Login</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full h-[500px] md:h-[600px] flex items-center mb-12">
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroBg} 
              alt="EduNotes Background"
              fill
              className="object-cover object-right-bottom md:object-center"
              priority
            />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
                <Star size={16} fill="currentColor" /> Top Rated Study Material
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-[#1e293b] leading-tight">
                Unlock Your Academic Potential
              </h1>
              <p className="text-lg text-slate-700 font-medium leading-relaxed">
                Purchase premium, expert-curated PDF notes for Class 1 to 12. Instant downloads, easy-to-understand language, and everything you need to score maximum marks.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="#notes" className="bg-[#1a5eb0] hover:bg-blue-800 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition">
                  Browse Notes
                </Link>
                <Link href="/signup" className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-bold shadow-sm transition">
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* SEARCH SECTION */}
          <section id="notes" className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-24 text-center max-w-4xl mx-auto relative z-20 -mt-20">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Find Notes For Your Class</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <select className="border border-slate-300 rounded-xl px-4 py-3.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3 text-slate-700 font-medium">
                <option value="">Choose Class</option>
                <option value="10">Class 10</option>
                <option value="12">Class 12</option>
              </select>
              <select className="border border-slate-300 rounded-xl px-4 py-3.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3 text-slate-700 font-medium">
                <option value="">Select Subject</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
              </select>
              <button className="bg-[#f58a33] hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition w-full md:w-auto">
                <Search size={20} /> Search
              </button>
            </div>
          </section>

          {/* NEW: WHY CHOOSE EDUNOTES (Copywriting Section) */}
          <section id="features" className="mb-24">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Why Study With EduNotes?</h2>
              <p className="text-lg text-slate-500">Stop wasting time searching for the right study material. We provide high-quality, exam-oriented notes that make learning simple and fast.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Premium Quality</h3>
                <p className="text-slate-500 leading-relaxed">Our notes are crafted by subject experts, featuring highlighted keywords, clear diagrams, and point-wise explanations perfect for board exams.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition">
                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <Download size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Instant PDF Access</h3>
                <p className="text-slate-500 leading-relaxed">No waiting for delivery! Complete your purchase and instantly download the PDF notes to your phone, tablet, or computer.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Pocket-Friendly</h3>
                <p className="text-slate-500 leading-relaxed">Education should be accessible. We offer top-tier study materials at nominal prices so every student can afford to score better.</p>
              </div>
            </div>
          </section>

          {/* SAMPLE NOTES CARDS */}
          <section className="mb-24">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Popular Notes</h2>
                <p className="text-slate-500">Top-selling study materials this week.</p>
              </div>
              <Link href="#notes" className="text-blue-600 font-semibold hover:underline hidden sm:block">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">Class 10</span>
                     <h3 className="text-2xl font-bold text-slate-800">Mathematics</h3>
                   </div>
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <BookOpen size={24} />
                   </div>
                </div>
                <ul className="text-sm text-slate-500 space-y-2 mb-8 flex-1">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> All Chapters Covered</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Important Formulas</li>
                </ul>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <p className="text-3xl font-extrabold text-slate-900">₹249</p>
                  <button className="bg-[#1a5eb0] hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-blue-500/20">
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 flex flex-col group relative overflow-hidden">
                {/* Bestseller Tag */}
                <div className="absolute top-4 right-[-35px] bg-orange-500 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-sm">
                  BESTSELLER
                </div>
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <span className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1 block">Class 12</span>
                     <h3 className="text-2xl font-bold text-slate-800">Physics</h3>
                   </div>
                   <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <BookOpen size={24} />
                   </div>
                </div>
                <ul className="text-sm text-slate-500 space-y-2 mb-8 flex-1">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Derivations Included</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Previous Year Qs</li>
                </ul>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <p className="text-3xl font-extrabold text-slate-900">₹299</p>
                  <button className="bg-[#f58a33] hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-orange-500/20">
                    Buy Now
                  </button>
                </div>
              </div>

               {/* Card 3 */}
               <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <span className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1 block">Class 10</span>
                     <h3 className="text-2xl font-bold text-slate-800">Science</h3>
                   </div>
                   <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <BookOpen size={24} />
                   </div>
                </div>
                <ul className="text-sm text-slate-500 space-y-2 mb-8 flex-1">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Diagram Explanations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Topper's Choice</li>
                </ul>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <p className="text-3xl font-extrabold text-slate-900">₹199</p>
                  <button className="bg-[#1a5eb0] hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-blue-500/20">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-blue-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-3xl mb-4">
                <GraduationCap size={36} className="text-blue-500" />
                <span>EduNotes</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
                Your ultimate destination for high-quality, reliable, and affordable study materials. We empower students to achieve their academic dreams.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="hover:text-blue-400 transition">Home</Link></li>
                <li><Link href="#notes" className="hover:text-blue-400 transition">Browse Notes</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition">Student Login</Link></li>
                <li><Link href="/signup" className="hover:text-blue-400 transition">Register</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Support & Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-blue-400 transition">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar & Hidden Admin Link */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} EduNotes. All rights reserved.</p>
            
            {/* Subtle Admin Login Link */}
            <Link 
              href="/admin/login" 
              className="mt-4 md:mt-0 text-slate-700 hover:text-slate-400 transition"
              title="Admin Portal"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}