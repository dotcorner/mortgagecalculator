export default function Header({ onSavePdf }) {
  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-screen-2xl mx-auto px-4 py-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent leading-tight">Mortgage Calculator</h1>
            <p className="text-xs text-slate-400 leading-tight">Plan your home purchase with confidence</p>
          </div>
        </div>
        {onSavePdf && (
          <button
            onClick={onSavePdf}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Save to PDF
          </button>
        )}
      </div>
    </header>
  )
}
