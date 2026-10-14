'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ParentSidebar from '../../../components/layout/ParentSidebar';
import { Card } from '../../../components/ui/Card';


export default function ParentProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PARENT')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <ParentSidebar />
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-[#142B55] mb-2">Guardian Profile & Settings</h2>
        <p className="text-xs md:text-sm text-slate-600 mb-6">Manage your account credentials and notification preferences.</p>

        <Card className="max-w-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" disabled value={user?.email || ''} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                <input type="text" disabled value={user?.firstName || ''} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                <input type="text" disabled value={user?.lastName || ''} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}