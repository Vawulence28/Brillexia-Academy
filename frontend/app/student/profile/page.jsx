'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function StudentProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/student/dashboard')
        .then((res) => {
          setProfile(res.data.profile);
          setPhone(res.data.profile.phone || '');
          setLearningGoals(res.data.profile.learning_goals || '');
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await apiRequest('/student/profile', {
        method: 'PUT',
        body: JSON.stringify({ phone, learningGoals })
      });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">My Profile & Settings</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Manage your contact information and learning goals.</p>

        <Card className="max-w-xl">
          {message && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg">
              {message}
            </div>
          )}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address (Read-only)</label>
              <input type="email" disabled value={profile?.email || ''} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                <input type="text" disabled value={profile?.first_name || ''} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                <input type="text" disabled value={profile?.last_name || ''} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142B55]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Learning Goals</label>
              <textarea value={learningGoals} onChange={(e) => setLearningGoals(e.target.value)} rows="3" placeholder="Describe your academic goals..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142B55]"></textarea>
            </div>
            <Button type="submit" variant="primary" className="w-full sm:w-auto text-xs">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}