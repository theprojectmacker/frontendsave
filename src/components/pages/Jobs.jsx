import { useState, useEffect } from 'react'
import SkeletonLoader from '../SkeletonLoader'
import { jobsAPI } from '../../utils/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salaryRange: '',
    jobType: 'Full-time',
    requirements: '',
    benefits: '',
    companyName: '',
    contactEmail: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await jobsAPI.getAdminJobs()
      if (data.success) {
        setJobs(data.jobs)
      } else {
        setError(data.error || 'Failed to fetch jobs')
      }
    } catch (err) {
      setError('Failed to load jobs')
      console.error('Jobs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      
      let response
      if (selectedJob) {
        response = await jobsAPI.updateJob(selectedJob.id, formData)
      } else {
        response = await jobsAPI.createJob(formData)
      }

      if (response.success) {
        setFormData({
          title: '',
          description: '',
          location: '',
          salaryRange: '',
          jobType: 'Full-time',
          requirements: '',
          benefits: '',
          companyName: '',
          contactEmail: '',
        })
        setShowForm(false)
        setSelectedJob(null)
        await fetchJobs()
      } else {
        setError(response.error || 'Failed to save job')
      }
    } catch (err) {
      setError('Failed to save job')
      console.error('Submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (job) => {
    setSelectedJob(job)
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salaryRange: job.salary_range || '',
      jobType: job.job_type || 'Full-time',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      companyName: job.company_name || '',
      contactEmail: job.contact_email || '',
    })
    setShowForm(true)
  }

  const handleDeleteJob = async (jobId) => {
    try {
      setDeleting(jobId)
      const response = await jobsAPI.deleteJob(jobId)
      
      if (response.success) {
        setJobs(jobs.filter(j => j.id !== jobId))
        setDeleteConfirm(null)
      } else {
        setError(response.error || 'Failed to delete job')
      }
    } catch (err) {
      setError('Failed to delete job')
      console.error('Delete error:', err)
    } finally {
      setDeleting(null)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedJob(null)
    setFormData({
      title: '',
      description: '',
      location: '',
      salaryRange: '',
      jobType: 'Full-time',
      requirements: '',
      benefits: '',
      companyName: '',
      contactEmail: '',
    })
    setError('')
  }

  if (loading) {
    return (
      <div className="jobs-container">
        <div className="jobs-header">
          <h2>Job Inquiries</h2>
          <p className="jobs-count">Loading...</p>
        </div>
        <SkeletonLoader type="card" count={3} />
      </div>
    )
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <div>
          <h2>Job Inquiries Management</h2>
          <p className="jobs-count">{jobs.length} job posting{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          className="create-job-button"
          onClick={() => {
            setShowForm(true)
            setSelectedJob(null)
          }}
        >
          + Post New Job
        </button>
      </div>

      {error && <div className="jobs-error">{error}</div>}

      {showForm && (
        <div className="job-form-modal-overlay" onClick={handleCancel}>
          <div className="job-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="job-form-header">
              <h3>{selectedJob ? 'Edit Job Inquiry' : 'Post New Job Inquiry'}</h3>
              <button
                className="close-form-button"
                onClick={handleCancel}
                title="Close"
              >
                ✕
              </button>
            </div>

            <form className="job-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">Job Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the job responsibilities and requirements..."
                  className="form-textarea"
                  rows="5"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">Location *</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, NY"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="jobType" className="form-label">Job Type</label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salaryRange" className="form-label">Salary Range</label>
                  <input
                    id="salaryRange"
                    name="salaryRange"
                    type="text"
                    value={formData.salaryRange}
                    onChange={handleInputChange}
                    placeholder="e.g., $50,000 - $80,000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">Company Name</label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Company Inc."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="requirements" className="form-label">Requirements</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="List the key requirements and qualifications..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="benefits" className="form-label">Benefits</label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="Describe the benefits offered..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="hiring@company.com"
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner"></span> Saving...
                    </>
                  ) : (
                    selectedJob ? 'Update Job' : 'Post Job'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="jobs-empty">
          <div className="empty-icon">📋</div>
          <h3>No Job Postings Yet</h3>
          <p>Click "Post New Job" to create your first job inquiry</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company_name || 'Company'}</p>
                </div>
                <span className={`status-badge ${job.status}`}>
                  {job.status === 'active' ? '✓ Active' : 'Closed'}
                </span>
              </div>

              <p className="job-description">{job.description.substring(0, 150)}...</p>

              <div className="job-meta">
                <span className="meta-item">📍 {job.location}</span>
                <span className="meta-item">💼 {job.job_type || 'N/A'}</span>
              </div>

              <div className="job-stats">
                <div className="stat">
                  <span className="stat-label">Clicks</span>
                  <span className="stat-value">{job.total_clicks || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Applications</span>
                  <span className="stat-value">{job.total_applications || 0}</span>
                </div>
              </div>

              <div className="job-actions">
                <button
                  className="view-applications-btn"
                  onClick={() => setSelectedJob(job)}
                  title="View applications"
                >
                  👥 View
                </button>
                <button
                  className="edit-job-btn"
                  onClick={() => handleEdit(job)}
                  title="Edit job"
                >
                  ✏️ Edit
                </button>
                <button
                  className={`delete-job-btn ${deleteConfirm === job.id ? 'confirm' : ''}`}
                  onClick={() => handleDeleteJob(job.id, job.title)}
                  disabled={deleting === job.id}
                  title="Delete job"
                >
                  {deleting === job.id ? (
                    <>
                      <span className="spinner"></span> Deleting
                    </>
                  ) : deleteConfirm === job.id ? (
                    '⚠️ Confirm Delete?'
                  ) : (
                    '🗑️ Delete'
                  )}
                </button>
                {deleteConfirm === job.id && (
                  <button
                    className="cancel-delete-btn"
                    onClick={() => setDeleteConfirm(null)}
                    disabled={deleting === job.id}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .jobs-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .jobs-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .jobs-header h2 {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .jobs-count {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .create-job-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          height: fit-content;
        }

        .create-job-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .jobs-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #fca5a5;
          color: #fca5a5;
          padding: 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .jobs-empty {
          text-align: center;
          padding: 60px 20px;
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .jobs-empty h3 {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
        }

        .jobs-empty p {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .job-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-card:hover {
          border-color: rgba(102, 126, 234, 0.3);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        }

        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .job-title {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin: 0 0 4px 0;
        }

        .job-company {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
          font-weight: 500;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .status-badge.closed {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .job-description {
          font-size: 14px;
          color: #cbd5e0;
          margin: 0;
          line-height: 1.5;
        }

        .job-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding: 12px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .meta-item {
          font-size: 13px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .job-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          background: rgba(71, 85, 105, 0.3);
          padding: 12px;
          border-radius: 8px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #667eea;
        }

        .job-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .view-applications-btn,
        .edit-job-btn,
        .delete-job-btn,
        .cancel-delete-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 80px;
        }

        .view-applications-btn {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .view-applications-btn:hover {
          background: rgba(59, 130, 246, 0.25);
        }

        .edit-job-btn {
          background: rgba(102, 126, 234, 0.15);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .edit-job-btn:hover {
          background: rgba(102, 126, 234, 0.25);
        }

        .delete-job-btn {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .delete-job-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.25);
        }

        .delete-job-btn.confirm {
          background: rgba(239, 68, 68, 0.3);
        }

        .cancel-delete-btn {
          background: rgba(148, 163, 184, 0.15);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .cancel-delete-btn:hover {
          background: rgba(148, 163, 184, 0.25);
        }

        .job-form-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .job-form-modal {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease;
        }

        .job-form-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .job-form-header h3 {
          font-size: 20px;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .close-form-button {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 24px;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }

        .close-form-button:hover {
          color: #e2e8f0;
        }

        .job-form {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 700;
          color: #e2e8f0;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .form-input,
        .form-textarea {
          background: rgba(71, 85, 105, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(71, 85, 105, 0.5);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          justify-content: flex-end;
        }

        .cancel-button,
        .submit-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cancel-button {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .submit-button:disabled,
        .cancel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .jobs-header {
            flex-direction: column;
          }

          .create-job-button {
            width: 100%;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }

          .job-actions {
            flex-direction: column;
          }

          .view-applications-btn,
          .edit-job-btn,
          .delete-job-btn,
          .cancel-delete-btn {
            min-width: auto;
            width: 100%;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .job-form-modal {
            max-width: 100%;
            margin: 0 20px;
          }
        }
      `}</style>
    </div>
  )
}
