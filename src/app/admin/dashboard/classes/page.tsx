"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, School, X, Loader2, GitBranch } from "lucide-react";

export default function ManageClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [hasStream, setHasStream] = useState(false); // Naya field stream ke liye
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      if (res.ok) setClasses(data.classes);
    } catch (error) {
      console.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const body = { 
        id: editingId, 
        name: className, 
        hasStream: hasStream 
      };

      const res = await fetch("/api/classes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setIsSubmitting(false);
        return;
      }
      
      // Reset & Refresh
      setClassName("");
      setHasStream(false);
      setEditingId(null);
      setIsModalOpen(false);
      fetchClasses();
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure? Deleting this class might affect linked streams and subjects.");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/classes?id=${id}`, { method: "DELETE" });
      fetchClasses();
    } catch (error) {
      console.error("Failed to delete class");
    }
  };

  const openAddModal = () => {
    setClassName("");
    setHasStream(false);
    setEditingId(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cls: any) => {
    setClassName(cls.name);
    setHasStream(cls.hasStream);
    setEditingId(cls._id);
    setError("");
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <School className="text-blue-600" /> Manage Classes
          </h1>
          <p className="text-slate-500 mt-1">Create classes and configure stream settings (e.g., Science, Commerce).</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/30 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add New Class
        </button>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-blue-600">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <School size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700">No classes found</h3>
            <p>Click "Add New Class" to build your platform's hierarchy.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Class Name</th>
                  <th className="px-6 py-4 font-semibold">Streams Enabled</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{cls.name}</td>
                    <td className="px-6 py-4">
                      {cls.hasStream ? (
                        <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">
                          <GitBranch size={14} /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                          <X size={14} /> No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(cls)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition mr-2" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(cls._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition" title="Delete">
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

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Class" : "Add New Class"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-4 border border-red-200">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Class Name</label>
                <input 
                  type="text" 
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g., Class 11, NEET, JEE"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-800 font-medium"
                />
              </div>

              {/* Stream Toggle Checkbox */}
              <div className="mb-8 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                <div className="flex items-center h-5 mt-1">
                  <input
                    id="stream-toggle"
                    type="checkbox"
                    checked={hasStream}
                    onChange={(e) => setHasStream(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                </div>
                <div>
                  <label htmlFor="stream-toggle" className="font-bold text-slate-800 cursor-pointer block mb-0.5">
                    Enable Streams for this class?
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Check this if the class has divisions like Science, Commerce, Arts (e.g., for Class 11 & 12). Keep unchecked for classes like 10th or NEET.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
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
                  {editingId ? "Save Changes" : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}