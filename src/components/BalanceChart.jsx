import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '../utils/mortgageCalc'

function parseStartDate(startDate) {
  if (startDate) {
    const [year, month] = startDate.split('-').map(Number)
    return new Date(year, month - 1, 1)
  }
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1)
}

export default function BalanceChart({ results, scenario }) {
  const { schedule, baseSchedule } = results
  const extraPayment = scenario.extraPayment ?? 0
  const showBase = extraPayment > 0
  const startDate = parseStartDate(scenario.startDate)

  const maxLength = showBase && baseSchedule
    ? Math.max(schedule.length, baseSchedule.length)
    : schedule.length

  const chartData = Array.from({ length: maxLength }, (_, i) => {
    const date = addMonths(startDate, i)
    const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const entry = { date: label }
    if (i < schedule.length) entry.balance = schedule[i].balance
    if (showBase && baseSchedule && i < baseSchedule.length) entry.baseBalance = baseSchedule[i].balance
    return entry
  })

  const startIndex = 0
  const midIndex = Math.floor((maxLength - 1) / 2)
  const endIndex = maxLength - 1
  const xTicks = [...new Set([
    chartData[startIndex]?.date,
    chartData[midIndex]?.date,
    chartData[endIndex]?.date
  ].filter(Boolean))]

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Balance Over Time
        </h3>
        {extraPayment > 0 && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
            +{formatCurrency(extraPayment)}/mo extra
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              ticks={xTicks}
            />
            <YAxis
              tickFormatter={v => formatCurrency(v)}
              width={80}
              tick={{ fontSize: 10 }}
            />
            <Tooltip formatter={v => formatCurrency(v)} />
            {showBase && <Legend />}
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#4f46e5"
              dot={false}
              name="Balance"
              strokeWidth={2}
            />
            {showBase && (
              <Line
                type="monotone"
                dataKey="baseBalance"
                stroke="#ef4444"
                dot={false}
                name="No Extra Payments"
                strokeWidth={2}
                strokeDasharray="5 3"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
