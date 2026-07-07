import { useState } from 'react'
import {
  CONFIDENCE_DIMENSIONS,
  STRATEGIC_FIT_DIMENSIONS,
  VALUE_TIERS,
  calcXV,
  calcConfidence,
  calcStrategicFit,
  formatXV,
} from '../data/initiatives'
import ScoringSlider from './ScoringSlider'
import RadarChart from './RadarChart'
import { ArrowLeft, Save } from 'lucide-react'

const STAGES = ['Discovery', 'Ideation', 'Validation', 'Pilot', 'Scale']

const TIME_PRESETS = [
  { v: 0.8, label: 'Delay' },
  { v: 1.0, label: 'Neutral' },
  { v: 1.2, label: 'Urgent' },
  { v: 1.4, label: 'High' },
  { v: 1.5, label: 'Critical' },
]

function EvidenceField({ value, onChange, placeholder = 'What evidence supports this score?' }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full mt-1.5 rounded-lg bg-white/4 border border-white/8 px-3 py-2 text-xs text-gray-400 placeholder-gray-700 focus:outline-none focus:border-indigo-500/40 resize-none transition-colors"
    />
  )
}

function DimSlider({ label, value, min, max, step, onChange, evidence, onEvidence }) {
  return (
    <div className="mb-4">
      <ScoringSlider label={label} value={value} min={min} max={max} step={step} onChange={onChange} />
      <EvidenceField value={evidence} onChange={onEvidence} />
    </div>
  )
}

function SectionCard({ step, title, badge, children }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/6 bg-white/3">
        {step && (
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {step}
          </div>
        )}
        <h2 className="text-sm font-semibold text-gray-200">{title}</h2>
        {badge && <span className="ml-auto text-xs font-mono text-indigo-300">{badge}</span>}
      </div>
      <div className="px-5 py-4 flex-1">{children}</div>
    </div>
  )
}

