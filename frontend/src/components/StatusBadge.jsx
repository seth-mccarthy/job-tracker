const statusConfig = {
  APPLIED: { label: 'Applied', color: '#6EC6E6', bg: 'rgba(110, 198, 230, 0.1)' },
  PHONE_SCREEN: { label: 'Phone Screen', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
  INTERVIEW: { label: 'Interview', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  OFFER: { label: 'Offer', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  REJECTED: { label: 'Rejected', color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.APPLIED;
  return (
    <span
      className="text-xs px-3 py-1 rounded-full font-medium"
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}33`,
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {config.label}
    </span>
  );
}