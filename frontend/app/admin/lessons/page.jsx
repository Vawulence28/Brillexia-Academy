'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function AdminLessonsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [studentId, setStudentId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      const [lRes, sRes, iRes, cRes] = await Promise.all([
        apiRequest('/admin/lessons'),
        apiRequest('/admin/students'),
        apiRequest('/admin/instructors'),
        apiRequest('/admin/courses')
      ]);
      setLessons(lRes.data || []);
      setStudents((sRes.data || []).filter(s => s.is_active !== false));
      setInstructors((iRes.data || []).filter(i => i.is_active !== false));
      setCourses(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleLesson = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiRequest('/admin/lessons', {
        method: 'POST',
        body: JSON.stringify({
          title,
          studentId,
          instructorId,
          courseId: courseId || null,
          scheduledStart,
          scheduledEnd,
          meetingUrl
        })
      });
      alert('Lesson scheduled successfully!');
      setShowForm(false);
      setTitle('');
      setStudentId('');
      setInstructorId('');
      setCourseId('');
      setScheduledStart('');
      setScheduledEnd('');
      setMeetingUrl('');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading lessons...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Academy Lessons</h2>
            <p className="text-xs md:text-sm text-slate-600">Schedule individual tutoring sessions.</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Schedule Lesson'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Schedule New Tutoring Session</h3>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">{error}</div>}
            <form onSubmit={handleScheduleLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Lesson Topic / Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Calculus Derivatives Session" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Assigned Student (Active)</label>
                  <select required value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                    <option value="">-- Select Student --</option>
                    {students.map((s) => (
                      <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} ({s.access_code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Assigned Instructor (Active)</label>
                  <select required value={instructorId} onChange={(e) => setInstructorId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                    <option value="">-- Select Instructor --</option>
                    {instructors.map((i) => (
                      <option key={i.instructor_id} value={i.instructor_id}>{i.first_name} {i.last_name} ({i.access_code})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Course / Subject (Optional)</label>
                  <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                    <option value="">-- Select Course --</option>
                    {courses.map((c) => (
                      <option key={c.course_id} value={c.course_id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <input type="url" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://meet.google.com/..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Scheduled Start Time</label>
                  <input type="datetime-local" required value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Scheduled End Time</label>
                  <input type="datetime-local" required value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
              </div>
              <Button type="submit" variant="primary">Schedule Lesson</Button>
            </form>
          </Card>
        )}

        {lessons.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-xs md:text-sm text-slate-500">No lessons scheduled yet. Schedule your first tutoring session above[cite: 16]!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {lessons.map((l) => (
              <Card key={l.lesson_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{l.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">Student: {l.student_first} {l.student_last} | Instructor: {l.instructor_first} {l.instructor_last}</p>
                    <p className="text-xs text-slate-500 mt-1">📅 Start: {new Date(l.scheduled_start).toLocaleString()} | End: {new Date(l.scheduled_end).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 self-start">{l.status || 'SCHEDULED'}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}