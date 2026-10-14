'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import ParentSidebar from '../../../components/layout/ParentSidebar';
import { Card } from '../../../components/ui/Card';

export default function ParentResultsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PARENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/parent/children')
        .then((res) => {
          setChildren(res.data);
          if (res.data.length > 0) setSelectedChildId(res.data[0].student_id);
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedChildId) {
      setLoading(true);
      apiRequest(`/parent/children/${selectedChildId}/results`)
        .then((res) => setResults(res.data))
        .finally(() => setLoading(false));
    }
  }, [selectedChildId]);

  if (authLoading || (loading && children.length === 0)) return <div className="min-h-screen flex items-center justify-center">Loading results...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <ParentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Released Results & Grades</h2>
            <p className="text-xs md:text-sm text-slate-600">Assignment scores and instructor feedback.</p>
          </div>
          {children.length > 0 && (
            <select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-bold text-[#142B55] w-full sm:w-auto">
              {children.map(c => <option key={c.student_id} value={c.student_id}>{c.first_name} {c.last_name}</option>)}
            </select>
          )}
        </header>

        {results.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No graded results released yet.</p></Card>
        ) : (
          <div className="space-y-4">
            {results.map((res) => (
              <Card key={res.assignment_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{res.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Course: {res.course_title}</p>
                    {res.instructor_feedback && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-3">
                        <strong>Feedback:</strong> {res.instructor_feedback}
                      </p>
                    )}
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-xs text-slate-500 sm:hidden">Score:</span>
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-[#142B55]">{res.grade}</span>
                      <span className="text-xs text-slate-500 block sm:inline"> / 100</span>
                    </div>
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