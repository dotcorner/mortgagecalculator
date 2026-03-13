import SliderInput from './SliderInput'
import { formatCurrency } from '../utils/mortgageCalc'

export default function ExtraPaymentPanel({ scenario, onUpdate, results }) {
  const { savings } = results
  const yearsSaved = Math.floor(savings.monthsSaved / 12)
  const remMonths = savings.monthsSaved % 12

  return (
    <div className="card max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Extra Payment Savings</h2>
        <p className="text-sm text-slate-500 mt-1">See how extra monthly payments reduce your interest and loan term.</p>
      </div>

      <SliderInput
        field="extraPayment"
        label="Extra Monthly Payment"
        value={scenario.extraPayment}
        onChange={val => onUpdate('extraPayment', val)}
        prefix="$"
      />

      {scenario.extraPayment > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(savings.interestSaved)}</div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-1">Interest Saved</div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <div className="text-2xl font-bold text-emerald-600">
              {yearsSaved > 0 && `${yearsSaved}y `}{remMonths > 0 && `${remMonths}m`}{savings.monthsSaved === 0 && '—'}
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-1">Time Saved</div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 text-center text-sm text-slate-400">
          Add an extra monthly payment above to see your savings.
        </div>
      )}
    </div>
  )
}
