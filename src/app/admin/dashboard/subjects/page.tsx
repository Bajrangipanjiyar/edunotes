"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, BookOpen, X, Loader2 } from "lucide-react";

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStreamId, setSelectedStreamId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Teeno APIs ek sath call karo
      const [subsRes, clsRes, strmRes] = await Promise.all([
        fetch("/api/subjects"),
        fetch("/api/classes"),
        fetch("/api/streams")
      ]);

      if (subsRes.ok) setSubjects((await subsRes.json()).subjects);
      if (clsRes.ok) setClasses((await clsRes.json()).classes);
      if (strmRes.ok) setStreams((await strmRes.json()).streams);
      
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Selected Class ki details nikalna
  const selectedClassDetails = classes.find(c => c._id === selectedClassId);
  const showStreamDropdown = selectedClassDetails?.hasStream;

  // Jab class change ho, toh purani stream hta do
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClassId(e.target.value);
    setSelectedStreamId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (showStreamDropdown && !selectedStreamId) {
      setError("Please select a stream for this class.");
      setIsSubmitting(false);
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const body = { 
        id: editingId, 
        name: subjectName, 
        classId: selectedClassId,
        streamId: showStreamDropdown ? selectedStreamId : null 
      };

      const res = await fetch("/api/subjects", {
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
      
      setSubjectName("");
      setSelectedClassId("");
      setSelectedStreamId("");
      setEditingId(null);
      setIsModalOpen(false);
      fetchData(); 
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure? Deleting this subject will affect linked chapters and notes.");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/subjects?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete subject");
    }
  };

  const openAddModal = () => {
    setSubjectName("");
    setSelectedClassId("");
    setSelectedStreamId("");
    setEditingId(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (subject: any) => {
    setSubjectName(subject.name);
    setSelectedClassId(subject.classId?._id || "");
    setSelectedStreamId(subject.streamId?._id || "");
    setEditingId(subject._id);
    setError("");
    setIsModalOpen(true);
  };

  // Filter streams bas wahi dikhane ke liye jo selected class se judi hon
  const filteredStreams = streams.filter(s => {
    // API se populate hoke stream mein classId object ya string dono ho sakta hai
    const sClassId = s.classId?._id || s.classId;
    return sClassId === selectedClassId;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-orange-600" /> Manage Subjects
          </h1>
          <p className="text-slate-500 mt-1">Add subjects to specific classes or streams (e.g., Physics for Class 11 Science).</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-orange-500/30 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add New Subject
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-orange-600">
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
                  <th className="px-6 py-4 font-semibold">Assigned Class</th>
                  <th className="px-6 py-4 font-semibold">Stream</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{subject.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                        {subject.classId?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {subject.streamId ? (
                        <span className="inline-flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">
                          {subject.streamId.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(subject)} className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition mr-2" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(subject._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition" title="Delete">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Subject" : "Add New Subject"}
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
                  onChange={handleClassChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none font-medium text-slate-700"
                >
                  <option value="" disabled>-- Choose a Class --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Conditional Stream Dropdown */}
              {showStreamDropdown && (
                <div className="mb-5 animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Select Stream</label>
                  <select 
                    required
                    value={selectedStreamId}
                    onChange={(e) => setSelectedStreamId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none font-medium text-slate-700"
                  >
                    <option value="" disabled>-- Choose a Stream --</option>
                    {filteredStreams.map((strm) => (
                      <option key={strm._id} value={strm._id}>{strm.name}</option>
                    ))}
                  </select>
                  {filteredStreams.length === 0 && selectedClassId && (
                    <p className="text-xs text-red-500 mt-2">No streams found for this class. Please add a stream first.</p>
                  )}
                </div>
              )}

              {/* Subject Name Input */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Subject Name</label>
                <input 
                  type="text" 
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g., Physics, Biology, History"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-slate-800 font-medium"
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
                  disabled={isSubmitting || classes.length === 0 || (showStreamDropdown && filteredStreams.length === 0)}
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  {editingId ? "Save Changes" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}