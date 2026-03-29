import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const { loginWithData } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await authAPI.login({
        email: form.email.trim(),
        password: form.password,
      });

      loginWithData(data.data.user as any, data.data.token);
      navigate('/vote');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30 flex items-center justify-center px-6 pt-20">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C9.79 2 8 3.79 8 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2h-2V6c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2v2h-4V6c0-1.1.9-2 2-2zm0 9a2 2 0 110 4 2 2 0 010-4z" fill="white"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl text-slate-800">Log In to Vote</h1>
          <p className="text-slate-500 text-sm mt-2">Securely access your voter account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 border border-red-100">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <Link to="/register" className="text-primary-500 hover:underline">Create account</Link>
              <span className="text-slate-400">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : 'Log In Securely'}
            </button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <p className="text-center text-xs text-slate-400">
              Social login connects to your registered account
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-medium hover:underline">Register free</Link>
        </p>
      </div>
    </div>
  );
}
