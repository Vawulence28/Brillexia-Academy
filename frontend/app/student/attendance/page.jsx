'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';

export default function StudentAttendancePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/student/attendance')
        .then((res) => setAttendance(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Loading attendance records...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">My Attendance History</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Verified records for your tutoring sessions[cite: 18].</p>

        {attendance.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No attendance records found[cite: 18].</p></Card>
        ) : (
          <div className="space-y-4">
            {attendance.map((att) => (
              <Card key={att.attendance_id}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{att.lesson_title}[cite: 18]</h3>
                    <p className="text-xs text-slate-600 mt-1">Instructor: {att.instructor_first} {att.instructor_last}[cite: 18]</p>
                    <p className="text-xs text-slate-500 mt-1">📅 Scheduled: {new Date(att.scheduled_start).toLocaleString()}[cite: 18]</p>
                  </div>
                  <div className="mt-2 md:mt-0 flex flex-wrap gap-2 w-full md:w-auto">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${att.student_present ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      Student: {att.student_present ? 'Present' : 'Absent'}[cite: 18]
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${att.instructor_present ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      Instructor: {att.instructor_present ? 'Present' : 'Absent'}[cite: 18]
                    </span>
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