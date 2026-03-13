import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/mortgageCalc'

const COLORS = ['#6366f1', '#fbbf24']

export default function PaymentDonutChart({ results }) {
  const { loanAmount, totalInterest, monthlyPayment, totalCost } = results
  const principalPct = ((loanAmount / totalCost) * 100).toFixed(1)
  const interestPct = ((totalInterest / totalCost) * 100).toFixed(1)

  const data = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: totalInterest },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 text-sm">
          <p className="font-semibold text-slate-700">{payload[0].name}</p>
          <p className="text-slate-900 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="stat-value text-2xl">{formatCurrency(monthlyPayment)}</div>
          <div className="stat-label">Monthly Payment</div>
        </div>
        <div>
          <div className="stat-value text-2xl">{formatCurrency(totalInterest)}</div>
          <div className="stat-label">Total Interest</div>
        </div>
        <div>
          <div className="stat-value text-2xl">{formatCurrency(totalCost)}</div>
          <div className="stat-label">Total Cost</div>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Payment Breakdown</h3>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-400 font-medium">Monthly</span>
          <span className="text-xl font-bold text-slate-900">{formatCurrency(monthlyPayment)}</span>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
          <span className="text-sm text-slate-600">Principal <span className="font-semibold">{principalPct}%</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
          <span className="text-sm text-slate-600">Interest <span className="font-semibold">{interestPct}%</span></span>
        </div>
      </div>
    </div>
  )
}
