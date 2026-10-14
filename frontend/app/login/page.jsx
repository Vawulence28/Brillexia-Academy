'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(identifier, password);
      const role = user?.role?.toUpperCase();

      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'INSTRUCTOR') router.push('/instructor/dashboard');
      else if (role === 'STUDENT') router.push('/student/dashboard');
      else if (role === 'PARENT') router.push('/parent/dashboard');
      else router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center font-bold text-[#142B55] text-2xl mx-auto mb-3 shadow-md">
            💡
          </div>
          <h1 className="text-3xl font-bold text-[#142B55] tracking-tight">BRILLEXIA ACADEMY</h1>
          <p className="text-sm text-slate-600 mt-1">Igniting Brilliance, Shaping Futures</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email OR Access Code
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142B55]"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="put your email or code here"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-3 py-2 pr-16 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142B55]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-slate-500 hover:text-[#142B55] focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}