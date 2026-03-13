const TABS = [
  { id: 'calculator', label: 'Calculator' },
  { id: 'comparison', label: 'Compare Loans' },
]

export default function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-6 w-full max-w-md">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
