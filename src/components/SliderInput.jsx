import { useState, useEffect } from 'react'
import { LIMITS } from '../constants/defaults'

export default function SliderInput({ field, label, value, onChange, prefix = '', suffix = '', accentColor = 'indigo' }) {
  const limits = LIMITS[field]
  const [inputVal, setInputVal] = useState(String(value))

  useEffect(() => {
    setInputVal(String(value))
  }, [value])

  function handleInputChange(e) {
    setInputVal(e.target.value)
  }

  function handleInputBlur() {
    let num = parseFloat(inputVal)
    if (isNaN(num)) num = limits.min
    num = Math.min(limits.max, Math.max(limits.min, num))
    onChange(num)
    setInputVal(String(num))
  }

  function handleSliderChange(e) {
    const num = parseFloat(e.target.value)
    onChange(num)
  }

  const ringColor = accentColor === 'rose' ? 'focus:ring-rose-500/40 focus:border-rose-400' : 'focus:ring-indigo-500/40 focus:border-indigo-400'
  const accentStyle = accentColor === 'rose' ? { accentColor: '#f43f5e' } : {}

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-slate-500">{prefix}</span>}
          <input
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-right focus:outline-none focus:ring-2 transition-all ${ringColor}`}
          />
          {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={handleSliderChange}
        style={accentStyle}
        className="w-full h-1.5 rounded-full cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-300">
        <span>{prefix}{limits.min}{suffix}</span>
        <span>{prefix}{limits.max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  )
}
