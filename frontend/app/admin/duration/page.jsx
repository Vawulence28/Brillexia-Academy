'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';

export default function AdminDurationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [monitoring, setMonitoring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/admin/duration-monitoring')
        .then((res) => setMonitoring(res.data))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading session duration audits...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Hidden Session Duration Monitoring</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Administrative oversight comparing scheduled versus verified actual teaching duration.</p>

        {monitoring.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No session duration records found.</p></Card>
        ) : (
          <div className="space-y-4">
            {monitoring.map((m) => (
              <Card key={m.lesson_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{m.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">Student: {m.student_first} {m.student_last} • Instructor: {m.instructor_first} {m.instructor_last}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Scheduled Duration: <span className="font-semibold">{m.scheduled_duration_minutes} mins</span> | Verified Duration: <span className="font-semibold text-emerald-700">{m.verified_duration_minutes} mins</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 self-start">{m.verification_status}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}