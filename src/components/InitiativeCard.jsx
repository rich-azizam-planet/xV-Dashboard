import { calcXV, calcConfidence, calcStrategicFit, formatXV, VALUE_TIERS } from '../data/initiatives'
import { Trash2, ChevronRight } from 'lucide-react'

const STAGE_COLORS = {
  Discovery: 'bg-slate-700 text-slate-200',
  Ideation: 'bg-violet-900/60 text-violet-300',
  Validation: 'bg-blue-900/60 text-blue-300',
  Pilot: 'bg-emerald-900/60 text-emerald-300',
  Scale: 'bg-amber-900/60 text-amber-300',
}

function ConfidencePip({ value }) {
  const pct = value * 100
  const color = value >= 0.6 ? '#34d399' : value >= 0.3 ? '#fbbf24' : '#64748b'
  return (
    <div className="w-full h-1 rounded-full bg-white/8 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export default function InitiativeCard({ initiative, onClick, onDelete }) {
  const xv = calcXV(initiative)
  const confidence = calcConfidence(initiative.confidence)
  const sf = calcStrategicFit(initiative.strategicFit)
  const valueTier = VALUE_TIERS.find(t => t.label === initiative.predictedValueTier)

  return (
    <div
      className="group rounded-2xl bg-white/5 border border-white/8 p-5 cursor-pointer hover:bg-white/8 hover:border-indigo-500/40 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[initiative.stage] || 'bg-gray-800 text-gray-300'}`}>
              {initiative.stage}
            </span>
            <span className="text-xs text-gray-500">{initiative.owner}</span>
          </div>
          <h3 className="text-white font-semibold text-base truncate">{initiative.name}</h3>
          {initiative.description && (
            <p className="text-gray-500 text-xs mt-0.5 truncate">{initiative.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-3 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onDelete(initiative.id) }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
          >
            <Trash2 size={14} />
          </button>
          <ChevronRight size={16} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Confidence</p>
          <p className="text-lg font-semibold text-white">{(confidence * 100).toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Value Tier</p>
          <p className="text-lg font-semibold" style={{ color: valueTier?.color || '#9ca3af' }}>
            {initiative.predictedValueTier}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Time</p>
          <p className="text-lg font-semibold text-white">{(initiative.timeSensitivity ?? 1.0).toFixed(1)}×</p>
        </div>
      </div>

      <ConfidencePip value={confidence} />

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Fit:</span>
          <span className="text-xs font-medium text-gray-300">{sf.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">xV:</span>
          <span className="text-sm font-mono font-bold text-indigo-300">{formatXV(xv)}</span>
        </div>
      </div>
    </div>
  )
}
