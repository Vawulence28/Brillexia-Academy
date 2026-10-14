'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';

export default function StudentResultsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/assignments')
        .then((res) => setAssignments(res.data.filter(a => a.grade !== null && a.grade !== undefined)))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Loading academic results...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Results & Academic Progress[cite: 18]</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Released assignment grades and instructor feedback[cite: 18].</p>

        {assignments.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No graded results released yet[cite: 18].</p></Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((item) => (
              <Card key={item.assignment_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{item.title}[cite: 18]</h3>
                    <p className="text-xs text-slate-500 mt-1">Course: {item.course_title}[cite: 18]</p>
                    {item.instructor_feedback && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-3">
                        <strong>Instructor Feedback:</strong> {item.instructor_feedback}[cite: 18]
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-xs text-slate-500 sm:hidden">Grade:</span>
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-[#142B55]">{item.grade}[cite: 18]</span>
                      <span className="text-xs text-slate-500 block sm:inline"> / 100[cite: 18]</span>
                    </div>
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