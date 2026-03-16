"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, X, Loader2, IndianRupee } from "lucide-react";
import { CLASSES } from "@/src/lib/constants"; // Hamari static classes file

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classId, setClassId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Saare subjects fetch karne ka function
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      if (res.ok) setSubjects(data.subjects);
    } catch (error) {
      console.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Naya Subject Add karne ka function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          classId: classId, 
          name: subjectName, 
          price: Number(price) 
        }),
      });
      
      // Reset form and close modal
      setClassId("");
      setSubjectName("");
      setPrice("");
      setIsModalOpen(false);
      
      // Refresh list
      fetchSubjects();
    } catch (error) {
      console.error("Error adding subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Subject Delete karne ka function
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/subjects?id=${id}`, { method: "DELETE" });
      fetchSubjects(); // Refresh data
    } catch (error) {
      console.error("Failed to delete subject");
    }
  };

  // Class ID ("class-10") se uska display Name ("Class 10") nikalne ka helper function
  const getClassName = (id: string) => {
    const foundClass = CLASSES.find(c => c.id === id);
    return foundClass ? foundClass.name : id;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Manage Subjects
          </h1>
          <p className="text-slate-500 mt-1">Add subjects, set prices, and assign them to classes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/30 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add New Subject
        </button>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-blue-600">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700">No subjects found</h3>
            <p>Click "Add New Subject" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Subject Name</th>
                  <th className="px-6 py-4 font-semibold">Class</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">{subject.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {getClassName(subject.classId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-bold flex items-center gap-1">
                      <IndianRupee size={16} className="text-slate-500" /> {subject.price}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(subject._id)} 
                        className="p-2 text-red-500 hover:bg-red-100 rounded-md transition inline-flex"
                        title="Delete Subject"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Add New Subject</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Class Selection Dropdown */}
              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Select Class</label>
                <select 
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="" disabled>-- Choose a Class --</option>
                  {CLASSES.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Subject Name Input */}
              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Subject Name</label>
                <input 
                  type="text" 
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="249"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}