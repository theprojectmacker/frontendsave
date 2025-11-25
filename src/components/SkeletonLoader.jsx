export default function SkeletonLoader({ type = 'card', count = 1 }) {
  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-header"></div>
            <div className="skeleton-content">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}

        <style>{`
          .skeleton-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .skeleton-card {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
            animation: skeleton-fade 2s infinite ease-in-out;
          }

          .skeleton-header {
            width: 100%;
            height: 120px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
            background-size: 200% 100%;
            border-radius: 8px;
            margin-bottom: 16px;
            animation: skeleton-shimmer 2s infinite;
          }

          .skeleton-content {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .skeleton-line {
            height: 12px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
            background-size: 200% 100%;
            border-radius: 4px;
            animation: skeleton-shimmer 2s infinite;
          }

          .skeleton-line.long {
            width: 100%;
          }

          .skeleton-line:last-child {
            width: 60%;
          }

          @keyframes skeleton-shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          @keyframes skeleton-fade {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="skeleton-table-wrapper">
        <table className="skeleton-table">
          <thead>
            <tr>
              <th><div className="skeleton-cell"></div></th>
              <th><div className="skeleton-cell"></div></th>
              <th><div className="skeleton-cell"></div></th>
              <th><div className="skeleton-cell"></div></th>
              <th><div className="skeleton-cell"></div></th>
              <th><div className="skeleton-cell"></div></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }).map((_, i) => (
              <tr key={i} className="skeleton-row">
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
                <td><div className="skeleton-cell"></div></td>
              </tr>
            ))}
          </tbody>
        </table>

        <style>{`
          .skeleton-table-wrapper {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            overflow: hidden;
          }

          .skeleton-table {
            width: 100%;
            border-collapse: collapse;
          }

          .skeleton-table thead {
            background: rgba(71, 85, 105, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .skeleton-table th {
            padding: 16px;
            text-align: left;
          }

          .skeleton-row {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .skeleton-row td {
            padding: 16px;
          }

          .skeleton-cell {
            height: 16px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
            background-size: 200% 100%;
            border-radius: 4px;
            animation: skeleton-shimmer 2s infinite;
          }

          @keyframes skeleton-shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </div>
    )
  }

  return null
}
