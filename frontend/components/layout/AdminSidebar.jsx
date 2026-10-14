'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Students', href: '/admin/students', icon: '🎓' },
    { label: 'Instructors', href: '/admin/instructors', icon: '👨‍🏫' },
    { label: 'Parents & Guardians', href: '/admin/parents', icon: '👨‍👩‍👧' },
    { label: 'Courses & Subjects', href: '/admin/courses', icon: '📚' },
    { label: 'Lessons', href: '/admin/lessons', icon: '📅' },
    { label: 'Session Duration Audit', href: '/admin/duration', icon: '⏱️' },
    { label: 'Certificates', href: '/admin/certificates', icon: '📜' },
    { label: 'System Settings', href: '/admin/settings', icon: '⚙️' },
    { label: 'Audit Logs', href: '/admin/audits', icon: '🔒' },
  ];

  return (
    <>
      {/* Mobile Top Header Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#142B55] text-white px-4 flex justify-between items-center z-40 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-[#D4AF37]">BRILLEXIA</span>
          <span className="text-xs text-slate-300">| Admin</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="px-3 py-1.5 bg-[#1d3d75] rounded-lg text-xs font-semibold text-white hover:bg-[#254b8c]"
        >
          {mobileOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        bg-[#142B55] text-white flex flex-col transition-all duration-300 ease-in-out min-h-screen
        ${collapsed ? 'md:w-20' : 'md:w-64'}
        ${mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand & Collapse Button */}
        <div className="h-16 px-4 border-b border-[#1d3d75] flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-[#D4AF37] tracking-wider">BRILLEXIA</h1>
              <p className="text-[10px] text-slate-300">Admin Portal</p>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden md:flex p-1.5 rounded-lg bg-[#1d3d75] hover:bg-[#254b8c] text-xs text-slate-200 items-center justify-center w-8 h-8"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-[#1d3d75] text-[#FACC15]' : 'text-slate-200 hover:bg-[#1d3d75]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-base">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-[#1d3d75]">
          {!collapsed && (
            <div className="text-xs text-slate-300 mb-2 truncate">
              Signed in: <span className="font-semibold text-white">{user?.firstName} {user?.lastName}</span>
            </div>
          )}
          <Button 
            variant="danger" 
            className="w-full text-xs py-2" 
            onClick={() => { logout(); router.push('/login'); }}
          >
            {collapsed ? '🚪' : 'Sign Out'}
          </Button>
        </div>
      </aside>
    </>
  );
}