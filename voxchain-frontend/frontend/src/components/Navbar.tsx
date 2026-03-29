import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

export default function Navbar() {
  const { isLoggedIn, voter, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/vote', label: 'Vote' },
    { to: '/results', label: 'Results' },
    { to: '/verify', label: 'Verify' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-md">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <span className="font-display text-xl text-slate-800 tracking-tight">VoxChain</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                location.pathname === link.to
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                  {voter?.name?.[0] || 'V'}
                </div>
                <span className="text-sm text-slate-600 font-body font-medium">{voter?.voterId}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-body font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-body font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-violet-600 text-white text-sm font-body font-semibold rounded-lg shadow-sm hover:shadow-md hover:from-primary-600 hover:to-violet-700 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
