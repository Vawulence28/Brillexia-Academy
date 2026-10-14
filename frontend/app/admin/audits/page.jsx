'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';

export default function AdminAuditsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/admin/audit-logs')
        .then((res) => setLogs(res.data))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading audit logs...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Immutable Audit Logs</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Security event tracking and administrative action history.</p>

        {logs.length === 0 ? (
          <Card><p className="text-sm text-slate-500 text-center py-6">No audit logs recorded yet.</p></Card>
        ) : (
          <div className="space-y-4">
            {logs.map((l) => (
              <Card key={l.audit_id}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-[#142B55] text-sm font-mono">ACTION: {l.action}</h3>
                    <p className="text-xs text-slate-600 mt-1">Actor: {l.actor_email || 'System'} • IP: {l.ip_address}</p>
                    <p className="text-xs text-slate-500 mt-1">📅 {new Date(l.created_at).toLocaleString()}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 self-start">Audit Record</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}