import LoanInputPanel from './LoanInputPanel'
import SummaryCard from './SummaryCard'
import PaymentDonutChart from './PaymentDonutChart'
import ComparisonResultCard from './ComparisonResultCard'

export default function ComparisonView({ scenarioA, scenarioB, resultsA, resultsB, updateScenarioA, updateScenarioB, copyAtoB }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Loan Comparison</h2>
          <p className="text-sm text-slate-500">Compare two loan scenarios side by side.</p>
        </div>
        <button
          onClick={copyAtoB}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-600 transition-colors"
        >
          Copy A → B
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <LoanInputPanel
            scenario={scenarioA}
            onUpdate={updateScenarioA}
            results={resultsA}
            accentColor="indigo"
            title="Scenario A"
          />
          <SummaryCard results={resultsA} accentColor="indigo" />
          <PaymentDonutChart results={resultsA} />
        </div>
        <div className="space-y-4">
          <LoanInputPanel
            scenario={scenarioB}
            onUpdate={updateScenarioB}
            results={resultsB}
            accentColor="rose"
            title="Scenario B"
          />
          <SummaryCard results={resultsB} accentColor="rose" />
          <PaymentDonutChart results={resultsB} />
        </div>
      </div>

      <ComparisonResultCard resultsA={resultsA} resultsB={resultsB} />
    </div>
  )
}
