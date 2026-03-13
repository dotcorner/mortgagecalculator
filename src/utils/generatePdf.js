import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from './mortgageCalc'

const INDIGO = [79, 70, 229]   // #4f46e5
const WHITE  = [255, 255, 255]
const GREY   = [248, 249, 250]
const DARK   = [15, 23, 42]    // slate-900

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

function fmtDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function fmtMoney(val) {
  return Number(val).toFixed(2)
}

export function generatePdf(scenario, results) {
  const { homePrice, downPaymentPct, annualRate, termYears, extraPayment, compounding, startDate } = scenario
  const { loanAmount, monthlyPayment, totalInterest, totalCost, schedule } = results

  const downPayment = homePrice * (downPaymentPct / 100)
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const pageW = doc.internal.pageSize.getWidth()  // 210
  const margin = 14

  // ── 1. Branded header bar ──────────────────────────────────────────────────
  doc.setFillColor(...INDIGO)
  doc.rect(0, 0, pageW, 26, 'F')

  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('Mortgage Calculator', margin, 11)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Plan your home purchase with confidence', margin, 17.5)

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  doc.text(`Generated: ${today}`, pageW - margin, 17.5, { align: 'right' })

  let y = 34

  // ── 2. Loan Parameters box ─────────────────────────────────────────────────
  doc.setFillColor(...GREY)
  doc.roundedRect(margin, y, pageW - margin * 2, extraPayment > 0 ? 54 : 46, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...DARK)
  doc.text('LOAN PARAMETERS', margin + 4, y + 7)

  const col1x = margin + 4
  const col2x = pageW / 2 + 2
  const rowH  = 7
  let py = y + 14

  const compLabel = compounding === 'semiAnnual' ? 'Semi-Annual' : 'Monthly'
  const firstPayDate = fmtDate(parseStartDate(startDate))

  const params = [
    ['Home Price',    formatCurrency(homePrice),   'Down Payment', `${formatCurrency(downPayment)} (${downPaymentPct}%)`],
    ['Loan Amount',   formatCurrency(loanAmount),  'Interest Rate', `${annualRate}%`],
    ['Loan Term',     `${termYears} years`,         'Compounding',  compLabel],
    ['First Payment', firstPayDate,                 extraPayment > 0 ? 'Extra Monthly' : null, extraPayment > 0 ? formatCurrency(extraPayment) : null],
  ]

  for (const [l1, v1, l2, v2] of params) {
    if (l1) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(100, 116, 139)  // slate-500
      doc.text(l1, col1x, py)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text(v1, col1x, py + 4)
    }
    if (l2) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(100, 116, 139)
      doc.text(l2, col2x, py)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text(v2, col2x, py + 4)
    }
    py += rowH
  }

  y += (extraPayment > 0 ? 54 : 46) + 6

  // ── 3. Key Stats row ───────────────────────────────────────────────────────
  const stats = [
    ['Monthly Payment', formatCurrency(monthlyPayment)],
    ['Total Interest',  formatCurrency(totalInterest)],
    ['Total Cost',      formatCurrency(totalCost)],
  ]
  const boxW = (pageW - margin * 2 - 8) / 3

  for (let i = 0; i < stats.length; i++) {
    const bx = margin + i * (boxW + 4)
    doc.setFillColor(245, 247, 255)
    doc.roundedRect(bx, y, boxW, 20, 2, 2, 'F')
    doc.setFillColor(...INDIGO)
    doc.rect(bx, y, boxW, 1.5, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(100, 116, 139)
    doc.text(stats[i][0], bx + boxW / 2, y + 8, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text(stats[i][1], bx + boxW / 2, y + 16, { align: 'center' })
  }

  y += 26

  // ── 4. Amortization table ──────────────────────────────────────────────────
  const showExtra = extraPayment > 0
  const startDateObj = parseStartDate(startDate)

  const head = showExtra
    ? [['Month', 'Date', 'Payment', 'Principal', 'Interest', 'Extra', 'Balance']]
    : [['Month', 'Date', 'Payment', 'Principal', 'Interest', 'Balance']]

  const body = schedule.map((row, i) => {
    const date = addMonths(startDateObj, i)
    const isYearEnd = row.month % 12 === 0
    const base = [
      row.month,
      fmtDate(date),
      fmtMoney(row.payment),
      fmtMoney(row.principalPaid),
      fmtMoney(row.interestPaid),
    ]
    if (showExtra) base.push(fmtMoney(extraPayment))
    base.push(fmtMoney(row.balance))
    return { data: base, isYearEnd }
  })

  autoTable(doc, {
    startY: y,
    head,
    body: body.map(r => r.data),
    styles: { fontSize: 7, cellPadding: 1.8, halign: 'right' },
    headStyles: {
      fillColor: INDIGO,
      textColor: WHITE,
      fontStyle: 'bold',
      halign: 'right',
    },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'left' },
    },
    alternateRowStyles: { fillColor: [248, 249, 252] },
    didParseCell(data) {
      if (data.section === 'body') {
        const row = body[data.row.index]
        if (row?.isYearEnd) {
          data.cell.styles.fontStyle = 'bold'
        }
      }
    },
    margin: { left: margin, right: margin },
  })

  doc.save('mortgage-summary.pdf')
}
