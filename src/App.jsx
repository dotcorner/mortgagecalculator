import { useMortgage } from './hooks/useMortgage'
import { generatePdf } from './utils/generatePdf'
import Header from './components/Header'
import Footer from './components/Footer'
import TabBar from './components/TabBar'
import LoanInputPanel from './components/LoanInputPanel'
import PaymentDonutChart from './components/PaymentDonutChart'
import BalanceChart from './components/BalanceChart'
import ComparisonView from './components/ComparisonView'
import PaymentSchedulePanel from './components/PaymentSchedulePanel'

export default function App() {
  const {
    scenarioA, scenarioB,
    resultsA, resultsB,
    updateScenarioA, updateScenarioB,
    copyAtoB,
    activeTab, setActiveTab,
  } = useMortgage()

  return (
    <div className="app-bg min-h-screen">
      <Header onSavePdf={activeTab === 'calculator' ? () => generatePdf(scenarioA, resultsA) : undefined} />
      <main className="max-w-screen-2xl mx-auto px-4 py-6 lg:px-8 lg:py-10">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-6 lg:items-start">
            {/* Panel 1 — 30%: sticky inputs */}
            <div className="lg:sticky lg:top-6">
              <LoanInputPanel
                scenario={scenarioA}
                onUpdate={updateScenarioA}
                results={resultsA}
              />
            </div>

            {/* Panel 2 — 70%: sticky, full-height, flex column */}
            <div className="lg:sticky lg:top-6 flex flex-col gap-4" style={{ height: 'calc(100vh - 5rem)' }}>
              {/* Top section: donut chart + balance chart side by side */}
              <div className="shrink-0 flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-[42%]">
                  <PaymentDonutChart results={resultsA} />
                </div>
                <div className="flex-1">
                  <BalanceChart results={resultsA} scenario={scenarioA} />
                </div>
              </div>
              {/* Bottom section: payment schedule fills remaining height */}
              <div className="flex-1 min-h-0">
                <PaymentSchedulePanel results={resultsA} scenario={scenarioA} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <ComparisonView
            scenarioA={scenarioA}
            scenarioB={scenarioB}
            resultsA={resultsA}
            resultsB={resultsB}
            updateScenarioA={updateScenarioA}
            updateScenarioB={updateScenarioB}
            copyAtoB={copyAtoB}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
