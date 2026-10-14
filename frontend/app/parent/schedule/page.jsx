'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import ParentSidebar from '../../../components/layout/ParentSidebar';
import { Card } from '../../../components/ui/Card';

export default function ParentSchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PARENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/parent/children')
        .then((res) => {
          setChildren(res.data);
          if (res.data.length > 0) setSelectedChildId(res.data[0].student_id);
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedChildId) {
      setLoading(true);
      apiRequest(`/parent/children/${selectedChildId}/schedule`)
        .then((res) => setSchedule(res.data))
        .finally(() => setLoading(false));
    }
  }, [selectedChildId]);

  if (authLoading || (loading && children.length === 0)) return <div className="min-h-screen flex items-center justify-center">Loading schedule...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <ParentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Lesson Timetable</h2>
            <p className="text-xs md:text-sm text-slate-600">Upcoming and completed tutoring sessions.</p>
          </div>
          {children.length > 0 && (
            <select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-bold text-[#142B55] w-full sm:w-auto">
              {children.map(c => <option key={c.student_id} value={c.student_id}>{c.first_name} {c.last_name}</option>)}
            </select>
          )}
        </header>

        {schedule.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No lessons scheduled for this child.</p></Card>
        ) : (
          <div className="space-y-4">
            {schedule.map((l) => (
              <Card key={l.lesson_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{l.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">Instructor: {l.instructor_first} {l.instructor_last} • Course: {l.course_title || 'General'}</p>
                    <p className="text-xs text-slate-500 mt-1">📅 Start: {new Date(l.scheduled_start).toLocaleString()} | End: {new Date(l.scheduled_end).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 self-start sm:self-auto">{l.status}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}