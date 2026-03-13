import { useState } from 'react'

function formatMoney(val) {
  return Number(val).toFixed(2)
}

function formatRate(rate) {
  return Number(rate).toFixed(3) + '%'
}

function getStartDate() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}

function parseStartDate(startDate) {
  if (startDate) {
    const [year, month] = startDate.split('-').map(Number)
    return new Date(year, month - 1, 1)
  }
  return getStartDate()
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1)
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function PaymentScheduleModal({ results, scenario }) {
  const [showSchedule, setShowSchedule] = useState(false)

  const { schedule, monthlyPayment } = results
  const { annualRate, extraPayment } = scenario
  const showExtra = extraPayment > 0
  const startDate = parseStartDate(scenario.startDate)

  return (
    <>
      {showSchedule && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          onClick={() => setShowSchedule(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Payment Schedule</h2>
              <button
                onClick={() => setShowSchedule(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2 text-left">#</th>
                    <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2 text-left">Date</th>
                    <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Yr</th>
                    <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Rate</th>
                    <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Interest Due</th>
                    <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Payment Due</th>
                    {showExtra && <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Extra Payment</th>}
                    <th className="sticky top-0 z-10 bg-slate-100 px-3 py-2">Principal Paid</th>
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
                        <td className="px-3 py-1.5 text-slate-600">{formatRate(annualRate)}</td>
                        <td className="px-3 py-1.5">{formatMoney(row.interestPaid)}</td>
                        <td className="px-3 py-1.5">{formatMoney(monthlyPayment)}</td>
                        {showExtra && (
                          <td className="px-3 py-1.5">{formatMoney(extraPayment)}</td>
                        )}
                        <td className="px-3 py-1.5">{formatMoney(row.principalPaid)}</td>
                        <td className="px-3 py-1.5 font-medium">{formatMoney(row.balance)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowSchedule(true)}
        className="w-full mt-2 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
      >
        View Payment Schedule
      </button>
    </>
  )
}
