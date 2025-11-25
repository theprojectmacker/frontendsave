import { useState, useEffect } from 'react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { jobsAPI } from '../../utils/api'
import LoadingSpinner from '../LoadingSpinner'

export default function JobsAnalytics() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [jobAnalytics, setJobAnalytics] = useState(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (selectedJobId) {
      fetchJobAnalytics(selectedJobId)
    }
  }, [selectedJobId])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await jobsAPI.getAdminJobs()
      if (data.success && data.jobs.length > 0) {
        setJobs(data.jobs)
        setSelectedJobId(data.jobs[0].id)
      } else {
        setError('No jobs found. Please create a job inquiry first.')
      }
    } catch (err) {
      setError('Failed to load jobs')
      console.error('Jobs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobAnalytics = async (jobId) => {
    try {
      setLoadingAnalytics(true)
      const data = await jobsAPI.getJobAnalytics(jobId)
      if (data.success) {
        setJobAnalytics(data.analytics)
        setError('')
      } else {
        setError(data.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError('Failed to load analytics')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const selectedJob = jobs.find(j => j.id === selectedJobId)

  if (loading) {
    return (
      <div className="jobs-analytics-container">
        <div className="analytics-header">
          <h2>Job Inquiries Analytics</h2>
        </div>
        <LoadingSpinner message="Loading analytics..." />
      </div>
    )
  }

  if (error && jobs.length === 0) {
    return (
      <div className="jobs-analytics-container">
        <div className="analytics-header">
          <h2>Job Inquiries Analytics</h2>
        </div>
        <div className="analytics-error">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="jobs-analytics-container">
      <div className="analytics-header">
        <h2>Job Inquiries Analytics</h2>
        <p className="header-subtitle">Track clicks and applications for your job postings</p>
      </div>

      {error && error !== 'No jobs found' && (
        <div className="analytics-error">{error}</div>
      )}

      <div className="job-selector">
        <label className="selector-label">Select Job:</label>
        <select
          value={selectedJobId || ''}
          onChange={(e) => setSelectedJobId(parseInt(e.target.value))}
          className="selector-dropdown"
        >
          {jobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title} - {job.company_name || 'Company'} ({job.total_applications || 0} applications)
            </option>
          ))}
        </select>
      </div>

      {selectedJob && jobAnalytics && !loadingAnalytics && (
        <>
          <div className="analytics-overview">
            <div className="overview-card">
              <div className="overview-label">Total Clicks</div>
              <div className="overview-value">{jobAnalytics.totalClicks || 0}</div>
              <div className="overview-trend">Job views</div>
            </div>

            <div className="overview-card">
              <div className="overview-label">Total Applications</div>
              <div className="overview-value">{jobAnalytics.totalApplications || 0}</div>
              <div className="overview-trend">Submissions received</div>
            </div>

            <div className="overview-card">
              <div className="overview-label">Conversion Rate</div>
              <div className="overview-value">
                {jobAnalytics.totalClicks > 0
                  ? ((jobAnalytics.totalApplications / jobAnalytics.totalClicks) * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="overview-trend">Applications per click</div>
            </div>

            <div className="overview-card">
              <div className="overview-label">Status</div>
              <div className="status-indicator active">Active</div>
              <div className="overview-trend">Accepting applications</div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3 className="chart-title">Clicks Over Time (Last 30 Days)</h3>
              {jobAnalytics.clicksTrend && jobAnalytics.clicksTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={jobAnalytics.clicksTrend}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="#667eea"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorClicks)"
                      name="Clicks"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No click data yet</div>
              )}
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Applications Over Time (Last 30 Days)</h3>
              {jobAnalytics.applicationsTrend && jobAnalytics.applicationsTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={jobAnalytics.applicationsTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        border: '1px solid rgba(118, 75, 162, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#764ba2"
                      strokeWidth={2}
                      dot={{ fill: '#764ba2', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Applications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No application data yet</div>
              )}
            </div>
          </div>

          {jobAnalytics.statusBreakdown && jobAnalytics.statusBreakdown.length > 0 && (
            <div className="chart-card full-width">
              <h3 className="chart-title">Application Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobAnalytics.statusBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="status" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" fill="#667eea" name="Count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {loadingAnalytics && (
        <div className="loading-analytics">
          <LoadingSpinner message="Loading analytics..." />
        </div>
      )}

      <style>{`
        .jobs-analytics-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .analytics-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .analytics-header h2 {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
          font-weight: 500;
        }

        .analytics-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #fca5a5;
          color: #fca5a5;
          padding: 20px;
          border-radius: 8px;
          font-size: 14px;
        }

        .job-selector {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .selector-label {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          white-space: nowrap;
        }

        .selector-dropdown {
          flex: 1;
          background: rgba(71, 85, 105, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .selector-dropdown:hover {
          border-color: #667eea;
          background: rgba(71, 85, 105, 0.5);
        }

        .selector-dropdown:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .analytics-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .overview-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.2s;
        }

        .overview-card:hover {
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.1);
        }

        .overview-label {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .overview-value {
          font-size: 32px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .overview-trend {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        .status-indicator.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .status-indicator.active::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
        }

        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .chart-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .no-data {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #94a3b8;
          font-size: 14px;
          text-align: center;
        }

        .loading-analytics {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .charts-container {
            grid-template-columns: 1fr;
          }

          .chart-card.full-width {
            grid-column: 1;
          }
        }

        @media (max-width: 768px) {
          .analytics-header h2 {
            font-size: 24px;
          }

          .job-selector {
            flex-direction: column;
            align-items: flex-start;
          }

          .selector-dropdown {
            width: 100%;
          }

          .analytics-overview {
            grid-template-columns: repeat(2, 1fr);
          }

          .overview-value {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}
