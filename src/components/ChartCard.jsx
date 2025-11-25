import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const chartData = {
  line: [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ],
  bar: [
    { name: 'Organic', value: 4000 },
    { name: 'Direct', value: 3000 },
    { name: 'Social', value: 2000 },
    { name: 'Referral', value: 2780 },
    { name: 'Paid', value: 1890 },
  ],
  pie: [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 200 },
  ],
  area: [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 200 },
    { name: 'Thu', value: 278 },
    { name: 'Fri', value: 189 },
    { name: 'Sat', value: 239 },
    { name: 'Sun', value: 349 },
  ],
}

const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe']

export default function ChartCard({ title, subtitle, type, fullWidth }) {
  const data = chartData[type] || chartData.line

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '10px',
                color: '#e2e8f0',
              }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#667eea"
              dot={{ fill: '#667eea', r: 5 }}
              activeDot={{ r: 7 }}
              strokeWidth={3}
            />
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '10px',
                color: '#e2e8f0',
              }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="value" fill="#667eea" radius={8} />
          </BarChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#667eea"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '10px',
                color: '#e2e8f0',
              }}
            />
          </PieChart>
        )
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '10px',
                color: '#e2e8f0',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              fill="#667eea"
              stroke="#667eea"
              fillOpacity={0.2}
            />
          </AreaChart>
        )
      default:
        return null
    }
  }

  return (
    <div className={`chart-card ${fullWidth ? 'full-width' : ''}`}>
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">{title}</h3>
          <p className="chart-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <style>{`
        .chart-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .chart-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
          pointer-events: none;
        }

        .chart-card:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.15);
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .chart-title-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .chart-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }

        .chart-body {
          width: 100%;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .chart-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}
