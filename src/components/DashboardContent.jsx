import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Jobs from './pages/Jobs'
import JobsAnalytics from './pages/JobsAnalytics'

export default function DashboardContent({ activePage }) {
  switch (activePage) {
    case 'analytics':
      return <Analytics />
    case 'jobs-analytics':
      return <JobsAnalytics />
    case 'users':
      return <Users />
    case 'jobs':
      return <Jobs />
    case 'settings':
      return <Settings />
    case 'dashboard':
    default:
      return <Dashboard />
  }
}
