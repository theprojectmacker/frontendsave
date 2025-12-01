import { useState, useEffect } from 'react'
import { modulesAPI } from '../../utils/api'
import LoadingSpinner from '../LoadingSpinner'

export default function Modules() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState('')

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      setLoading(true)
      const data = await modulesAPI.getModules()
      if (data.success) {
        setModules(data.modules)
      } else {
        setError(data.error || 'Failed to load modules')
      }
    } catch (err) {
      setError('Failed to load modules')
      console.error('Fetch modules error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ['image/gif', 'application/pdf', 'image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setError(`File type not allowed. Allowed types: GIF, PDF, JPEG, PNG`)
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle.trim()) {
      setError('Please select a file and enter a title')
      return
    }

    try {
      setUploadProgress(true)
      setError('')

      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64Data = event.target.result.split(',')[1]

        const result = await modulesAPI.uploadModule({
          title: uploadTitle,
          fileData: base64Data,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        })

        if (result.success) {
          setModules([result.module, ...modules])
          setSelectedFile(null)
          setUploadTitle('')
          document.getElementById('fileInput').value = ''
        } else {
          setError(result.error || 'Upload failed')
        }
      }
      reader.readAsDataURL(selectedFile)
    } catch (err) {
      setError('Upload failed')
      console.error('Upload error:', err)
    } finally {
      setUploadProgress(false)
    }
  }

  const handleEditStart = (module) => {
    setEditingId(module.id)
    setEditTitle(module.title)
  }

  const handleEditSave = async (moduleId) => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty')
      return
    }

    try {
      const result = await modulesAPI.updateModule(moduleId, { title: editTitle })
      if (result.success) {
        setModules(modules.map(m => m.id === moduleId ? { ...m, title: editTitle } : m))
        setEditingId(null)
        setEditTitle('')
      } else {
        setError(result.error || 'Update failed')
      }
    } catch (err) {
      setError('Update failed')
      console.error('Update error:', err)
    }
  }

  const handleDelete = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module?')) {
      return
    }

    try {
      const result = await modulesAPI.deleteModule(moduleId)
      if (result.success) {
        setModules(modules.filter(m => m.id !== moduleId))
      } else {
        setError(result.error || 'Delete failed')
      }
    } catch (err) {
      setError('Delete failed')
      console.error('Delete error:', err)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('video')) return '🎬'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('sheet')) return '📊'
    return '📦'
  }

  if (loading) {
    return (
      <div className="modules-page">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="modules-page">
      <div className="modules-header">
        <h2 className="modules-title">Module Management</h2>
        <p className="modules-subtitle">Upload, manage, and organize your modules (GIF, PDF, etc.)</p>
      </div>

      {error && (
        <div className="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div className="upload-section">
        <h3 className="section-title">Add New Module</h3>
        <div className="upload-form">
          <div className="form-group">
            <label htmlFor="titleInput" className="form-label">Module Title *</label>
            <input
              id="titleInput"
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="Enter module title"
              className="form-input"
              disabled={uploadProgress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fileInput" className="form-label">Select File *</label>
            <div className="file-input-wrapper">
              <input
                id="fileInput"
                type="file"
                onChange={handleFileSelect}
                accept=".gif,.pdf,.jpg,.jpeg,.png,.mp4,.webm,.doc,.docx,.xls,.xlsx,.txt"
                className="file-input"
                disabled={uploadProgress}
              />
              <div className="file-input-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{selectedFile ? selectedFile.name : 'Choose a file or drag and drop'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploadProgress || !selectedFile || !uploadTitle.trim()}
            className="upload-button"
          >
            {uploadProgress ? 'Uploading...' : 'Upload Module'}
          </button>
        </div>
      </div>

      <div className="modules-list-section">
        <h3 className="section-title">Modules ({modules.length})</h3>

        {modules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p className="empty-text">No modules uploaded yet</p>
            <p className="empty-subtext">Upload your first module to get started</p>
          </div>
        ) : (
          <div className="modules-list">
            {modules.map((module) => (
              <div key={module.id} className="module-card">
                <div className="module-header">
                  <div className="module-icon">{getFileIcon(module.file_type)}</div>
                  <div className="module-info">
                    {editingId === module.id ? (
                      <div className="edit-title-input">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="title-input"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(module.id)}
                          className="save-button"
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="cancel-button"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <h4 className="module-title">{module.title}</h4>
                    )}
                    <p className="module-filename">{module.file_name}</p>
                  </div>
                </div>

                <div className="module-details">
                  <span className="detail-item">
                    <span className="detail-label">Size:</span>
                    {formatFileSize(module.file_size)}
                  </span>
                  <span className="detail-item">
                    <span className="detail-label">Type:</span>
                    {module.file_type}
                  </span>
                  <span className="detail-item">
                    <span className="detail-label">Uploaded:</span>
                    {new Date(module.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="module-actions">
                  <button
                    onClick={() => window.open(module.public_url, '_blank')}
                    className="action-button view-button"
                    title="View file"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </button>
                  {editingId !== module.id && (
                    <button
                      onClick={() => handleEditStart(module)}
                      className="action-button edit-button"
                      title="Edit title"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(module.id)}
                    className="action-button delete-button"
                    title="Delete module"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .modules-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .modules-header {
          margin-bottom: 12px;
        }

        .modules-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .modules-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 14px;
        }

        .upload-section {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 20px 0;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          padding: 12px 16px;
          background: rgba(71, 85, 105, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          background: rgba(71, 85, 105, 0.5);
          border-color: #667eea;
        }

        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .file-input-wrapper {
          position: relative;
          cursor: pointer;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 32px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 2px dashed rgba(102, 126, 234, 0.3);
          border-radius: 8px;
          color: #cbd5e0;
          font-size: 14px;
          transition: all 0.2s;
          text-align: center;
        }

        .file-input-wrapper:hover .file-input-label {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
        }

        .file-input-label svg {
          color: #667eea;
          flex-shrink: 0;
        }

        .upload-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .upload-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        .upload-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modules-list-section {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-text {
          font-size: 16px;
          font-weight: 600;
          color: #cbd5e0;
          margin: 0 0 8px 0;
        }

        .empty-subtext {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        .modules-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .module-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 10px;
          transition: all 0.2s;
        }

        .module-card:hover {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .module-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .module-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .module-info {
          flex: 1;
          min-width: 0;
        }

        .edit-title-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-input {
          flex: 1;
          padding: 8px 12px;
          background: rgba(71, 85, 105, 0.3);
          border: 1px solid #667eea;
          border-radius: 6px;
          color: white;
          font-size: 14px;
        }

        .title-input:focus {
          outline: none;
          background: rgba(71, 85, 105, 0.5);
        }

        .save-button,
        .cancel-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(71, 85, 105, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-button:hover {
          background: rgba(34, 197, 94, 0.2);
          border-color: #22c55e;
          color: #86efac;
        }

        .cancel-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #fca5a5;
        }

        .module-title {
          font-size: 15px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 4px 0;
          word-break: break-word;
        }

        .module-filename {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
          word-break: break-all;
        }

        .module-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #cbd5e0;
        }

        .detail-label {
          font-weight: 600;
          color: #94a3b8;
          min-width: 50px;
        }

        .module-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 1;
          min-width: 80px;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          background: rgba(71, 85, 105, 0.3);
          color: #cbd5e0;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .action-button:hover {
          transform: translateY(-1px);
        }

        .view-button:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: #3b82f6;
          color: #93c5fd;
        }

        .edit-button:hover {
          background: rgba(147, 51, 234, 0.2);
          border-color: #9333ea;
          color: #d8b4fe;
        }

        .delete-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #fca5a5;
        }

        @media (max-width: 768px) {
          .modules-title {
            font-size: 22px;
          }

          .modules-list {
            grid-template-columns: 1fr;
          }

          .upload-form {
            gap: 12px;
          }

          .module-actions {
            gap: 6px;
          }

          .action-button {
            min-width: 70px;
            padding: 8px 10px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}
