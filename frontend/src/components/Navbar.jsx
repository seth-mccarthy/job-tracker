import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/applications/new', label: 'New Application', icon: '+' },
  { to: '/analytics', label: 'Analytics', icon: '◎' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col z-50"
      style={{ background: '#1a1a1a', borderRight: '1px solid #2a2a2a' }}>

      {/* Logo */}
      <div className="px-6 py-8">
        <h1 className="font-heading font-bold text-xl tracking-tight"
          style={{ color: '#6EC6E6', fontFamily: 'Syne, sans-serif' }}>
          TRACKR
        </h1>
        <p className="text-xs mt-1" style={{ color: '#444' }}>job application tracker</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg mb-1 text-sm transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(110, 198, 230, 0.1)',
              borderLeft: '2px solid #6EC6E6',
              color: '#6EC6E6',
              fontFamily: 'DM Sans, sans-serif',
            } : { fontFamily: 'DM Sans, sans-serif' }}
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-6 py-6" style={{ borderTop: '1px solid #2a2a2a' }}>
        <p className="text-sm font-medium text-white truncate"
          style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {user?.name}
        </p>
        <p className="text-xs truncate mb-4" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
          {user?.email}
        </p>
        <button
          onClick={handleLogout}
          className="w-full text-xs py-2 rounded-lg transition-all duration-200 hover:text-white"
          style={{
            background: 'transparent',
            border: '1px solid #2a2a2a',
            color: '#555',
            fontFamily: 'DM Sans, sans-serif',
          }}
          onMouseEnter={e => e.target.style.borderColor = '#6EC6E6'}
          onMouseLeave={e => e.target.style.borderColor = '#2a2a2a'}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}