export default function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2>Settings</h2>

        <div className="settings-section">
          <h3>System Configuration</h3>
          <p>Platform settings and preferences will be available here.</p>
        </div>

        <div className="settings-section">
          <h3>Admin Preferences</h3>
          <p>Customize your admin dashboard experience.</p>
        </div>

        <div className="settings-section">
          <h3>Security</h3>
          <p>Manage security settings and access controls.</p>
        </div>
      </div>

      <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-container {
          max-width: 800px;
        }

        .settings-page h2 {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin: 0 0 24px 0;
        }

        .settings-section {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .settings-section h3 {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin: 0 0 12px 0;
        }

        .settings-section p {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        @media (max-width: 768px) {
          .settings-section {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}
