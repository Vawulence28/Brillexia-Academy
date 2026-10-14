'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';

export default function StudentLessonsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/student/lessons')
        .then((res) => setLessons(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading lessons...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-6">My Lessons</h2>
        {lessons.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No lessons found[cite: 16].</p></Card>
        ) : (
          <div className="space-y-4">
            {lessons.map((l) => (
              <Card key={l.lesson_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{l.title}[cite: 16]</h3>
                    <p className="text-xs text-slate-600 mt-1">Instructor: {l.instructor_first} {l.instructor_last} • Course: {l.course_title || 'General'}[cite: 16]</p>
                    <p className="text-xs text-slate-500 mt-1">📅 Start: {new Date(l.scheduled_start).toLocaleString()} | End: {new Date(l.scheduled_end).toLocaleString()}[cite: 16]</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 self-start sm:self-auto">{l.status}[cite: 16]</span>
                </div>
                {l.meeting_url && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-600">Provider: {l.meeting_provider}[cite: 16]</span>
                    <a href={l.meeting_url} target="_blank" rel="noopener noreferrer" className="bg-[#D4AF37] text-[#0F172A] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#c29f2e] transition text-center w-full sm:w-auto">
                      Join Meeting →[cite: 16]
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