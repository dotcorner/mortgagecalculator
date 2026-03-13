import { useState, useMemo } from 'react'
import { DEFAULTS } from '../constants/defaults'
import { calcMonthlyPayment, calcAmortizationSchedule, calcExtraPaymentSavings } from '../utils/mortgageCalc'

function compute(scenario) {
  const { homePrice, downPaymentPct, annualRate, termYears, extraPayment, compounding = 'monthly' } = scenario
  const loanAmount = homePrice * (1 - downPaymentPct / 100)
  const monthlyPayment = calcMonthlyPayment(loanAmount, annualRate, termYears, compounding)
  const schedule = calcAmortizationSchedule(loanAmount, annualRate, termYears, 0, compounding)
  const totalInterest = schedule.reduce((sum, m) => sum + m.interestPaid, 0)
  const totalCost = loanAmount + totalInterest
  const savings = extraPayment > 0
    ? calcExtraPaymentSavings(loanAmount, annualRate, termYears, extraPayment, compounding)
    : { interestSaved: 0, monthsSaved: 0 }
  const paymentSchedule = extraPayment > 0
    ? calcAmortizationSchedule(loanAmount, annualRate, termYears, extraPayment, compounding)
    : schedule
  return { loanAmount, monthlyPayment, totalInterest, totalCost, savings, schedule: paymentSchedule, baseSchedule: schedule }
}

export function useMortgage() {
  const [scenarioA, setScenarioA] = useState(DEFAULTS)
  const [scenarioB, setScenarioB] = useState(DEFAULTS)
  const [activeTab, setActiveTab] = useState('calculator')

  const resultsA = useMemo(() => compute(scenarioA), [scenarioA])
  const resultsB = useMemo(() => compute(scenarioB), [scenarioB])

  function updateScenarioA(field, val) {
    setScenarioA(prev => ({ ...prev, [field]: val }))
  }

  function updateScenarioB(field, val) {
    setScenarioB(prev => ({ ...prev, [field]: val }))
  }

  function copyAtoB() {
    setScenarioB({ ...scenarioA })
  }

  return {
    scenarioA, scenarioB,
    resultsA, resultsB,
    updateScenarioA, updateScenarioB,
    copyAtoB,
    activeTab, setActiveTab,
  }
}
