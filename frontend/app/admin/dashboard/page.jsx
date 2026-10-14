'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user && user.role === 'ADMIN') {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      const res = await apiRequest('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toUpperCase();
    if (query.startsWith('BAP-STU')) {
      router.push('/admin/students');
    } else if (query.startsWith('BAP-INS')) {
      router.push('/admin/instructors');
    } else if (query.startsWith('BAP-PAR')) {
      router.push('/admin/parents');
    } else {
      router.push('/admin/students');
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading admin dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Admin Academy Dashboard</h2>
            <p className="text-xs md:text-sm text-slate-600">Academy-wide administration command center & operational metrics.</p>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <form onSubmit={handleGlobalSearch} className="flex w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search access code (e.g. BAP-STU-001)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-l-lg bg-white w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-[#142B55]"
              />
              <button type="submit" className="px-3 py-1.5 bg-[#142B55] text-white text-xs rounded-r-lg font-semibold hover:bg-[#1a386b]">
                Search
              </button>
            </form>
          </div>
        </header>

        {/* Action Alerts (Unassigned Students / Unlinked Parents) */}
        {(stats?.unassignedStudentsCount > 0 || stats?.unlinkedParentsCount > 0) && (
          <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.unassignedStudentsCount > 0 && (
              <div 
                onClick={() => router.push('/admin/students')} 
                className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-100 transition"
              >
                <div>
                  <h4 className="text-xs font-bold text-amber-800 uppercase">Attention Required</h4>
                  <p className="text-xs md:text-sm text-amber-900 mt-0.5">
                    <span className="font-bold">{stats.unassignedStudentsCount}</span> active student(s) currently have no assigned instructor.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-200 px-3 py-1 rounded-lg">Assign →</span>
              </div>
            )}
            {stats.unlinkedParentsCount > 0 && (
              <div 
                onClick={() => router.push('/admin/parents')} 
                className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition"
              >
                <div>
                  <h4 className="text-xs font-bold text-blue-800 uppercase">Guardian Link Notice</h4>
                  <p className="text-xs md:text-sm text-blue-900 mt-0.5">
                    <span className="font-bold">{stats.unlinkedParentsCount}</span> parent account(s) are not linked to any student.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-200 px-3 py-1 rounded-lg">Link →</span>
              </div>
            )}
          </div>
        )}

        {/* Quick Action Shortcuts Toolbar */}
        <Card className="mb-6 md:mb-8 bg-gradient-to-r from-[#142B55] to-[#1e3a6e] text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base md:text-lg font-bold">Quick Action Shortcuts</h3>
              <p className="text-xs text-slate-200 mt-1">Instantly provision users, create courses, or schedule academy lessons.</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button variant="secondary" onClick={() => router.push('/admin/students')} className="text-xs bg-white text-[#142B55] hover:bg-slate-100">
                + Register Student
              </Button>
              <Button variant="secondary" onClick={() => router.push('/admin/instructors')} className="text-xs bg-white text-[#142B55] hover:bg-slate-100">
                + Create Instructor
              </Button>
              <Button variant="secondary" onClick={() => router.push('/admin/parents')} className="text-xs bg-white text-[#142B55] hover:bg-slate-100">
                + Link Parent
              </Button>
              <Button variant="secondary" onClick={() => router.push('/admin/lessons')} className="text-xs bg-white text-[#142B55] hover:bg-slate-100">
                + Schedule Lesson
              </Button>
            </div>
          </div>
        </Card>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Students</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{stats?.totalStudents || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Instructors</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{stats?.totalInstructors || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registered Parents</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{stats?.totalParents || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scheduled Lessons</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] mt-2">{stats?.totalLessons || 0}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Courses</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{stats?.totalCourses || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lesson Reports Filed</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#142B55] mt-2">{stats?.totalReports || 0}</p>
          </Card>
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Assignment Grading</h3>
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] mt-2">{stats?.pendingGrading || 0}</p>
          </Card>
        </div>

        {/* Two-Column Section: Upcoming Lessons & Recent Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Upcoming Lessons Feed */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#142B55] text-base">📅 Upcoming Academy Lessons</h3>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold">Next 5</span>
            </div>
            {stats?.upcomingLessons && stats.upcomingLessons.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingLessons.map((l) => (
                  <div key={l.lesson_id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-[#142B55]">{l.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Student: <span className="font-semibold">{l.student_first} {l.student_last}</span> • Instructor: <span className="font-semibold">{l.instructor_first} {l.instructor_last}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">
                        {new Date(l.scheduled_start).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold self-start sm:self-center">
                      {l.course_title || 'General'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No upcoming lessons scheduled.</p>
            )}
          </Card>

          {/* Recent System Audit Logs Stream */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#142B55] text-base">🔒 Recent System Audit Logs</h3>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold">Activity</span>
            </div>
            {stats?.recentAuditLogs && stats.recentAuditLogs.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAuditLogs.map((log) => (
                  <div key={log.audit_id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#142B55] text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                          {log.action}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {log.actor_first ? `${log.actor_first} ${log.actor_last}` : 'System'} ({log.actor_code || 'API'})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">
                        IP: {log.ip_address} • {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No recent audit activity recorded.</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}