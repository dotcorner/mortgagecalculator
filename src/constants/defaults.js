export const DEFAULTS = {
  homePrice: 400000,
  downPaymentPct: 20,
  annualRate: 6.5,
  termYears: 30,
  extraPayment: 0,
  compounding: 'monthly',
  startDate: '',
}

export const LIMITS = {
  homePrice:      { min: 50000,  max: 2000000, step: 5000 },
  downPaymentPct: { min: 0,      max: 95,      step: 1    },
  annualRate:     { min: 0,      max: 25,      step: 0.05 },
  termYears:      { min: 1,      max: 30,      step: 1    },
  extraPayment:   { min: 0,      max: 5000,    step: 25   },
}
