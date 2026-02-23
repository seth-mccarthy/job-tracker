import { useState, useEffect } from 'react';
import { getAnalytics, getAll } from '../api/applications';
import Navbar from '../components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const statusColors = {
  APPLIED: '#6EC6E6',
  PHONE_SCREEN: '#a78bfa',
  INTERVIEW: '#34d399',
  OFFER: '#fbbf24',
  REJECTED: '#f87171',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-lg"
        style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif' }}>
        <p className="text-xs" style={{ color: '#aaa' }}>{payload[0].name || payload[0].payload.name}</p>
        <p className="text-lg font-bold" style={{ color: '#6EC6E6', fontFamily: 'Syne, sans-serif' }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, appsRes] = await Promise.all([getAnalytics(), getAll()]);
      setAnalytics(analyticsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const barData = analytics ? Object.entries(analytics).map(([key, value]) => ({
    name: key.replace('_', ' '),
    value,
    fill: statusColors[key],
  })) : [];

  const pieData = barData.filter(d => d.value > 0);

  const total = applications.length;
  const interviewRate = total > 0
    ? Math.round(((analytics?.INTERVIEW || 0) + (analytics?.OFFER || 0)) / total * 100)
    : 0;
  const offerRate = total > 0
    ? Math.round((analytics?.OFFER || 0) / total * 100)
    : 0;
  const activeApplications = total - (analytics?.REJECTED || 0) - (analytics?.OFFER || 0);

  return (
    <div className="min-h-screen" style={{ background: '#0f0f0f' }}>
      <Navbar />

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
          <div className="mb-10">
            <p className="text-xs tracking-widest uppercase mb-1"
              style={{ color: '#444', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.2em' }}>
              insights
            </p>
            <h2 className="text-3xl font-bold"
              style={{ fontFamily: 'Syne, sans-serif', color: '#fff' }}>
              Analytics
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border border-current border-t-transparent rounded-full"
                style={{ color: '#6EC6E6', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* Key metrics */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Applied', value: total, color: '#6EC6E6', suffix: '' },
                  { label: 'Active', value: activeApplications, color: '#34d399', suffix: '' },
                  { label: 'Interview Rate', value: interviewRate, color: '#a78bfa', suffix: '%' },
                  { label: 'Offer Rate', value: offerRate, color: '#fbbf24', suffix: '%' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl p-5 relative overflow-hidden"
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
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="text-xs" style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-2 gap-6 mb-8">

                {/* Bar chart */}
                <div className="rounded-2xl p-6 relative"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <div className="absolute top-0 left-8 right-8 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(110,198,230,0.3), transparent)' }}
                  />
                  <p className="text-sm font-semibold mb-6"
                    style={{ fontFamily: 'Syne, sans-serif', color: '#fff' }}>
                    Applications by Status
                  </p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} barSize={28}>
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#444', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#444', fontSize: 10, fontFamily: 'DM Sans, sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className="rounded-2xl p-6 relative"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <div className="absolute top-0 left-8 right-8 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(110,198,230,0.3), transparent)' }}
                  />
                  <p className="text-sm font-semibold mb-6"
                    style={{ fontFamily: 'Syne, sans-serif', color: '#fff' }}>
                    Status Breakdown
                  </p>
                  {pieData.length === 0 ? (
                    <div className="flex items-center justify-center h-52">
                      <p className="text-sm" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
                        No data yet
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          formatter={(value) => (
                            <span style={{ color: '#555', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Status breakdown table */}
              <div className="rounded-2xl p-6 relative"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <div className="absolute top-0 left-8 right-8 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(110,198,230,0.3), transparent)' }}
                />
                <p className="text-sm font-semibold mb-6"
                  style={{ fontFamily: 'Syne, sans-serif', color: '#fff' }}>
                  Detailed Breakdown
                </p>
                <div className="space-y-3">
                  {barData.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <p className="text-xs w-28 flex-shrink-0"
                        style={{ color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
                        {item.name}
                      </p>
                      <div className="flex-1 rounded-full overflow-hidden"
                        style={{ background: '#2a2a2a', height: '6px' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: total > 0 ? `${(item.value / total) * 100}%` : '0%',
                            background: item.fill,
                            boxShadow: `0 0 8px ${item.fill}66`,
                          }}
                        />
                      </div>
                      <p className="text-xs w-6 text-right"
                        style={{ color: item.fill, fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}