import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const { loginWithData } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', nationalId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [successVoterId, setSuccessVoterId] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must agree to continue';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      const { data } = await authAPI.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        nationalId: form.nationalId.trim() || undefined,
      });

      // Auto-login with returned token
      loginWithData(data.data.user as any, data.data.token);
      setSuccessVoterId(data.data.user.voterId);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (successVoterId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30 flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center animate-slide-up">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#d1fae5"/>
              <path d="M10 16l4 4 8-8" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-display text-2xl text-slate-800 mb-2">Registration Complete!</h2>
          <p className="text-slate-500 text-sm mb-6">Your identity has been verified on the blockchain.</p>

          <div className="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl p-6 border border-primary-100 mb-6">
            <p className="text-xs text-slate-500 font-body mb-2">Your Voter ID</p>
            <div className="font-mono text-3xl font-bold text-primary-600 tracking-wider">{successVoterId}</div>
            <p className="text-xs text-slate-400 mt-2">Save this ID — you'll need it to log in</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/vote')}
              className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Start Voting
            </button>
            <button
              onClick={() => navigate('/results')}
              className="flex-1 py-3 bg-slate-50 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30 flex items-center justify-center px-6 pt-20 pb-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
            <span className="text-primary-500">🛡️</span>
            <span className="text-xs font-medium text-slate-600">Secure Registration</span>
          </div>
          <h1 className="font-display text-3xl text-slate-800">Create your voter account</h1>
          <p className="text-slate-500 text-sm mt-2">Your identity is encrypted and never shared.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.password ? 'border-red-300' : 'border-slate-200'}`}
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Confirm</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'}`}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* National ID */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">National ID / Passport <span className="text-slate-400">(optional)</span></label>
              <input
                type="text"
                value={form.nationalId}
                onChange={e => setForm({ ...form, nationalId: e.target.value })}
                placeholder="ID123456789"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-body font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary-500"
              />
              <span className="text-sm text-slate-500">
                I confirm my identity is accurate and I agree to the{' '}
                <span className="text-primary-500 underline">terms of participation</span>.
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500">{errors.agreed}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Sign Up & Verify Identity'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
