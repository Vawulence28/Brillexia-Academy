'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import InstructorSidebar from '../../../components/layout/InstructorSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function InstructorGradingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'INSTRUCTOR')) {
      router.push('/login');
      return;
    }
    if (user) {
      loadSubmissions();
    }
  }, [user, authLoading, router]);

  const loadSubmissions = async () => {
    try {
      const res = await apiRequest('/instructor/dashboard');
      setSubmissions(res.data.pendingGrading || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (e, submissionId) => {
    e.preventDefault();
    try {
      await apiRequest(`/instructor/grading/${submissionId}`, {
        method: 'PUT',
        body: JSON.stringify({ grade: parseFloat(grade), instructorFeedback: feedback })
      });
      alert('Grade and feedback submitted successfully!');
      setGradingId(null);
      setGrade('');
      setFeedback('');
      loadSubmissions();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading submissions...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <InstructorSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Student Submissions & Grading</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Review submitted assignments and provide marks and feedback.</p>

        {submissions.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No pending submissions to grade.</p></Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <Card key={sub.submission_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{sub.assignment_title}</h3>
                    <p className="text-xs text-slate-600 mt-1">Student: {sub.student_first} {sub.student_last} • Submitted: {new Date(sub.submitted_at).toLocaleString()}</p>
                    {sub.student_comment && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-3">
                        <strong>Student Comment:</strong> {sub.student_comment}
                      </p>
                    )}
                    {sub.file_url && (
                      <div className="mt-3">
                        <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">
                          View Submission File / Link ↗
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 self-start sm:self-auto">Pending Grade</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  {gradingId === sub.submission_id ? (
                    <form onSubmit={(e) => handleGradeSubmit(e, sub.submission_id)} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Grade (0 - 100)</label>
                          <input type="number" required min="0" max="100" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Instructor Feedback</label>
                        <textarea rows="2" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide constructive feedback..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"></textarea>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit" variant="primary" className="w-full sm:w-auto">Save Grade</Button>
                        <Button type="button" variant="outline" onClick={() => setGradingId(null)} className="w-full sm:w-auto">Cancel</Button>
                      </div>
                    </form>
                  ) : (
                    <Button variant="outline" onClick={() => setGradingId(sub.submission_id)} className="w-full sm:w-auto text-xs">Grade Assignment</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}