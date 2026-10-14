'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import { Card } from '../../../components/ui/Card';

export default function AdminCertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    if (user) {
      // In a full implementation, add GET /admin/certificates endpoint or fetch via students[cite: 16]
      setLoading(false);
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading certificates...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Certificate Administration</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Issue and audit official course completion credentials.</p>

        <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">Certificates issuance managed via administrative action workflows.</p></Card>
      </main>
    </div>
  );
}