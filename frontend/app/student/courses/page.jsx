'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';

export default function StudentCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/student/courses')
        .then((res) => setCourses(res.data || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading courses...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-6">My Enrolled Courses</h2>
        
        {courses.length === 0 ? (
          <Card>
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xl mx-auto mb-3">
                📚
              </div>
              <h3 className="font-bold text-[#142B55] text-base">No Enrolled Courses Yet</h3>
              <p className="text-xs text-slate-500 mt-1">You are not currently enrolled in any courses. Please contact your academy administrator to assign your courses.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <Card key={c.course_id}>
                <h3 className="font-bold text-[#142B55] text-base md:text-lg">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Subject: {c.subject} • Code: {c.code}</p>
                <p className="text-xs md:text-sm text-slate-700 mt-3">{c.description}</p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}