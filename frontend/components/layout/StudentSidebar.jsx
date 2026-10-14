'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export default function StudentSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'My Courses', href: '/student/courses' },
    { label: 'Lessons', href: '/student/lessons' },
    { label: 'Assignments', href: '/student/assignments' },
    { label: 'Attendance', href: '/student/attendance' },
    { label: 'Results & Progress', href: '/student/results' },
    { label: 'Certificates', href: '/student/certificates' },
    { label: 'Profile', href: '/student/profile' },
  ];

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#142B55] text-white flex items-center justify-between px-4 z-50 border-b border-[#1d3d75]">
        <div>
          <h1 className="text-base font-bold text-[#D4AF37] tracking-wider">BRILLEXIA</h1>
          <p className="text-[10px] text-slate-300">Student Portal</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white bg-[#1d3d75] rounded-lg focus:outline-none"
        >
          {isOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#142B55] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-[#1d3d75] hidden md:block">
          <h1 className="text-lg font-bold text-[#D4AF37] tracking-wider">BRILLEXIA</h1>
          <p className="text-xs text-slate-300 mt-1">Student Portal</p>
        </div>
        <div className="p-4 border-b border-[#1d3d75] md:hidden flex justify-between items-center mt-16">
          <span className="text-xs font-semibold text-slate-300">Navigation Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-[#1d3d75] text-[#FACC15]' : 'text-slate-200 hover:bg-[#1d3d75]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#1d3d75]">
          <div className="text-xs text-slate-300 mb-2 truncate">Signed in as: <span className="font-semibold text-white">{user?.firstName} {user?.lastName}</span></div>
          <Button variant="danger" className="w-full text-xs py-2" onClick={() => { logout(); router.push('/login'); }}>
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}