export default function InitiativeEdit({ initiative, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initiative })

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setNested(parent, key, value) {
    setForm(f => ({ ...f, [parent]: { ...f[parent], [key]: value } }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const investment = Math.max(0, Math.min(999999999, parseFloat(form.investment) || 0))
    onSave({ ...form, investment })
  }

  const xv = calcXV(form)
  const confidence = calcConfidence(form.confidence ?? {})
  const sf = calcStrategicFit(form.strategicFit ?? {})

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      <header className="border-b border-white/8 px-6 py-4 flex items-center gap-4 sticky top-0 bg-[#0f0f13]/90 backdrop-blur-sm z-40">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="h-5 w-px bg-white/10" />
        <div>
          <h1 className="text-white font-semibold text-sm leading-none">{form.name || 'Untitled initiative'}</h1>
          <p className="text-gray-500 text-xs mt-0.5">{form.stage} · {form.owner || 'No owner'}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-white/12 text-sm text-gray-400 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            <Save size={14} />
            Save changes
          </button>
        </div>
      </header>

      {/* xV summary bar */}
      <div className="border-b border-white/6 bg-indigo-950/30 px-6 py-3 flex items-center gap-6">
        {[
          { label: 'Confidence', value: `${(confidence * 100).toFixed(0)}%` },
          { label: 'Predicted value', value: form.predictedValue ? `$${Number(form.predictedValue).toLocaleString()}` : form.predictedValueTier },
          { label: 'Time ×', value: (form.timeSensitivity ?? 1.0).toFixed(1) },
          { label: 'Strategic fit', value: sf.toFixed(2) },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            <div>
              <p className="text-xs text-gray-500">{m.label}</p>
              <p className="text-sm font-semibold text-white">{m.value}</p>
            </div>
            <div className="h-8 w-px bg-white/8" />
          </div>
        ))}
        <div>
          <p className="text-xs text-gray-500">xV score</p>
          <p className="text-sm font-semibold text-indigo-300">{formatXV(xv)}</p>
        </div>
        <p className="ml-auto text-xs font-mono text-gray-600 hidden lg:block">
          xV = {confidence.toFixed(2)} × {form.predictedValue ? `$${Number(form.predictedValue).toLocaleString()}` : form.predictedValueTier} × {(form.timeSensitivity ?? 1.0).toFixed(1)} × {sf.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-3 gap-5">

          {/* ── Column 1: Confidence ── */}
          <SectionCard step="1" title="Confidence" badge={`Avg ${(confidence * 100).toFixed(0)}%`}>
            <p className="text-xs text-gray-600 mb-4">Score 0.1 (assumed) → 1.0 (proven at scale). Add evidence below each dimension.</p>
            {CONFIDENCE_DIMENSIONS.map(d => (
              <DimSlider
                key={d.key}
                label={d.label}
                value={form.confidence?.[d.key] ?? 0.1}
                min={0.1}
                max={1.0}
                step={0.1}
                onChange={v => setNested('confidence', d.key, v)}
                evidence={form.confidenceEvidence?.[d.key] ?? ''}
                onEvidence={v => setNested('confidenceEvidence', d.key, v)}
              />
            ))}
          </SectionCard>

          {/* ── Column 2: Predicted Value + Time Sensitivity ── */}
          <div className="flex flex-col gap-5">
            <SectionCard step="2" title="Predicted value">
              <p className="text-xs text-gray-600 mb-3">Select the value tier using the Rule of 10 estimation.</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {VALUE_TIERS.map(t => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => set('predictedValueTier', t.label)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      form.predictedValueTier === t.label
                        ? 'border-indigo-500/60 bg-indigo-500/15'
                        : 'border-white/8 bg-white/4 hover:bg-white/8'
                    }`}
                  >
                    <p className="font-semibold text-sm" style={{ color: t.color }}>{t.label}</p>
                    <p className="text-xs text-gray-500">{t.range}</p>
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1.5">Predicted value ($)</label>
                <input
                  type="number"
                  min="0"
                  max="999999999999"
                  value={form.predictedValue ?? ''}
                  onChange={e => set('predictedValue', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                  placeholder="e.g. 50000000"
                  className="w-full rounded-lg bg-white/4 border border-white/8 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                />
                <p className="text-xs text-gray-700 mt-1">Specific dollar estimate — overrides the tier midpoint</p>
              </div>
              <label className="block text-xs text-gray-500 mb-1.5">Key assumptions &amp; evidence</label>
              <textarea
                value={form.assumptions ?? ''}
                onChange={e => set('assumptions', e.target.value)}
                rows={4}
                placeholder="Document the assumptions behind your value estimate..."
                className="w-full rounded-lg bg-white/4 border border-white/8 px-3 py-2 text-xs text-gray-400 placeholder-gray-700 focus:outline-none focus:border-indigo-500/40 resize-none transition-colors"
              />
            </SectionCard>

            <SectionCard step="3" title="Time sensitivity" badge={`${(form.timeSensitivity ?? 1.0).toFixed(1)}×`}>
              <p className="text-xs text-gray-600 mb-4">0.7 = strategic delay · 1.0 = neutral · 1.5 = act now or lose opportunity</p>
              <ScoringSlider
                label="Time sensitivity multiplier"
                value={form.timeSensitivity ?? 1.0}
                min={0.7}
                max={1.5}
                step={0.1}
                onChange={v => set('timeSensitivity', v)}
              />
              <div className="flex gap-1.5 flex-wrap mt-3 mb-4">
                {TIME_PRESETS.map(({ v, label }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set('timeSensitivity', v)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                      form.timeSensitivity === v
                        ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                        : 'border-white/8 text-gray-600 hover:bg-white/5'
                    }`}
                  >
                    {v}× {label}
                  </button>
                ))}
              </div>
              <label className="block text-xs text-gray-500 mb-1.5">Evidence &amp; rationale</label>
              <EvidenceField
                value={form.timeSensitivityEvidence ?? ''}
                onChange={v => set('timeSensitivityEvidence', v)}
                placeholder="Why is timing scored this way?"
              />
            </SectionCard>
          </div>

          {/* ── Column 3: Strategic Fit + Radar ── */}
          <SectionCard step="4" title="Strategic fit" badge={`Total ${sf.toFixed(2)}`}>
            <p className="text-xs text-gray-600 mb-4">Score each dimension 0.1 (weak) · 0.2 (moderate) · 0.3 (strong)</p>
            {STRATEGIC_FIT_DIMENSIONS.map(d => (
              <DimSlider
                key={d.key}
                label={d.label}
                value={form.strategicFit?.[d.key] ?? 0.1}
                min={0.1}
                max={0.3}
                step={0.1}
                onChange={v => setNested('strategicFit', d.key, v)}
                evidence={form.strategicFitEvidence?.[d.key] ?? ''}
                onEvidence={v => setNested('strategicFitEvidence', d.key, v)}
              />
            ))}
            <div className="mt-2 pt-4 border-t border-white/6 flex justify-center">
              <RadarChart dims={form.strategicFit ?? {}} />
            </div>
          </SectionCard>

        </div>

        {/* ── Basic details ── */}
        <div className="mt-5 rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
          <div className="flex items-center px-5 py-3.5 border-b border-white/6 bg-white/3">
            <h2 className="text-sm font-semibold text-gray-200">Basic details</h2>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Initiative name *</label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full rounded-lg bg-white/6 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Description</label>
              <input
                value={form.description ?? ''}
                onChange={e => set('description', e.target.value)}
                className="w-full rounded-lg bg-white/6 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Owner / team</label>
              <input
                value={form.owner ?? ''}
                onChange={e => set('owner', e.target.value)}
                className="w-full rounded-lg bg-white/6 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Stage</label>
              <select
                value={form.stage}
                onChange={e => set('stage', e.target.value)}
                className="w-full rounded-lg bg-white/6 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
              >
                {STAGES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Investment ($)</label>
              <input
                type="number"
                min="0"
                max="999999999"
                value={form.investment ?? ''}
                onChange={e => set('investment', e.target.value)}
                className="w-full rounded-lg bg-white/6 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
