'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import InstructorSidebar from '../../../components/layout/InstructorSidebar';
import { Card } from '../../../components/ui/Card';

export default function InstructorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'INSTRUCTOR')) {
      router.push('/login');
      return;
    }
    if (user && user.role === 'INSTRUCTOR') {
      apiRequest('/instructor/dashboard')
        .then((res) => setData(res.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading instructor dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <InstructorSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Welcome, Instructor {user.firstName}!</h2>
            <p className="text-xs md:text-sm text-slate-600">Manage your assigned students, schedule, and lesson reports.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs md:text-sm font-medium text-slate-700 shadow-sm self-start sm:self-auto">
            Role: <span className="text-[#142B55] font-bold">INSTRUCTOR</span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned Students</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{data?.assignedStudentsCount || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Lessons</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] mt-2">{data?.upcomingLessons?.length || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Assignment Grading</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{data?.pendingGrading?.length || 0}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Upcoming Sessions</h3>
            {data?.upcomingLessons?.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-500 py-4 text-center">No upcoming lessons scheduled.</p>
            ) : (
              <div className="space-y-3">
                {data.upcomingLessons.map((l) => (
                  <div key={l.lesson_id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <h4 className="font-semibold text-[#142B55] text-sm md:text-base">{l.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">Student: {l.student_first} {l.student_last}</p>
                    <p className="text-xs text-slate-500 mt-1">📅 {new Date(l.scheduled_start).toLocaleString()}</p>
                    {l.meeting_url && (
                      <a href={l.meeting_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs bg-[#D4AF37] text-[#0F172A] font-semibold px-3 py-1.5 rounded-md">
                        Join Meeting →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Assigned Students Roster</h3>
            {data?.assignedStudents?.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-500 py-4 text-center">No students currently assigned.</p>
            ) : (
              <div className="space-y-3">
                {data.assignedStudents.map((s) => (
                  <div key={s.student_id} className="p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{s.first_name} {s.last_name}</h4>
                      <p className="text-xs text-slate-500">{s.email} • Grade: {s.grade_level || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}