'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import InstructorSidebar from '../../../components/layout/InstructorSidebar';
import { Card } from '../../../components/ui/Card';

export default function InstructorStudentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'INSTRUCTOR')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/instructor/students')
        .then((res) => setStudents(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading students...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <InstructorSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-6">My Assigned Students</h2>
        {students.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No students assigned.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((s) => (
              <Card key={s.student_id}>
                <h3 className="font-bold text-[#142B55] text-base md:text-lg">{s.first_name} {s.last_name}</h3>
                <p className="text-xs text-slate-500 mt-1">Email: {s.email} • Phone: {s.phone || 'N/A'}</p>
                <p className="text-xs text-slate-600 mt-2">Grade Level: {s.grade_level || 'Not specified'}</p>
                {s.learning_goals && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-3">
                    <strong>Learning Goals:</strong> {s.learning_goals}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}