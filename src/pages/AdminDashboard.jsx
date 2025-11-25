import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import DashboardContent from '../components/DashboardContent'
import { authAPI } from '../utils/api'

export default function AdminDashboard({ onLogout, userEmail, isAdmin }) {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Keep status updated
    const statusInterval = setInterval(() => {
      authAPI.updateStatus().catch(err => {
        console.error('Status update error:', err)
      })
    }, 10000)

    return () => clearInterval(statusInterval)
  }, [])

  const handleLogout = async () => {
    await onLogout()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="header-content">
            <h1 className="page-title">Dashboard</h1>
          </div>

          <div className="header-actions">
            <div className="user-menu">
              <div className="user-avatar">{userEmail.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <p className="user-email">{userEmail}</p>
                {isAdmin && <span className="admin-badge">ADMIN</span>}
              </div>
              <button
                className="logout-button"
                onClick={handleLogout}
                title="Logout"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-content-area">
          <DashboardContent activePage={activePage} />
        </main>
      </div>

      <style>{`
        .dashboard-layout {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dashboard-header {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #e2e8f0;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .header-content {
          flex: 1;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 16px;
          background: rgba(71, 85, 105, 0.3);
          border-radius: 12px;
        }

        .user-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-email {
          font-size: 12px;
          color: #cbd5e0;
          margin: 0 0 4px 0;
          font-weight: 500;
        }

        .admin-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        .logout-button {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
          color: #cbd5e0;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-button:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border-color: #f87171;
        }

        .dashboard-content-area {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          scroll-behavior: smooth;
        }

        .dashboard-content-area::-webkit-scrollbar {
          width: 8px;
        }

        .dashboard-content-area::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .dashboard-content-area::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 4px;
        }

        .dashboard-content-area::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.8);
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .dashboard-layout {
            flex-direction: column;
          }

          .user-info {
            display: none;
          }

          .dashboard-header {
            padding: 16px 20px;
          }

          .dashboard-content-area {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}
