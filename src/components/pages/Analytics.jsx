import ChartCard from '../ChartCard'

export default function Analytics() {
  return (
    <div className="analytics-page">
      <h2>Analytics</h2>
      <div className="charts-container">
        <ChartCard
          title="User Activity"
          subtitle="Weekly overview"
          type="line"
        />
        <ChartCard
          title="Traffic Sources"
          subtitle="Distribution"
          type="pie"
        />
        <ChartCard
          title="Conversion Rates"
          subtitle="By channel"
          type="bar"
        />
        <ChartCard
          title="Performance Metrics"
          subtitle="30-day trend"
          type="area"
          fullWidth
        />
      </div>

      <style>{`
        .analytics-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .analytics-page h2 {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .charts-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
