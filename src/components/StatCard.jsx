export default function StatCard({ label, value, change, isPositive, icon, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon-bg bg-gradient-to-br ${color || 'from-purple-500 to-purple-600'}`}>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-content">
        <h3 className="stat-label">{label}</h3>
        <p className="stat-value">{value}</p>
        <div className={`stat-badge ${isPositive ? 'positive' : 'negative'}`}>
          <span className="badge-arrow">{isPositive ? '↑' : '↓'}</span>
          <span>{change}</span>
        </div>
      </div>

      <style>{`
        .stat-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
          pointer-events: none;
        }

        .stat-card:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
        }

        .stat-icon-bg {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
        }

        .badge-arrow {
          display: inline-flex;
        }

        .stat-badge.positive {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
        }

        .stat-badge.negative {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }

        @media (max-width: 640px) {
          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}
