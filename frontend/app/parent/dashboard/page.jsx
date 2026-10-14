'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import ParentSidebar from '../../../components/layout/ParentSidebar';
import { Card } from '../../../components/ui/Card';

export default function ParentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PARENT')) {
      router.push('/login');
      return;
    }
    if (user && user.role === 'PARENT') {
      apiRequest('/parent/children')
        .then((res) => {
          setChildren(res.data);
          if (res.data.length > 0) {
            setSelectedChildId(res.data[0].student_id);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedChildId) {
      setLoading(true);
      apiRequest(`/parent/children/${selectedChildId}/dashboard`)
        .then((res) => setChildData(res.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [selectedChildId]);

  if (authLoading || (loading && children.length === 0)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading parent portal...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <ParentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Parent Guardian Portal</h2>
            <p className="text-xs md:text-sm text-slate-600">Securely monitoring your linked children's academic progress.</p>
          </div>
          {children.length > 0 && (
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center space-x-3 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Child:</span>
              <select 
                value={selectedChildId} 
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="text-xs md:text-sm font-bold text-[#142B55] bg-transparent focus:outline-none cursor-pointer w-full md:w-auto"
              >
                {children.map((c) => (
                  <option key={c.student_id} value={c.student_id}>
                    {c.first_name} {c.last_name} (Grade {c.grade_level || 'N/A'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        {children.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No children linked to your guardian account.</p></Card>
        ) : childData && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <Card>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Enrolled Courses</h3>
                <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{childData.enrolledCourses?.length || 0}</p>
              </Card>
              <Card>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Lessons</h3>
                <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] mt-2">{childData.upcomingLessons?.length || 0}</p>
              </Card>
              <Card>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assignments Graded</h3>
                <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">
                  {childData.assignments?.filter(a => a.grade !== null).length || 0} / {childData.assignments?.length || 0}
                </p>
              </Card>
              <Card>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Certificates Earned</h3>
                <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{childData.certificates?.length || 0}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Upcoming Sessions</h3>
                {childData.upcomingLessons?.length === 0 ? (
                  <p className="text-xs md:text-sm text-slate-500 py-4 text-center">No upcoming lessons scheduled.</p>
                ) : (
                  <div className="space-y-3">
                    {childData.upcomingLessons.map((l) => (
                      <div key={l.lesson_id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                        <h4 className="font-semibold text-[#142B55] text-sm md:text-base">{l.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">Instructor: {l.instructor_first} {l.instructor_last}</p>
                        <p className="text-xs text-slate-500 mt-1">📅 {new Date(l.scheduled_start).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Recent Instructor Lesson Reports</h3>
                {childData.lessonReports?.length === 0 ? (
                  <p className="text-xs md:text-sm text-slate-500 py-4 text-center">No lesson reports available yet.</p>
                ) : (
                  <div className="space-y-3">
                    {childData.lessonReports.map((r) => (
                      <div key={r.report_id} className="p-4 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-[#142B55] text-sm md:text-base">{r.lesson_title} • Topic: {r.topic_covered}</h4>
                        <p className="text-xs text-slate-600 mt-1">Instructor: {r.instructor_first} {r.instructor_last} • Comprehension: {r.comprehension_rating}/5</p>
                        {r.homework_assigned && (
                          <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-200 mt-2">
                            <strong>Homework:</strong> {r.homework_assigned}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}