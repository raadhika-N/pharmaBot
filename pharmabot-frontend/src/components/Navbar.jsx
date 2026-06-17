import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dark-600 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">PharmaBot</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm rounded-lg transition-colors"
            >
              Upload
            </Link>
            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-4 h-4" />
              <span className="text-sm">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm rounded-lg transition-colors"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;