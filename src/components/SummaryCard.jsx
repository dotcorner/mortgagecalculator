import { formatCurrency } from '../utils/mortgageCalc'

export default function SummaryCard({ results, accentColor = 'indigo' }) {
  const borderColor = accentColor === 'rose' ? 'border-rose-500' : 'border-indigo-600'

  return (
    <div className={`card border-t-4 ${borderColor}`}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="stat-value text-2xl">{formatCurrency(results.monthlyPayment)}</div>
          <div className="stat-label">Monthly Payment</div>
        </div>
        <div>
          <div className="stat-value text-2xl">{formatCurrency(results.totalInterest)}</div>
          <div className="stat-label">Total Interest</div>
        </div>
        <div>
          <div className="stat-value text-2xl">{formatCurrency(results.totalCost)}</div>
          <div className="stat-label">Total Cost</div>
        </div>
      </div>
    </div>
  )
}
