export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className="loading-spinner-container">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          {message && <p className="spinner-message">{message}</p>}
        </div>

        <style>{`
          .loading-spinner-fullscreen {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }

          .loading-spinner-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
          }

          .spinner-ring {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
          }

          .spinner-ring:nth-child(1) {
            animation: ring-spin 1.2s linear infinite;
          }

          .spinner-ring:nth-child(2) {
            animation: ring-spin 1.5s linear infinite;
            animation-delay: 0.2s;
          }

          .spinner-ring:nth-child(3) {
            animation: ring-spin 1.8s linear infinite;
            animation-delay: 0.4s;
          }

          .spinner-ring::after {
            content: '';
            position: absolute;
            left: 8px;
            top: 8px;
            width: 64px;
            height: 64px;
            border: 4px solid;
            border-color: #667eea transparent transparent transparent;
            border-radius: 50%;
          }

          .spinner-ring:nth-child(1)::after {
            border-color: #667eea transparent transparent transparent;
          }

          .spinner-ring:nth-child(2)::after {
            border-color: #764ba2 transparent transparent transparent;
          }

          .spinner-ring:nth-child(3)::after {
            border-color: #667eea transparent transparent transparent;
          }

          @keyframes ring-spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .spinner-message {
            font-size: 16px;
            color: #cbd5e0;
            margin: 0;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="loading-spinner-inline">
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      {message && <span className="spinner-text">{message}</span>}

      <style>{`
        .loading-spinner-inline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px;
          text-align: center;
        }

        .spinner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: dot-bounce 1.4s infinite ease-in-out both;
        }

        .spinner-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .spinner-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        .spinner-dot:nth-child(3) {
          animation-delay: 0;
        }

        @keyframes dot-bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .spinner-text {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          margin-left: 8px;
        }
      `}</style>
    </div>
  )
}
