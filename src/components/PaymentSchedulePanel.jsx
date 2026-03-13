function formatMoney(val) { return Number(val).toFixed(2) }

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

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function PaymentSchedulePanel({ results, scenario }) {
  const { schedule } = results
  const { extraPayment } = scenario
  const showExtra = extraPayment > 0
  const startDate = parseStartDate(scenario.startDate)

  return (
    <div className="card flex flex-col h-full">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
        Payment Schedule
      </h3>
      <div className="overflow-y-auto flex-1 rounded-xl border border-slate-100">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2 text-left">#</th>
              <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2 text-left">Date</th>
              <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Yr</th>
              <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Interest</th>
              <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Principal</th>
              {showExtra && <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Extra</th>}
              <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Total</th>
              <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, i) => {
              const date = addMonths(startDate, i)
              const isYearEnd = row.month % 12 === 0
              const yr = isYearEnd ? Math.floor(row.month / 12) : ''
              return (
                <tr key={row.month} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
                  <td className="px-3 py-1.5 text-left text-slate-500">{row.month}</td>
                  <td className="px-3 py-1.5 text-left text-slate-600">{formatDate(date)}</td>
                  <td className="px-3 py-1.5 font-medium text-slate-700">{yr}</td>
                  <td className="px-3 py-1.5">{formatMoney(row.interestPaid)}</td>
                  <td className="px-3 py-1.5">{formatMoney(row.principalPaid)}</td>
                  {showExtra && <td className="px-3 py-1.5">{formatMoney(extraPayment)}</td>}
                  <td className="px-3 py-1.5 font-medium">{formatMoney(row.payment)}</td>
                  <td className="px-3 py-1.5 font-medium">{formatMoney(row.balance)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
