'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function AdminStudentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [previewCode, setPreviewCode] = useState('');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) loadData();
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [studentRes, instructorRes] = await Promise.all([
        apiRequest('/admin/students'),
        apiRequest('/admin/instructors')
      ]);
      const activeStudents = (studentRes.data || []).filter(s => s.is_active !== false);
      const activeInstructors = (instructorRes.data || []).filter(i => i.is_active !== false);
      setStudents(activeStudents);
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
      const res = await apiRequest('/admin/students/preview-code');
      setPreviewCode(res.accessCode || 'BAP-STU-XXX');
    } catch {
      setPreviewCode('BAP-STU-NEW');
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingStudent) {
        await apiRequest(`/admin/students/${editingStudent.student_id}`, {
          method: 'PUT',
          body: JSON.stringify({ firstName, lastName, email, gradeLevel, learningGoals, instructorId: instructorId || null })
        });
        alert('Student updated successfully!');
      } else {
        await apiRequest('/admin/students', {
          method: 'POST',
          body: JSON.stringify({ firstName, lastName, email, password, gradeLevel, learningGoals, instructorId: instructorId || null })
        });
        alert('Student created successfully!');
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReassign = async (studentId, newInstructorId) => {
    try {
      await apiRequest('/admin/students/assign-instructor', {
        method: 'POST',
        body: JSON.stringify({ studentId, instructorId: newInstructorId || null })
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (s) => {
    setEditingStudent(s);
    setFirstName(s.first_name);
    setLastName(s.last_name);
    setEmail(s.email || '');
    setGradeLevel(s.grade_level || '');
    setLearningGoals(s.learning_goals || '');
    setInstructorId(s.instructor_id || '');
    setPreviewCode(s.access_code);
    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Are you sure you want to deactivate this student account?')) return;
    try {
      await apiRequest(`/admin/students/${studentId}`, { method: 'DELETE' });
      alert('Student deactivated.');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setGradeLevel('');
    setLearningGoals('');
    setInstructorId('');
    setPreviewCode('');
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading students...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Student Management</h2>
            <p className="text-xs md:text-sm text-slate-600">Create, edit, and assign instructor mentorships.</p>
          </div>
          <Button variant="primary" onClick={() => { if (showForm) resetForm(); else handleOpenRegister(); }} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Register New Student'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">
              {editingStudent ? 'Edit Student Account' : 'Register New Student Account'}
            </h3>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">{error}</div>}
            <form onSubmit={handleSaveStudent} className="space-y-4">
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
                {!editingStudent && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Initial Password</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Grade Level</label>
                  <input type="text" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Assigned Instructor</label>
                  <select 
                    value={instructorId} 
                    onChange={(e) => setInstructorId(e.target.value)} 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">-- None (Unassigned) --</option>
                    {instructors.map((i) => (
                      <option key={i.instructor_id} value={i.instructor_id}>
                        {i.first_name} {i.last_name} ({i.access_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Learning Goals</label>
                <input type="text" value={learningGoals} onChange={(e) => setLearningGoals(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" variant="primary">{editingStudent ? 'Update Student' : 'Create Student'}</Button>
                <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {students.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No active students registered yet.</p></Card>
        ) : (
          <div className="space-y-4">
            {students.map((s) => (
              <Card key={s.student_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#142B55] text-base md:text-lg">{s.first_name} {s.last_name}</h3>
                      <span className="bg-[#D4AF37]/20 text-[#142B55] px-2 py-0.5 rounded text-xs font-mono font-bold">{s.access_code}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Email: {s.email || 'N/A'} • Grade: {s.grade_level || 'N/A'}</p>
                    <p className="text-xs text-slate-500 mt-1">Goals: {s.learning_goals || 'None'}</p>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-600">Assigned Instructor:</span>
                      <select 
                        value={s.instructor_id || ''} 
                        onChange={(e) => handleReassign(s.student_id, e.target.value)}
                        className="text-xs px-2 py-1 border border-slate-300 rounded-lg bg-white text-[#142B55] font-semibold"
                      >
                        <option value="">-- Unassigned --</option>
                        {instructors.map((i) => (
                          <option key={i.instructor_id} value={i.instructor_id}>
                            {i.first_name} {i.last_name} ({i.access_code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button onClick={() => handleEdit(s)} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.student_id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition">
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