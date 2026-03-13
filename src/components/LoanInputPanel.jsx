import { useState, useEffect } from 'react'
import SliderInput from './SliderInput'
import { formatCurrency } from '../utils/mortgageCalc'

export default function LoanInputPanel({ scenario, onUpdate, results, accentColor = 'indigo', title }) {
  const downPaymentAmt = scenario.homePrice * scenario.downPaymentPct / 100
  const [pctInput, setPctInput] = useState(String(scenario.downPaymentPct))
  const [dpAmtInput, setDpAmtInput] = useState(String(downPaymentAmt))

  useEffect(() => {
    setPctInput(String(scenario.downPaymentPct))
  }, [scenario.downPaymentPct])

  useEffect(() => {
    setDpAmtInput(String(Math.round(downPaymentAmt)))
  }, [downPaymentAmt])

  const [selMonth, setSelMonth] = useState(() => (scenario.startDate ?? '').split('-')[1] ?? '')
  const [selYear, setSelYear]   = useState(() => (scenario.startDate ?? '').split('-')[0] ?? '')

  useEffect(() => {
    const parts = (scenario.startDate ?? '').split('-')
    setSelYear(parts[0] ?? '')
    setSelMonth(parts[1] ?? '')
  }, [scenario.startDate])

  const ringColor = accentColor === 'rose'
    ? 'focus:ring-rose-500/40 focus:border-rose-400'
    : 'focus:ring-indigo-500/40 focus:border-indigo-400'

  return (
    <div className="card space-y-6">
      {title && (
        <div className={`flex items-center gap-2 pb-4 border-b border-slate-100`}>
          <div className={`w-3 h-3 rounded-full ${accentColor === 'rose' ? 'bg-rose-500' : 'bg-indigo-600'}`} />
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
      )}

      <SliderInput
        field="homePrice"
        label="Home Price"
        value={scenario.homePrice}
        onChange={val => onUpdate('homePrice', val)}
        prefix="$"
        accentColor={accentColor}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-slate-700">Down Payment</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">$</span>
            <input
              type="text"
              value={dpAmtInput}
              onChange={e => setDpAmtInput(e.target.value)}
              onBlur={() => {
                let amt = parseFloat(dpAmtInput)
                if (isNaN(amt)) amt = 0
                amt = Math.min(scenario.homePrice * 0.95, Math.max(0, amt))
                const pct = scenario.homePrice > 0 ? (amt / scenario.homePrice) * 100 : 0
                onUpdate('downPaymentPct', Math.round(pct * 10) / 10)
              }}
              className={`w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-right focus:outline-none focus:ring-2 transition-all ${ringColor}`}
            />
            <input
              type="text"
              value={pctInput}
              onChange={e => setPctInput(e.target.value)}
              onBlur={() => {
                let num = parseFloat(pctInput)
                if (isNaN(num)) num = 0
                num = Math.min(95, Math.max(0, num))
                onUpdate('downPaymentPct', num)
                setPctInput(String(num))
              }}
              className={`w-16 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-right focus:outline-none focus:ring-2 transition-all ${ringColor}`}
            />
            <span className="text-sm text-slate-500">%</span>
          </div>
        </div>
        <input
          type="range" min={0} max={95} step={1}
          value={scenario.downPaymentPct}
          onChange={e => onUpdate('downPaymentPct', parseFloat(e.target.value))}
          style={accentColor === 'rose' ? { accentColor: '#f43f5e' } : {}}
          className="w-full h-1.5 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-300">
          <span>0%</span>
          <span>95%</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
        <span className="text-sm text-slate-500">Loan Amount</span>
        <span className="text-sm font-bold text-slate-800">{formatCurrency(results.loanAmount)}</span>
      </div>

      <SliderInput
        field="annualRate"
        label="Interest Rate"
        value={scenario.annualRate}
        onChange={val => onUpdate('annualRate', val)}
        suffix="%"
        accentColor={accentColor}
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Compounding</label>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm font-medium">
          {['monthly', 'semiAnnual'].map(opt => {
            const active = (scenario.compounding ?? 'monthly') === opt
            const activeCls = accentColor === 'rose'
              ? 'bg-rose-500 text-white'
              : 'bg-indigo-600 text-white'
            return (
              <button key={opt}
                onClick={() => onUpdate('compounding', opt)}
                className={`px-3 py-1.5 transition-colors ${active ? activeCls : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {opt === 'monthly' ? 'Monthly' : 'Semi-Annual'}
              </button>
            )
          })}
        </div>
      </div>

      <SliderInput
        field="termYears"
        label="Loan Term"
        value={scenario.termYears}
        onChange={val => onUpdate('termYears', val)}
        suffix=" yr"
        accentColor={accentColor}
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">First Payment</label>
        <div className="flex gap-2">
          {(() => {
            const currentYear = new Date().getFullYear()
            const years = Array.from({ length: currentYear + 11 - 2000 }, (_, i) => 2000 + i)
            const months = [
              ['01','Jan'],['02','Feb'],['03','Mar'],['04','Apr'],
              ['05','May'],['06','Jun'],['07','Jul'],['08','Aug'],
              ['09','Sep'],['10','Oct'],['11','Nov'],['12','Dec'],
            ]
            const selectCls = `px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 transition-all ${ringColor}`
            return (
              <>
                <select
                  value={selMonth}
                  onChange={e => {
                    const m = e.target.value
                    setSelMonth(m)
                    if (m && selYear) onUpdate('startDate', `${selYear}-${m}`)
                    else onUpdate('startDate', '')
                  }}
                  className={selectCls}
                >
                  <option value="">Month</option>
                  {months.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <select
                  value={selYear}
                  onChange={e => {
                    const y = e.target.value
                    setSelYear(y)
                    if (selMonth && y) onUpdate('startDate', `${y}-${selMonth}`)
                    else onUpdate('startDate', '')
                  }}
                  className={selectCls}
                >
                  <option value="">Year</option>
                  {years.map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </>
            )
          })()}
        </div>
      </div>

      <SliderInput
        field="extraPayment"
        label="Extra Monthly Payment"
        value={scenario.extraPayment}
        onChange={val => onUpdate('extraPayment', val)}
        prefix="$"
        accentColor={accentColor}
      />

      {scenario.extraPayment > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(results.savings.interestSaved)}</div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-1">Interest Saved</div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <div className="text-2xl font-bold text-emerald-600">
              {(() => {
                const yearsSaved = Math.floor(results.savings.monthsSaved / 12)
                const remMonths = results.savings.monthsSaved % 12
                return <>{yearsSaved > 0 && `${yearsSaved}y `}{remMonths > 0 && `${remMonths}m`}{results.savings.monthsSaved === 0 && '—'}</>
              })()}
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-1">Time Saved</div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-sm text-slate-400">
          Add an extra monthly payment above to see your savings.
        </div>
      )}
    </div>
  )
}
