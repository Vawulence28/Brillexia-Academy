'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import InstructorSidebar from '../../../components/layout/InstructorSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function InstructorAttendancePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'INSTRUCTOR')) {
      router.push('/login');
      return;
    }
    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [attRes, schedRes] = await Promise.all([
        apiRequest('/attendance'),
        apiRequest('/instructor/schedule')
      ]);
      setAttendance(attRes.data);
      setSchedule(schedRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (lessonId, studentPresent, instructorPresent) => {
    try {
      await apiRequest('/attendance', {
        method: 'POST',
        body: JSON.stringify({ lessonId, studentPresent, instructorPresent })
      });
      alert('Attendance recorded successfully.');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading attendance...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <InstructorSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Lesson Attendance</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Record and verify attendance for tutoring sessions.</p>

        {schedule.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No lessons found.</p></Card>
        ) : (
          <div className="space-y-4">
            {schedule.map((l) => {
              const attRecord = attendance.find(a => a.lesson_id === l.lesson_id);
              return (
                <Card key={l.lesson_id}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-[#142B55] text-base md:text-lg">{l.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">Student: {l.student_first} {l.student_last} • Scheduled: {new Date(l.scheduled_start).toLocaleString()}</p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-3">
                      <span className="text-xs text-slate-500">
                        Status: {attRecord ? (attRecord.student_present ? '✅ Student Present' : '❌ Student Absent') : '⏳ Not Recorded'}
                      </span>
                      <div className="flex space-x-2 w-full sm:w-auto">
                        <Button variant="primary" className="flex-1 sm:flex-none text-xs py-1.5 px-3" onClick={() => handleMarkAttendance(l.lesson_id, true, true)}>
                          Present
                        </Button>
                        <Button variant="danger" className="flex-1 sm:flex-none text-xs py-1.5 px-3" onClick={() => handleMarkAttendance(l.lesson_id, false, true)}>
                          Absent
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}