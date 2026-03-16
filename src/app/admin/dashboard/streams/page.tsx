"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GitBranch, X, Loader2, AlertCircle } from "lucide-react";

export default function ManageStreams() {
  const [streams, setStreams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]); // Dropdown ke liye
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streamName, setStreamName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Dono API ko ek sath call karo time bachane ke liye
      const [streamsRes, classesRes] = await Promise.all([
        fetch("/api/streams"),
        fetch("/api/classes")
      ]);

      const streamsData = await streamsRes.json();
      const classesData = await classesRes.json();

      if (streamsRes.ok) setStreams(streamsData.streams);
      
      // Class ka filter: Sirf wahi class lo jisme stream enabled ho
      if (classesRes.ok) {
        const streamEnabledClasses = classesData.classes.filter((c: any) => c.hasStream === true);
        setClasses(streamEnabledClasses);
      }
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!selectedClassId) {
      setError("Please select a class for this stream.");
      setIsSubmitting(false);
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const body = { 
        id: editingId, 
        name: streamName, 
        classId: selectedClassId 
      };

      const res = await fetch("/api/streams", {
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
      setStreamName("");
      setSelectedClassId("");
      setEditingId(null);
      setIsModalOpen(false);
      fetchData(); // Wapas fetch karo taki naya data table me aa jaye
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure? Deleting this stream might affect linked subjects and notes.");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/streams?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete stream");
    }
  };

  const openAddModal = () => {
    setStreamName("");
    setSelectedClassId("");
    setEditingId(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (stream: any) => {
    setStreamName(stream.name);
    // Populate wale relation mein ID `_id` ke andar hoti hai
    setSelectedClassId(stream.classId?._id || stream.classId); 
    setEditingId(stream._id);
    setError("");
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <GitBranch className="text-purple-600" /> Manage Streams
          </h1>
          <p className="text-slate-500 mt-1">Create and assign streams (Science, Commerce) to specific classes.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-purple-500/30 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add New Stream
        </button>
      </div>

      {/* Warning message agar koi aisi class na ho jisme stream enabled ho */}
      {!loading && classes.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">You haven't enabled streams for any class yet. Please go to <strong>Manage Classes</strong> and enable streams for at least one class (like Class 11 or 12) before adding streams here.</p>
        </div>
      )}

      {/* Streams List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-purple-600">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : streams.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <GitBranch size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700">No streams found</h3>
            <p>Click "Add New Stream" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Stream Name</th>
                  <th className="px-6 py-4 font-semibold">Linked Class</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {streams.map((stream) => (
                  <tr key={stream._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{stream.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                        {stream.classId?.name || "Unknown Class"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(stream)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-md transition mr-2" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(stream._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition" title="Delete">
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
                {editingId ? "Edit Stream" : "Add New Stream"}
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

              {/* Class Dropdown */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Select Class</label>
                <select 
                  required
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none font-medium text-slate-700"
                >
                  <option value="" disabled>-- Choose a Class --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
                {classes.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">No eligible classes found. Please enable streams for a class first.</p>
                )}
              </div>

              {/* Stream Name Input */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Stream Name</label>
                <input 
                  type="text" 
                  required
                  value={streamName}
                  onChange={(e) => setStreamName(e.target.value)}
                  placeholder="e.g., Science, Commerce, Arts"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-slate-800 font-medium"
                />
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
                  disabled={isSubmitting || classes.length === 0}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  {editingId ? "Save Changes" : "Create Stream"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}