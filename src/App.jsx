import { useState } from 'react'
import { useInitiatives } from './hooks/useInitiatives'
import PortfolioOverview from './components/PortfolioOverview'
import InitiativeCard from './components/InitiativeCard'
import InitiativeForm from './components/InitiativeForm'
import InitiativeEdit from './components/InitiativeEdit'
import { Plus, LayoutDashboard, List, AlertTriangle } from 'lucide-react'

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 p-12 text-center">
      <p className="text-gray-500 text-sm">No initiatives yet.</p>
      <button
        onClick={onAdd}
        className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
      >
        Add your first initiative
      </button>
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 h-full w-full max-w-lg bg-[#0f0f13] border-l border-white/8 overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const { initiatives, addInitiative, updateInitiative, deleteInitiative } = useInitiatives()
  const [view, setView] = useState('overview')
  const [modal, setModal] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [saveError, setSaveError] = useState(false)

  const editingInitiative = editingId ? initiatives.find(i => i.id === editingId) : null

  function handleSave(data) {
    try {
      if (modal?.initiative) {
        updateInitiative(modal.initiative.id, data)
      } else {
        addInitiative(data)
      }
      setModal(null)
      setSaveError(false)
    } catch {
      setSaveError(true)
    }
  }

  function handleEditSave(data) {
    try {
      updateInitiative(editingId, data)
      setEditingId(null)
      setSaveError(false)
    } catch {
      setSaveError(true)
    }
  }

  if (editingInitiative) {
    return (
      <InitiativeEdit
        initiative={editingInitiative}
        onSave={handleEditSave}
        onCancel={() => setEditingId(null)}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f13]">
      <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0f0f13]/90 backdrop-blur-sm z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">xV</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-none">Expected Value Dashboard</h1>
            <p className="text-gray-500 text-xs mt-0.5">Simon Hill's xV Framework</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/8 p-0.5 bg-white/5">
            <button
              onClick={() => setView('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === 'overview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutDashboard size={13} />
              Overview
            </button>
            <button
              onClick={() => setView('initiatives')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === 'initiatives' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={13} />
              Initiatives
            </button>
          </div>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            <Plus size={14} />
            Add Initiative
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
        {saveError && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertTriangle size={16} className="shrink-0" />
            Storage quota exceeded — your changes could not be saved. Try deleting unused initiatives to free space.
            <button onClick={() => setSaveError(false)} className="ml-auto text-red-400/60 hover:text-red-400">✕</button>
          </div>
        )}

        {view === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Portfolio Overview</h2>
              <p className="text-gray-500 text-sm mt-1">
                xV = Confidence × Predicted Value × Time Sensitivity × Strategic Fit
              </p>
            </div>
            {initiatives.length === 0
              ? <EmptyState onAdd={() => setModal('new')} />
              : <PortfolioOverview initiatives={initiatives} />
            }
          </div>
        )}

        {view === 'initiatives' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Initiatives</h2>
              <p className="text-gray-500 text-sm mt-1">{initiatives.length} in portfolio</p>
            </div>
            {initiatives.length === 0 ? (
              <EmptyState onAdd={() => setModal('new')} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initiatives.map(i => (
                  <InitiativeCard
                    key={i.id}
                    initiative={i}
                    onClick={() => setEditingId(i.id)}
                    onDelete={deleteInitiative}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <InitiativeForm
            initial={modal?.initiative || null}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
