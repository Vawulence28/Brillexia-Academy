'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function StudentAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    apiRequest('/student/dashboard').then((res) => {
      setAssignments(res.data.assignments || []);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/student/submit-assignment', {
        method: 'POST',
        body: JSON.stringify({ assignmentId: selectedAssignment, fileUrl, notes })
      });
      alert('Assignment workings uploaded successfully for instructor review!');
      setSelectedAssignment(null);
      setFileUrl('');
      setNotes('');
      const res = await apiRequest('/student/dashboard');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading assignments...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-6">My Assignments</h2>
        
        {assignments.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-slate-500 text-xs md:text-sm">No assignments found for your enrolled courses yet.</p>
              <p className="text-[11px] md:text-xs text-slate-400 mt-1">Check back later when your instructor assigns coursework.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <Card key={a.assignment_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-[#142B55]">{a.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{a.description}</p>
                    <p className="text-xs text-slate-500 mt-2">Due: {new Date(a.due_date).toLocaleDateString()}</p>
                    {a.grade !== null && a.grade !== undefined && (
                      <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded">
                        Grade: {a.grade} | Instructor Feedback: {a.feedback || 'None'}
                      </div>
                    )}
                    {a.submission_id && (
                      <div className="mt-2 text-xs font-semibold text-blue-700 bg-blue-50 p-2 rounded">
                        Status: Submitted on {new Date(a.submitted_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <Button variant="primary" onClick={() => setSelectedAssignment(a.assignment_id)} className="w-full sm:w-auto text-xs py-2">
                    📷 Snap & Upload Workings
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full bg-white">
              <h3 className="text-base md:text-lg font-bold text-[#142B55] mb-4">Upload Assignment Snapshot</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Image / Attachment URL (Snap photo of workings)</label>
                  <input 
                    type="url" 
                    required 
                    placeholder="https://imgur.com/... or uploaded image link" 
                    value={fileUrl} 
                    onChange={(e) => setFileUrl(e.target.value)} 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Notes to Instructor</label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Explain your working or ask a question..." 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" variant="primary" className="w-full sm:w-auto text-xs">Submit Workings</Button>
                  <Button type="button" variant="secondary" onClick={() => setSelectedAssignment(null)} className="w-full sm:w-auto text-xs">Cancel</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}