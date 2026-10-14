'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const CLASS_LEVELS = [
  'Kindergarten 1',
  'Kindergarten 2',
  'Nursery 1',
  'Nursery 2',
  'Primary 1',
  'Primary 2',
  'Primary 3',
  'Primary 4',
  'Primary 5',
  'Primary 6',
  'JSS 1',
  'JSS 2',
  'JSS 3',
  'SS 1',
  'SS 2',
  'SS 3'
];

export default function AdminCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [subjectName, setSubjectName] = useState('');
  const [classLevel, setClassLevel] = useState('SS 1');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) {
      loadCourses();
    }
  }, [user, authLoading, router]);

  const loadCourses = async () => {
    try {
      const res = await apiRequest('/admin/courses');
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    
    // Automatically construct title, code, and description from simple inputs[cite: 14]
    const title = `${subjectName} - ${classLevel}`;
    const code = `${subjectName.toUpperCase().replace(/\s+/g, '-')}-${classLevel.toUpperCase().replace(/\s+/g, '')}`;
    const description = `Standard ${subjectName} curriculum designed for ${classLevel} students.`;

    try {
      await apiRequest('/admin/courses', {
        method: 'POST',
        body: JSON.stringify({ title, code, subject: subjectName, description })
      });
      alert('Course created successfully!');
      setShowForm(false);
      setSubjectName('');
      setClassLevel('SS 1');
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading courses...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Courses & Subjects</h2>
            <p className="text-xs md:text-sm text-slate-600">Academy curriculum containers mapped by class level.</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Create New Course'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-lg font-bold text-[#142B55] mb-4">Create New Course / Subject</h3>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">{error}</div>}
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Subject Name</label>
                  <input 
                    type="text" 
                    required 
                    value={subjectName} 
                    onChange={(e) => setSubjectName(e.target.value)} 
                    placeholder="e.g. Mathematics, Physics, English" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Class Level</label>
                  <select 
                    value={classLevel} 
                    onChange={(e) => setClassLevel(e.target.value)} 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {CLASS_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit" variant="primary">Create Course</Button>
            </form>
          </Card>
        )}

        {courses.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No courses found. Create your first subject above!</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <Card key={c.course_id}>
                <h3 className="font-bold text-[#142B55] text-lg">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Subject: {c.subject} • Code: {c.code}</p>
                <p className="text-sm text-slate-700 mt-3">{c.description}</p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}