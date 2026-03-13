import { useState } from 'react'

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <>
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-400">
            This calculator is for <strong>educational purposes only</strong>. Results are
            estimates and may not reflect actual loan terms. Please contact your lender or
            financial institution for exact rates, fees, and payment amounts.
          </p>
          <p className="text-xs text-slate-400">
            <button
              onClick={() => setShowPrivacy(true)}
              className="underline hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </footer>

      {showPrivacy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 space-y-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold leading-none"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold text-slate-800">Privacy Policy</h2>
            <div className="text-sm text-slate-600 space-y-3">
              <p>This mortgage calculator runs entirely in your browser. We do not collect, store, or transmit any personal or financial data you enter.</p>
              <p>No cookies, analytics, or third-party tracking scripts are used on this site.</p>
              <p>All calculations are performed locally on your device and are never sent to any server.</p>
              <p>If you have any questions, please contact us.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
