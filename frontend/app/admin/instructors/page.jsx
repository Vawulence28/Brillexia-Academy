'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function AdminInstructorsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [previewCode, setPreviewCode] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) {
      loadInstructors();
    }
  }, [user, authLoading, router]);

  const loadInstructors = async () => {
    try {
      const res = await apiRequest('/admin/instructors');
      const activeInstructors = (res.data || []).filter(i => i.is_active !== false);
      setInstructors(activeInstructors);
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
      const res = await apiRequest('/admin/instructors/preview-code').catch(() => null);
      setPreviewCode(res?.accessCode || 'BAP-INS-NEW');
    } catch {
      setPreviewCode('BAP-INS-NEW');
    }
  };

  const handleSaveInstructor = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingInstructor) {
        await apiRequest(`/admin/instructors/${editingInstructor.instructor_id}`, {
          method: 'PUT',
          body: JSON.stringify({ firstName, lastName, email })
        });
        alert('Instructor updated successfully!');
      } else {
        await apiRequest('/admin/instructors', {
          method: 'POST',
          body: JSON.stringify({ firstName, lastName, email, password })
        });
        alert('Instructor account provisioned successfully!');
      }
      resetForm();
      loadInstructors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (i) => {
    setEditingInstructor(i);
    setFirstName(i.first_name);
    setLastName(i.last_name);
    setEmail(i.email || '');
    setPreviewCode(i.access_code);
    setShowForm(true);
  };

  const handleDelete = async (instructorId) => {
    if (!confirm('Are you sure you want to deactivate this instructor account?')) return;
    try {
      await apiRequest(`/admin/instructors/${instructorId}`, { method: 'DELETE' });
      alert('Instructor deactivated successfully.');
      loadInstructors();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingInstructor(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPreviewCode('');
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading instructors...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Instructor Management</h2>
            <p className="text-xs md:text-sm text-slate-600">Create, edit, and manage academy teaching staff.</p>
          </div>
          <Button variant="primary" onClick={() => { if (showForm) resetForm(); else handleOpenRegister(); }} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Register New Instructor'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">
              {editingInstructor ? 'Edit Instructor Account' : 'Register New Instructor'}
            </h3>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">{error}</div>}
            <form onSubmit={handleSaveInstructor} className="space-y-4">
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
                {!editingInstructor && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Initial Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" variant="primary">{editingInstructor ? 'Update Instructor' : 'Register Instructor'}</Button>
                <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {instructors.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No active instructors registered yet[cite: 15].</p></Card>
        ) : (
          <div className="space-y-4">
            {instructors.map((i) => (
              <Card key={i.instructor_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#142B55] text-base md:text-lg">{i.first_name} {i.last_name}</h3>
                      <span className="bg-[#D4AF37]/20 text-[#142B55] px-2 py-0.5 rounded text-xs font-mono font-bold">{i.access_code}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Email / Contact: {i.email || 'N/A'}</p>
                    
                    <div className="mt-2">
                      <span className="text-xs font-medium text-slate-700">Assigned Students:</span>
                      {i.assigned_students && i.assigned_students.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {i.assigned_students.map((student) => (
                            <span key={student.student_id} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                              {student.first_name} {student.last_name} ({student.access_code})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 italic ml-1">None assigned</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button onClick={() => handleEdit(i)} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(i.instructor_id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition">
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