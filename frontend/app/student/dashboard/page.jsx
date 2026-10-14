'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user && user.role === 'STUDENT') {
      apiRequest('/student/dashboard')
        .then((res) => setData(res.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Loading student dashboard...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Welcome back, {data?.profile?.first_name}!</h2>
            <p className="text-xs md:text-sm text-slate-600">Your individual tutoring schedule, assignments, and learning records.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs md:text-sm font-medium text-slate-700 shadow-sm w-full sm:w-auto text-center sm:text-left">
            Grade: <span className="text-[#142B55] font-bold">{data?.profile?.grade_level || 'Enrolled'}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Enrolled Courses</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{data?.enrolledCourses?.length || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Lessons</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{data?.upcomingLessons?.length || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Assignments</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] mt-2">
              {data?.assignments?.filter(a => !a.submission_status || a.submission_status === 'PENDING').length || 0}
            </p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Certificates Earned</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{data?.certificates?.length || 0}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Upcoming Lessons</h3>
            {data?.upcomingLessons?.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-500 py-4 text-center">No upcoming lessons scheduled.</p>
            ) : (
              <div className="space-y-4">
                {data.upcomingLessons.map((lesson) => (
                  <div key={lesson.lesson_id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h4 className="font-semibold text-[#142B55] text-sm md:text-base">{lesson.title}</h4>
                        <span className="text-[10px] md:text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                          {lesson.meeting_provider}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">Instructor: {lesson.instructor_first} {lesson.instructor_last}</p>
                      <p className="text-xs text-slate-500 mt-1">📅 {new Date(lesson.scheduled_start).toLocaleString()}</p>
                    </div>
                    {lesson.meeting_url && (
                      <div className="mt-4">
                        <a 
                          href={lesson.meeting_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-[#D4AF37] text-[#0F172A] font-semibold text-xs px-4 py-2 rounded-lg hover:bg-[#c29f2e] transition text-center w-full sm:w-auto"
                        >
                          Join Live Session →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">My Enrolled Courses</h3>
            {data?.enrolledCourses?.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-500 py-4 text-center">You are not enrolled in any courses yet.</p>
            ) : (
              <div className="space-y-3">
                {data.enrolledCourses.map((course) => (
                  <div key={course.course_id} className="p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm md:text-base">{course.title}</h4>
                      <p className="text-xs text-slate-500">{course.subject} • Code: {course.code}</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-full self-start sm:self-auto">
                      {course.enrolment_status}
                    </span>
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