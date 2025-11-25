import { useState, useEffect } from 'react'
import StatCard from '../StatCard'
import ChartCard from '../ChartCard'
import SkeletonLoader from '../SkeletonLoader'
import { dashboardAPI } from '../../utils/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [chartsData, setChartsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats()
        if (data.success) {
          setStats(data.stats)
          setChartsData(data.charts)
        } else {
          setError(data.error || 'Failed to fetch stats')
        }
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="stats-grid">
          <SkeletonLoader type="card" count={4} />
        </div>
        <div className="charts-grid">
          <SkeletonLoader type="card" count={2} />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>
  }

  return (
    <div className="dashboard-page">
      <div className="stats-grid">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers || 0}
          change={`+${stats?.recentUsers || 0} this week`}
          isPositive={true}
          icon="👥"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          label="Online Users"
          value={stats?.onlineUsers || 0}
          change={`${stats?.offlineUsers || 0} offline`}
          isPositive={true}
          icon="🟢"
          color="from-green-500 to-green-600"
        />
        <StatCard
          label="Total Messages"
          value={stats?.totalMessages || 0}
          change={`+${stats?.recentMessages || 0} today`}
          isPositive={true}
          icon="💬"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          label="Conversations"
          value={stats?.totalConversations || 0}
          change="Active chats"
          isPositive={true}
          icon="💭"
          color="from-pink-500 to-pink-600"
        />
      </div>

      <div className="charts-grid">
        {chartsData && (
          <>
            <ChartCard
              title="User Growth"
              subtitle="Last 30 days"
              type="area"
              fullWidth={true}
              data={chartsData.userGrowth}
            />
            <ChartCard
              title="Message Activity"
              subtitle="Last 30 days"
              type="line"
              fullWidth={true}
              data={chartsData.messageActivity}
            />
          </>
        )}
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .loading-state,
        .error-state {
          padding: 40px;
          text-align: center;
          color: #94a3b8;
          font-size: 16px;
        }

        .error-state {
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
