'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import InstructorSidebar from '../../../components/layout/InstructorSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function InstructorMaterialsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('PDF');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'INSTRUCTOR')) {
      router.push('/login');
      return;
    }
    if (user) {
      loadMaterials();
    }
  }, [user, authLoading, router]);

  const loadMaterials = async () => {
    try {
      const res = await apiRequest('/materials');
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/materials', {
        method: 'POST',
        body: JSON.stringify({ title, fileUrl, fileType })
      });
      alert('Learning material uploaded successfully!');
      setShowForm(false);
      setTitle('');
      setFileUrl('');
      loadMaterials();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading learning materials...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <InstructorSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Learning Materials</h2>
            <p className="text-xs md:text-sm text-slate-600">Upload and manage authorized learning resources for students.</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Upload Material'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Upload New Material</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Material Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Calculus Chapter 1 Notes" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">File URL</label>
                <input type="url" required value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">File Type</label>
                <select value={fileType} onChange={(e) => setFileType(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  <option value="PDF">PDF Document</option>
                  <option value="DOCUMENT">Word / Text Document</option>
                  <option value="VIDEO">Video Link</option>
                  <option value="IMAGE">Image / Diagram</option>
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full sm:w-auto">Upload Resource</Button>
            </form>
          </Card>
        )}

        {materials.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No learning materials uploaded yet[cite: 11].</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.map((m) => (
              <Card key={m.material_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{m.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Type: {m.file_type} • Uploaded: {new Date(m.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{m.file_type}</span>
                </div>
                {m.file_url && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#142B55] hover:underline">
                      Access Resource File ↗
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}