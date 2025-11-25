import { useState, useEffect } from 'react'
import SkeletonLoader from '../SkeletonLoader'
import { dashboardAPI } from '../../utils/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await dashboardAPI.getUsers()
      if (data.success) {
        setUsers(data.users)
        setError('')
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to load users')
      console.error('Fetch users error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId, userEmail) => {
    if (deleteConfirm !== userId) {
      setDeleteConfirm(userId)
      return
    }

    try {
      setDeleting(userId)
      const data = await dashboardAPI.deleteUser(userId)
      if (data.success) {
        setUsers(users.filter(u => u.id !== userId))
        setDeleteConfirm(null)
        setError('')
      } else {
        setError(data.error || 'Failed to delete user')
      }
    } catch (err) {
      setError('Failed to delete user')
      console.error('Delete user error:', err)
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="users-container">
        <div className="users-header">
          <h2>Users Management</h2>
          <p className="users-count">Loading...</p>
        </div>
        <SkeletonLoader type="table" count={5} />
      </div>
    )
  }

  return (
    <div className="users-container">
      {error && <div className="users-error">{error}</div>}

      <div className="users-header">
        <h2>Users Management</h2>
        <p className="users-count">{users.length} total users</p>
      </div>

      <div className="users-table-wrapper">
        {users.length === 0 ? (
          <div className="users-empty">No users found</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="user-id">#{user.id}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-status">
                    <span className={`status-badge ${user.is_online ? 'online' : 'offline'}`}>
                      {user.is_online ? '🟢 Online' : '⚫ Offline'}
                    </span>
                  </td>
                  <td className="user-last-seen">{formatDate(user.last_seen)}</td>
                  <td className="user-created">{formatDate(user.created_at)}</td>
                  <td className="user-action">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedUser(user)}
                      title="View profile"
                    >
                      View
                    </button>
                    <button
                      className={`delete-btn ${deleteConfirm === user.id ? 'confirm' : ''}`}
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={deleting === user.id}
                    >
                      {deleting === user.id ? (
                        <>
                          <span className="spinner"></span> Deleting
                        </>
                      ) : deleteConfirm === user.id ? (
                        'Confirm Delete?'
                      ) : (
                        'Delete'
                      )}
                    </button>
                    {deleteConfirm === user.id && (
                      <button
                        className="cancel-btn"
                        onClick={() => setDeleteConfirm(null)}
                        disabled={deleting === user.id}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedUser && (
        <div className="profile-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>User Profile</h3>
              <button
                className="close-profile-btn"
                onClick={() => setSelectedUser(null)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="profile-modal-content">
              <div className="profile-section">
                <div className="profile-avatar">
                  {selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="profile-basic-info">
                  <h4 className="profile-label">Email</h4>
                  <p className="profile-value">{selectedUser.email}</p>
                </div>
              </div>

              <div className="profile-grid">
                <div className="profile-item">
                  <h4 className="profile-label">User ID</h4>
                  <p className="profile-value">{selectedUser.id}</p>
                </div>

                <div className="profile-item">
                  <h4 className="profile-label">Status</h4>
                  <p className="profile-value">
                    <span className={`status-badge ${selectedUser.is_online ? 'online' : 'offline'}`}>
                      {selectedUser.is_online ? '🟢 Online' : '⚫ Offline'}
                    </span>
                  </p>
                </div>

                <div className="profile-item">
                  <h4 className="profile-label">Role</h4>
                  <p className="profile-value">
                    <span className={`badge ${selectedUser.is_admin ? 'admin' : 'user'}`}>
                      {selectedUser.is_admin ? 'Administrator' : 'Regular User'}
                    </span>
                  </p>
                </div>

                <div className="profile-item">
                  <h4 className="profile-label">Created</h4>
                  <p className="profile-value">{formatDate(selectedUser.created_at)}</p>
                </div>

                <div className="profile-item">
                  <h4 className="profile-label">Last Seen</h4>
                  <p className="profile-value">{formatDate(selectedUser.last_seen)}</p>
                </div>

                {selectedUser.first_name && (
                  <div className="profile-item">
                    <h4 className="profile-label">First Name</h4>
                    <p className="profile-value">{selectedUser.first_name}</p>
                  </div>
                )}

                {selectedUser.last_name && (
                  <div className="profile-item">
                    <h4 className="profile-label">Last Name</h4>
                    <p className="profile-value">{selectedUser.last_name}</p>
                  </div>
                )}

                {selectedUser.date_of_birth && (
                  <div className="profile-item">
                    <h4 className="profile-label">Date of Birth</h4>
                    <p className="profile-value">{formatDate(selectedUser.date_of_birth)}</p>
                  </div>
                )}

                {selectedUser.country && (
                  <div className="profile-item">
                    <h4 className="profile-label">Country</h4>
                    <p className="profile-value">{selectedUser.country}</p>
                  </div>
                )}

                {selectedUser.state && (
                  <div className="profile-item">
                    <h4 className="profile-label">State</h4>
                    <p className="profile-value">{selectedUser.state}</p>
                  </div>
                )}

                {selectedUser.city && (
                  <div className="profile-item">
                    <h4 className="profile-label">City</h4>
                    <p className="profile-value">{selectedUser.city}</p>
                  </div>
                )}

                {selectedUser.street && (
                  <div className="profile-item">
                    <h4 className="profile-label">Street</h4>
                    <p className="profile-value">{selectedUser.street}</p>
                  </div>
                )}

                {selectedUser.house_number && (
                  <div className="profile-item">
                    <h4 className="profile-label">House Number</h4>
                    <p className="profile-value">{selectedUser.house_number}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                className="close-profile-btn-bottom"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .users-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .users-error {
          padding: 16px 20px;
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border-radius: 12px;
          border-left: 3px solid #f87171;
          font-size: 14px;
        }

        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .users-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .users-count {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        .users-table-wrapper {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }

        .users-loading,
        .users-empty {
          padding: 40px;
          text-align: center;
          color: #94a3b8;
          font-size: 16px;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .users-table thead {
          background: rgba(71, 85, 105, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .users-table th {
          padding: 16px;
          text-align: left;
          font-weight: 700;
          color: #e2e8f0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 12px;
        }

        .user-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background-color 0.2s;
        }

        .user-row:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .user-row td {
          padding: 16px;
          color: #cbd5e0;
        }

        .user-id {
          font-weight: 600;
          color: #a0aec0;
          font-size: 12px;
        }

        .user-email {
          color: white;
          font-weight: 500;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.online {
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
        }

        .status-badge.offline {
          background: rgba(107, 114, 128, 0.15);
          color: #d1d5db;
        }

        .user-last-seen,
        .user-created {
          font-size: 13px;
          color: #94a3b8;
        }

        .user-action {
          text-align: right;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .view-btn,
        .delete-btn,
        .cancel-btn {
          padding: 8px 14px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .view-btn {
          background: transparent;
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .view-btn:hover {
          background: rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }

        .delete-btn {
          background: transparent;
          color: #fca5a5;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }

        .delete-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.15);
          border-color: #f87171;
        }

        .delete-btn.confirm {
          background: rgba(239, 68, 68, 0.25);
          border-color: #f87171;
          color: #fca5a5;
        }

        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-left: 8px;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e0;
        }

        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(252, 165, 165, 0.3);
          border-top-color: #fca5a5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .profile-modal-overlay {
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .profile-modal {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease;
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

        .profile-modal::-webkit-scrollbar {
          width: 6px;
        }

        .profile-modal::-webkit-scrollbar-track {
          background: transparent;
        }

        .profile-modal::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 3px;
        }

        .profile-modal::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.6);
        }

        .profile-modal-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .profile-modal-header h3 {
          font-size: 20px;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .close-profile-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 24px;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }

        .close-profile-btn:hover {
          color: #e2e8f0;
        }

        .profile-modal-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-section {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 32px;
          flex-shrink: 0;
        }

        .profile-basic-info {
          flex: 1;
        }

        .profile-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 6px 0;
        }

        .profile-value {
          font-size: 15px;
          color: white;
          margin: 0;
          font-weight: 500;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .profile-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .profile-bio {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: rgba(71, 85, 105, 0.3);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .profile-bio .profile-value {
          line-height: 1.5;
          color: #cbd5e0;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
        }

        .badge.admin {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .badge.user {
          background: rgba(102, 126, 234, 0.15);
          color: #667eea;
        }

        .profile-modal-footer {
          padding: 20px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: flex-end;
        }

        .close-profile-btn-bottom {
          padding: 10px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-profile-btn-bottom:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .users-table th,
          .user-row td {
            padding: 12px;
            font-size: 13px;
          }

          .user-last-seen,
          .user-created {
            display: none;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .users-table-wrapper {
            overflow-x: auto;
          }

          .users-table {
            min-width: 500px;
          }

          .user-action {
            flex-direction: column;
            gap: 4px;
          }

          .view-btn,
          .delete-btn,
          .cancel-btn {
            width: 100%;
            justify-content: center;
          }

          .profile-modal {
            max-width: 100%;
            margin: 0 20px;
          }

          .profile-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-modal-content {
            padding: 16px;
          }

          .profile-modal-header {
            padding: 16px;
          }

          .profile-modal-footer {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}
