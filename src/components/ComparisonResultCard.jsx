import { formatCurrency } from '../utils/mortgageCalc'

function Row({ label, valA, valB, lowerIsBetter = true, format = formatCurrency }) {
  const aWins = lowerIsBetter ? valA <= valB : valA >= valB
  const bWins = lowerIsBetter ? valB <= valA : valB >= valA
  const delta = Math.abs(valA - valB)

  return (
    <tr className="border-t border-slate-100">
      <td className="py-3 px-4 text-sm text-slate-600">{label}</td>
      <td className="py-3 px-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-sm font-semibold ${aWins && delta > 0 ? 'text-indigo-600' : 'text-slate-800'}`}>
            {format(valA)}
          </span>
          {aWins && delta > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">Better</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-sm font-semibold ${bWins && delta > 0 ? 'text-rose-500' : 'text-slate-800'}`}>
            {format(valB)}
          </span>
          {bWins && delta > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">Better</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-center text-sm text-slate-400">
        {delta > 0 ? format(delta) : '—'}
      </td>
    </tr>
  )
}

export default function ComparisonResultCard({ resultsA, resultsB }) {
  return (
    <div className="card overflow-hidden">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Comparison Results</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Metric</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-indigo-500 uppercase tracking-wider">Scenario A</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-rose-400 uppercase tracking-wider">Scenario B</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Δ Delta</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Monthly Payment" valA={resultsA.monthlyPayment} valB={resultsB.monthlyPayment} />
            <Row label="Total Interest" valA={resultsA.totalInterest} valB={resultsB.totalInterest} />
            <Row label="Total Cost" valA={resultsA.totalCost} valB={resultsB.totalCost} />
            <Row label="Loan Amount" valA={resultsA.loanAmount} valB={resultsB.loanAmount} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
