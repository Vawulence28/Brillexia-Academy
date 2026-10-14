'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import InstructorSidebar from '../../../components/layout/InstructorSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function InstructorSchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [schedule, setSchedule] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [meetingProvider, setMeetingProvider] = useState('GOOGLE_MEET');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [error, setError] = useState('');

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
      const [schedRes, studRes] = await Promise.all([
        apiRequest('/instructor/schedule'),
        apiRequest('/instructor/students')
      ]);
      setSchedule(schedRes.data);
      setStudents(studRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiRequest('/instructor/lessons', {
        method: 'POST',
        body: JSON.stringify({ studentId, title, description, scheduledStart, scheduledEnd, meetingProvider, meetingUrl })
      });
      alert('lesson scheduled successfully!');
      setShowForm(false);
      setTitle('');
      setDescription('');
      setScheduledStart('');
      setScheduledEnd('');
      setMeetingUrl('');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading schedule...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <InstructorSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Lesson Schedule</h2>
            <p className="text-xs md:text-sm text-slate-600">Manage individual teaching sessions with assigned students.</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Schedule New Lesson'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Schedule Individual Lesson</h3>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">{error}</div>}
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Assigned Student</label>
                <select required value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  <option value="">-- Choose student --</option>
                  {students.map((s) => (
                    <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Lesson Title / Topic</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Advanced Calculus Tutoring" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Scheduled Start</label>
                  <input type="datetime-local" required value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Scheduled End</label>
                  <input type="datetime-local" required value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Meeting Provider</label>
                  <select value={meetingProvider} onChange={(e) => setMeetingProvider(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Meeting URL</label>
                  <input type="url" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://meet.google.com/..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full sm:w-auto">Save & Schedule Lesson</Button>
            </form>
          </Card>
        )}

        {schedule.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No scheduled lessons found.</p></Card>
        ) : (
          <div className="space-y-4">
            {schedule.map((l) => (
              <Card key={l.lesson_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{l.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">Student: {l.student_first} {l.student_last} • Course: {l.course_title || 'General'}</p>
                    <p className="text-xs text-slate-500 mt-1">📅 Start: {new Date(l.scheduled_start).toLocaleString()} | End: {new Date(l.scheduled_end).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 self-start sm:self-auto">{l.status}</span>
                </div>
                {l.meeting_url && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-600">Provider: {l.meeting_provider}</span>
                    <a href={l.meeting_url} target="_blank" rel="noopener noreferrer" className="bg-[#D4AF37] text-[#0F172A] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#c29f2e] transition text-center w-full sm:w-auto">
                      Join Meeting →
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