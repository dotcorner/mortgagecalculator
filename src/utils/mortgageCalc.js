function getMonthlyRate(annualRate, compounding) {
  if (annualRate === 0) return 0
  if (compounding === 'semiAnnual') {
    return Math.pow(1 + annualRate / 100 / 2, 1 / 6) - 1
  }
  return annualRate / 100 / 12
}

export function calcMonthlyPayment(principal, annualRate, termYears, compounding = 'monthly') {
  const n = termYears * 12
  const r = getMonthlyRate(annualRate, compounding)
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function calcAmortizationSchedule(principal, annualRate, termYears, extraMonthly = 0, compounding = 'monthly') {
  const r = getMonthlyRate(annualRate, compounding)
  const basePayment = calcMonthlyPayment(principal, annualRate, termYears, compounding)
  const monthlyPayment = basePayment + extraMonthly
  const schedule = []
  let balance = principal

  for (let month = 1; balance > 0; month++) {
    const interestPaid = balance * r
    let principalPaid = monthlyPayment - interestPaid
    if (principalPaid > balance) principalPaid = balance
    balance -= principalPaid
    if (balance < 0) balance = 0
    schedule.push({ month, payment: principalPaid + interestPaid, principalPaid, interestPaid, balance })
    if (month > termYears * 12 + 12) break // safety
  }

  return schedule
}

export function calcExtraPaymentSavings(principal, annualRate, termYears, extraMonthly, compounding = 'monthly') {
  const baseSchedule = calcAmortizationSchedule(principal, annualRate, termYears, 0, compounding)
  const extraSchedule = calcAmortizationSchedule(principal, annualRate, termYears, extraMonthly, compounding)

  const baseInterest = baseSchedule.reduce((sum, m) => sum + m.interestPaid, 0)
  const extraInterest = extraSchedule.reduce((sum, m) => sum + m.interestPaid, 0)

  const interestSaved = baseInterest - extraInterest
  const monthsSaved = baseSchedule.length - extraSchedule.length

  return { interestSaved, monthsSaved }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
