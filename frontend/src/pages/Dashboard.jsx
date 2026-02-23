import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll, remove } from '../api/applications';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import useAuthStore from '../store/authStore';

const statuses = ['ALL', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED'];

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    fetchApplications();
  }, []);

  useEffect(() => {
    let result = applications;
    if (activeFilter !== 'ALL') {
      result = result.filter(a => a.status === activeFilter);
    }
    if (search.trim()) {
      result = result.filter(a =>
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [activeFilter, search, applications]);

  const fetchApplications = async () => {
    try {
      const res = await getAll();
      setApplications(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this application?')) return;
    try {
      await remove(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'INTERVIEW').length,
    offers: applications.filter(a => a.status === 'OFFER').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  };

  return (
    <div className="min-h-screen" style={{ background: '#191919' }}>
      <Navbar />

      {/* Main content */}
      <div className="ml-56 min-h-screen">
        <div
          className="max-w-5xl mx-auto px-8 py-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1"
                style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.2em' }}>
                welcome back
              </p>
              <h2 className="text-3xl font-bold"
                style={{ fontFamily: 'Syne, sans-serif', color: '#fff' }}>
                {user?.name?.split(' ')[0]}'s Dashboard
              </h2>
            </div>
            <button
              onClick={() => navigate('/applications/new')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
              style={{
                background: '#6EC6E6',
                color: '#191919',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 0 20px rgba(110,198,230,0.25)',
              }}
              onMouseEnter={e => {
                e.target.style.background = '#7dd4f0';
                e.target.style.boxShadow = '0 0 30px rgba(110,198,230,0.45)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.target.style.background = '#6EC6E6';
                e.target.style.boxShadow = '0 0 20px rgba(110,198,230,0.25)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              + New Application
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total', value: stats.total, color: '#6EC6E6' },
              { label: 'Interviews', value: stats.interviews, color: '#34d399' },
              { label: 'Offers', value: stats.offers, color: '#fbbf24' },
              { label: 'Rejected', value: stats.rejected, color: '#f87171' },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl p-5 relative overflow-hidden"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${stat.color}44`}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}44, transparent)` }}
                />
                <p className="text-3xl font-bold mb-1"
                  style={{ fontFamily: 'Syne, sans-serif', color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by company or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all duration-300"
              style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#6EC6E6';
                e.target.style.boxShadow = '0 0 15px rgba(110,198,230,0.08)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#2a2a2a';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className="px-4 py-1.5 rounded-full text-xs transition-all duration-200"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    background: activeFilter === status ? '#6EC6E6' : '#1a1a1a',
                    color: activeFilter === status ? '#191919' : '#555',
                    border: activeFilter === status ? '1px solid #6EC6E6' : '1px solid #2a2a2a',
                    fontWeight: activeFilter === status ? 600 : 400,
                  }}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Applications list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border border-current border-t-transparent rounded-full"
                style={{ color: '#6EC6E6', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📋</p>
              <p className="text-sm" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
                {applications.length === 0 ? 'No applications yet. Add your first one!' : 'No results match your filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app, i) => (
                <div
                  key={app.id}
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className="rounded-xl px-6 py-5 flex items-center justify-between cursor-pointer group relative overflow-hidden"
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    transition: 'all 0.2s ease',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: `${i * 0.05}s`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(110,198,230,0.2)';
                    e.currentTarget.style.background = '#141414';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#2a2a2a';
                    e.currentTarget.style.background = '#1a1a1a';
                  }}
                >
                  {/* Left accent line on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                    style={{
                      background: '#6EC6E6',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                    ref={el => {
                      if (el) {
                        el.parentElement.addEventListener('mouseenter', () => el.style.opacity = '1');
                        el.parentElement.addEventListener('mouseleave', () => el.style.opacity = '0');
                      }
                    }}
                  />

                  <div className="flex items-center gap-5">
                    {/* Company initial avatar */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(110,198,230,0.08)', border: '1px solid rgba(110,198,230,0.15)' }}>
                      <span className="text-sm font-bold"
                        style={{ color: '#6EC6E6', fontFamily: 'Syne, sans-serif' }}>
                        {app.company.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="font-semibold text-white text-sm"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        {app.company}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                        {app.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="text-xs hidden sm:block" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
                      {formatDate(app.appliedAt)}
                    </p>
                    <StatusBadge status={app.status} />
                    <button
                      onClick={(e) => handleDelete(e, app.id)}
                      className="text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{
                        color: '#f87171',
                        border: '1px solid rgba(248,113,113,0.2)',
                        background: 'rgba(248,113,113,0.05)',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                      onMouseEnter={e => e.target.style.background = 'rgba(248,113,113,0.15)'}
                      onMouseLeave={e => e.target.style.background = 'rgba(248,113,113,0.05)'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #333; }
      `}</style>
    </div>
  );
}