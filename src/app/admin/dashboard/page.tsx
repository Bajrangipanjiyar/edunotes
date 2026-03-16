"use client";

import { Users, School, BookOpen, IndianRupee } from "lucide-react";

export default function AdminDashboardHome() {
  // Yeh abhi dummy data hai. Baad mein hum isko MongoDB API se connect karenge.
  const stats = [
    { title: "Total Students", value: "0", icon: <Users size={28} />, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { title: "Total Classes", value: "0", icon: <School size={28} />, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
    { title: "Total Subjects", value: "0", icon: <BookOpen size={28} />, color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
    { title: "Total Earnings", value: "₹0", icon: <IndianRupee size={28} />, color: "bg-green-50 text-green-600", border: "border-green-100" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
      <p className="text-slate-500 mb-8">Welcome back, Ahom. Here is what's happening today.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white rounded-2xl p-6 shadow-sm border ${stat.border} hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Payments Table (Dummy design for now) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Recent Payments</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Empty State */}
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <IndianRupee size={40} className="text-slate-300 mb-3" />
                    <p className="font-medium text-slate-600">No recent payments found.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}