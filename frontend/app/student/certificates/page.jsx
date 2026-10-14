'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../services/api';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { Card } from '../../../components/ui/Card';

export default function StudentCertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      router.push('/login');
      return;
    }
    if (user) {
      apiRequest('/student/certificates')
        .then((res) => setCertificates(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Loading certificates...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Certificates & Achievements[cite: 19]</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Officially issued course completion credentials[cite: 19].</p>

        {certificates.length === 0 ? (
          <Card><p className="text-xs md:text-sm text-slate-500 text-center py-6">No certificates earned yet. Complete your courses to earn official credentials[cite: 19].</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.certificate_id} className="border-t-4 border-t-[#D4AF37]">
                <h3 className="font-bold text-[#142B55] text-base md:text-xl">{cert.course_title}[cite: 19]</h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">Certificate Code: {cert.certificate_code}[cite: 19]</p>
                <p className="text-xs text-slate-600 mt-3">Issued On: {new Date(cert.issued_at).toLocaleDateString()}[cite: 19]</p>
                {cert.pdf_url && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#142B55] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1d3d75] transition text-center w-full sm:w-auto">
                      Download PDF Certificate →
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}