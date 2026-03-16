"use client";

import { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { CLASSES } from "@/src/lib/constants";

export default function UploadNotes() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Component load hone par saare subjects fetch kar lo
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        const data = await res.json();
        if (res.ok) setSubjects(data.subjects);
      } catch (error) {
        console.error("Failed to fetch subjects");
      }
    };
    fetchSubjects();
  }, []);

  // Jab user Class change kare, toh pehle se selected subject clear kar do
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSubject(""); 
  };

  // Upload Function
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedSubject) {
      setMessage({ type: "error", text: "Please select a subject first." });
      return;
    }

    if (!file) {
      setMessage({ type: "error", text: "Please select a PDF file." });
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Only PDF files are allowed." });
      return;
    }

    setIsUploading(true);

    try {
      // FormData ka use karke file aur ID bhej rahe hain
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subjectId", selectedSubject);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Notes uploaded successfully! The PDF is now linked to the subject." });
        setFile(null); // Form reset
        
        // Input file tag ko bhi reset karna (HTML DOM manipulation)
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
      } else {
        setMessage({ type: "error", text: data.message || "Upload failed." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please check your connection." });
    } finally {
      setIsUploading(false);
    }
  };

  // Sirf wahi subjects dikhao jo selected class ke hain
  const filteredSubjects = subjects.filter(sub => sub.classId === selectedClass);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <UploadCloud className="text-blue-600" /> Upload Study Notes
        </h1>
        <p className="text-slate-500 mt-1">Upload PDF study materials and link them to specific subjects.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        
        {/* Success / Error Messages */}
        {message.text && (
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {message.type === 'error' ? <AlertCircle className="mt-0.5 shrink-0" size={20} /> : <CheckCircle className="mt-0.5 shrink-0" size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          
          {/* Step 1: Select Class */}
          <div>
            <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">1. Select Class</label>
            <select 
              required
              value={selectedClass}
              onChange={handleClassChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              <option value="" disabled>-- Choose a Class --</option>
              {CLASSES.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Subject */}
          <div>
            <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">2. Select Subject</label>
            <select 
              required
              disabled={!selectedClass} // Agar class select nahi hui toh yeh disabled rahega
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-slate-100 disabled:opacity-60"
            >
              <option value="" disabled>
                {selectedClass ? "-- Choose a Subject --" : "Please select a class first"}
              </option>
              {filteredSubjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} (₹{sub.price})
                </option>
              ))}
            </select>
            {selectedClass && filteredSubjects.length === 0 && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> No subjects found for this class. Create one in 'Manage Subjects' first.
              </p>
            )}
          </div>

          {/* Step 3: File Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">3. Upload PDF File</label>
            <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-8 text-center hover:bg-slate-100 transition relative">
              <input 
                type="file" 
                id="file-upload"
                accept=".pdf"
                required
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none">
                {file ? (
                  <>
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <FileText size={32} />
                    </div>
                    <p className="text-lg font-bold text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p className="text-sm text-blue-600 font-semibold mt-4">Click to change file</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud size={32} />
                    </div>
                    <p className="text-lg font-bold text-slate-800">Click to browse or drag & drop</p>
                    <p className="text-sm text-slate-500 mt-1">PDF files only (Max 10MB recommended)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={isUploading || !selectedSubject || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 group"
            >
              {isUploading ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> Uploading to Cloudinary...
                </>
              ) : (
                <>
                  <UploadCloud size={24} className="group-hover:-translate-y-1 transition-transform" /> Upload & Save Notes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}