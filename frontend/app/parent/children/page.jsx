'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import ParentSidebar from '../../../components/layout/ParentSidebar';
import { Card } from '../../../components/ui/Card';

export default function ParentChildrenPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PARENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/parent/children')
        .then((res) => setChildren(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading linked children...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <ParentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">My Linked Children</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Verified guardian relationships and student profiles.</p>

        {children.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No children currently linked to your guardian account.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children.map((c) => (
              <Card key={c.student_id} className="border-t-4 border-t-[#142B55]">
                <h3 className="font-bold text-[#142B55] text-lg md:text-xl">{c.first_name} {c.last_name}</h3>
                <p className="text-xs text-slate-500 mt-1">Email: {c.email} • Grade: {c.grade_level || 'N/A'}</p>
                {c.learning_goals && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-4">
                    <strong>Learning Goals:</strong> {c.learning_goals}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}