import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Upload,
  LogOut,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Upload' },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: '260px',
        background: '#111118',
        borderRight: '1px solid #22222f',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px', borderBottom: '1px solid #22222f' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Activity style={{ width: '18px', height: '18px', color: '#fff' }} />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '17px' }}>PharmaBot</span>
        </Link>
      </div>

      {/* User info */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #22222f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              flexShrink: 0
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s',
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: active ? '#818cf8' : '#94a3b8',
                border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent'
              }}
            >
              <Icon style={{ width: '17px', height: '17px', flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid #22222f' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut style={{ width: '17px', height: '17px', flexShrink: 0 }} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;