'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import InstructorSidebar from '../../../components/layout/InstructorSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function InstructorReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [lessonId, setLessonId] = useState('');
  const [topicCovered, setTopicCovered] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [activitiesCompleted, setActivitiesCompleted] = useState('');
  const [comprehensionRating, setComprehensionRating] = useState('5');
  const [challengesEncountered, setChallengesEncountered] = useState('');
  const [homeworkAssigned, setHomeworkAssigned] = useState('');
  const [instructorRemarks, setInstructorRemarks] = useState('');

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
      const [repRes, schedRes] = await Promise.all([
        apiRequest('/reports'),
        apiRequest('/instructor/schedule')
      ]);
      setReports(repRes.data);
      setSchedule(schedRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    const selectedLesson = schedule.find(l => l.lesson_id === lessonId);
    if (!selectedLesson) return alert('Please select a valid lesson.');

    try {
      await apiRequest('/reports', {
        method: 'POST',
        body: JSON.stringify({
          lessonId,
          studentId: selectedLesson.student_id,
          topicCovered,
          learningObjectives,
          activitiesCompleted,
          comprehensionRating: parseInt(comprehensionRating),
          challengesEncountered,
          homeworkAssigned,
          instructorRemarks
        })
      });
      alert('Lesson report submitted successfully!');
      setShowForm(false);
      setLessonId('');
      setTopicCovered('');
      setLearningObjectives('');
      setActivitiesCompleted('');
      setChallengesEncountered('');
      setHomeworkAssigned('');
      setInstructorRemarks('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading reports...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <InstructorSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#142B55]">Lesson Reports</h2>
            <p className="text-xs md:text-sm text-slate-600">Submit and review comprehensive reports for tutoring sessions.</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto text-xs py-2">
            {showForm ? 'Cancel' : '+ Submit New Report'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">New Lesson Report</h3>
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Completed Lesson</label>
                <select required value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  <option value="">-- Choose lesson --</option>
                  {schedule.map((l) => (
                    <option key={l.lesson_id} value={l.lesson_id}>{l.title} ({l.student_first} {l.student_last} - {new Date(l.scheduled_start).toLocaleDateString()})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Topic Covered</label>
                <input type="text" required value={topicCovered} onChange={(e) => setTopicCovered(e.target.value)} placeholder="e.g. Quadratic Equations" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Learning Objectives</label>
                  <textarea value={learningObjectives} onChange={(e) => setLearningObjectives(e.target.value)} rows="2" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Activities Completed</label>
                  <textarea value={activitiesCompleted} onChange={(e) => setActivitiesCompleted(e.target.value)} rows="2" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"></textarea>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Student Comprehension Rating (1 to 5)</label>
                <select value={comprehensionRating} onChange={(e) => setComprehensionRating(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Satisfactory</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="1">1 - Struggling</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Challenges Encountered</label>
                  <textarea value={challengesEncountered} onChange={(e) => setChallengesEncountered(e.target.value)} rows="2" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Homework Assigned</label>
                  <textarea value={homeworkAssigned} onChange={(e) => setHomeworkAssigned(e.target.value)} rows="2" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"></textarea>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Instructor Remarks</label>
                <textarea value={instructorRemarks} onChange={(e) => setInstructorRemarks(e.target.value)} rows="2" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full sm:w-auto">Submit Lesson Report</Button>
            </form>
          </Card>
        )}

        {reports.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No lesson reports submitted yet.</p></Card>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <Card key={r.report_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-base md:text-lg">{r.lesson_title} • Topic: {r.topic_covered}</h3>
                    <p className="text-xs text-slate-600 mt-1">Student: {r.student_first} {r.student_last} • Submitted: {new Date(r.created_at).toLocaleString()}</p>
                    <p className="text-xs text-slate-700 mt-3"><strong>Objectives:</strong> {r.learning_objectives || 'N/A'}</p>
                    <p className="text-xs text-slate-700 mt-1"><strong>Homework:</strong> {r.homework_assigned || 'None'}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">Rating: {r.comprehension_rating}/5</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}