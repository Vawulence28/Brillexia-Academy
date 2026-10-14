'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function AdminParentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [previewCode, setPreviewCode] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [parentRes, studentRes] = await Promise.all([
        apiRequest('/admin/parents'),
        apiRequest('/admin/students')
      ]);
      const activeParents = (parentRes.data || []).filter(p => p.is_active !== false);
      const activeStudents = (studentRes.data || []).filter(s => s.is_active !== false);
      setParents(activeParents);
      setStudents(activeStudents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = async () => {
    resetForm();
    setShowForm(true);
    try {
      const res = await apiRequest('/admin/parents/preview-code').catch(() => null);
      setPreviewCode(res?.accessCode || 'BAP-PAR-NEW');
    } catch {
      setPreviewCode('BAP-PAR-NEW');
    }
  };

  const handleSaveParent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingParent) {
        await apiRequest(`/admin/parents/${editingParent.parent_id}`, {
          method: 'PUT',
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            studentId: selectedStudentId || null
          })
        });
        alert('Parent updated successfully!');
      } else {
        await apiRequest('/admin/parents', {
          method: 'POST',
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            studentId: selectedStudentId || null
          })
        });
        alert('Parent/Guardian account created successfully!');
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (p) => {
    setEditingParent(p);
    setFirstName(p.first_name);
    setLastName(p.last_name);
    setEmail(p.email || '');
    setSelectedStudentId(p.student_id || '');
    setPreviewCode(p.access_code);
    setShowForm(true);
  };

  const handleDelete = async (parentId) => {
    if (!confirm('Are you sure you want to deactivate this parent account?')) return;
    try {
      await apiRequest(`/admin/parents/${parentId}`, { method: 'DELETE' });
      alert('Parent deactivated successfully.');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingParent(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setSelectedStudentId('');
    setPreviewCode('');
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading parents...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Parent & Guardian Management</h2>
            <p className="text-xs md:text-sm text-slate-600">Create, edit, and link guardian accounts to students.</p>
          </div>
          <Button variant="primary" onClick={() => { if (showForm) resetForm(); else handleOpenRegister(); }} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Register New Parent'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">
              {editingParent ? 'Edit Parent Account' : 'Register New Parent Account'}
            </h3>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">{error}</div>}
            <form onSubmit={handleSaveParent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Access Code (Auto-Generated & Reserved upon submission)</label>
                <input 
                  type="text" 
                  disabled 
                  value={previewCode} 
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-100 font-mono font-bold text-[#142B55]" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email / Contact Info</label>
                  <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                </div>
                {!editingParent && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Initial Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Link Child / Student</label>
                <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  <option value="">-- Select Student to Link --</option>
                  {students.map((s) => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.first_name} {s.last_name} ({s.access_code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" variant="primary">{editingParent ? 'Update Parent' : 'Create Guardian Account'}</Button>
                <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {parents.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No active parent accounts found.</p></Card>
        ) : (
          <div className="space-y-4">
            {parents.map((p) => (
              <Card key={p.parent_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#142B55] text-base md:text-lg">{p.first_name} {p.last_name}</h3>
                      <span className="bg-[#D4AF37]/20 text-[#142B55] px-2 py-0.5 rounded text-xs font-mono font-bold">{p.access_code}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Email / Contact: {p.email || 'N/A'}</p>
                    <p className="text-xs font-medium text-slate-700 mt-2">
                      🔗 Linked Student: {p.student_first ? (
                        <span className="text-blue-700 font-semibold">{p.student_first} {p.student_last} ({p.student_code})</span>
                      ) : (
                        <span className="text-amber-600 italic">None (Unlinked)</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button onClick={() => handleEdit(p)} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition">
                      Edit & Link
                    </button>
                    <button onClick={() => handleDelete(p.parent_id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition">
                      Deactivate
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}