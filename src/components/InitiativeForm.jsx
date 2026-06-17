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
import { X, ChevronDown, ChevronUp } from 'lucide-react'

const STAGES = ['Discovery', 'Ideation', 'Validation', 'Pilot', 'Scale']

const EMPTY = {
  name: '',
  description: '',
  owner: '',
  stage: 'Discovery',
  investment: '',
  confidence: Object.fromEntries(CONFIDENCE_DIMENSIONS.map(d => [d.key, 0.1])),
  predictedValueTier: 'Medium',
  timeSensitivity: 1.0,
  strategicFit: Object.fromEntries(STRATEGIC_FIT_DIMENSIONS.map(d => [d.key, 0.1])),
  assumptions: '',
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white/5 hover:bg-white/8 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-gray-200">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      {open && <div className="px-5 py-4 space-y-4">{children}</div>}
    </div>
  )
}

function XVPreview({ form }) {
  const preview = { ...form, investment: parseFloat(form.investment) || 0 }
  const xv = calcXV(preview)
  const conf = calcConfidence(preview.confidence)
  const sf = calcStrategicFit(preview.strategicFit)

  return (
    <div className="rounded-xl bg-indigo-950/50 border border-indigo-500/30 p-4">
      <p className="text-xs text-indigo-400 uppercase tracking-widest font-medium mb-3">xV Preview</p>
      <div className="grid grid-cols-4 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-500 mb-1">Confidence</p>
          <p className="text-xl font-bold text-white">{(conf * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Strategic Fit</p>
          <p className="text-xl font-bold text-white">{sf.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Time ×</p>
          <p className="text-xl font-bold text-white">{preview.timeSensitivity.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">xV Score</p>
          <p className="text-xl font-bold text-indigo-300">{formatXV(xv)}</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-3 text-center font-mono">
        xV = {(conf).toFixed(2)} × {form.predictedValueTier} × {preview.timeSensitivity.toFixed(1)} × {sf.toFixed(2)}
      </p>
    </div>
  )
}

export default function InitiativeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY)

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">{initial ? 'Edit Initiative' : 'New Initiative'}</h2>
        <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-white/8 text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <XVPreview form={form} />

      <Section title="Basic Details">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">Initiative Name *</label>
            <input
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Bid Builder"
              className="w-full rounded-lg bg-white/8 border border-white/12 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <input
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief summary of the initiative"
              className="w-full rounded-lg bg-white/8 border border-white/12 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Owner / Team</label>
            <input
              value={form.owner}
              onChange={e => set('owner', e.target.value)}
              placeholder="e.g. Product"
              className="w-full rounded-lg bg-white/8 border border-white/12 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Stage</label>
            <select
              value={form.stage}
              onChange={e => set('stage', e.target.value)}
              className="w-full rounded-lg bg-white/8 border border-white/12 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
            >
              {STAGES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Investment ($)</label>
            <input
              type="number"
              min="0"
              max="999999999"
              value={form.investment}
              onChange={e => set('investment', e.target.value)}
              placeholder="e.g. 250000"
              className="w-full rounded-lg bg-white/8 border border-white/12 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
        </div>
      </Section>

      <Section title="Step 1 — Confidence">
        <p className="text-xs text-gray-500 -mt-1">Score each dimension 0.1 (assumed) → 1.0 (proven at scale)</p>
        {CONFIDENCE_DIMENSIONS.map(d => (
          <ScoringSlider
            key={d.key}
            label={d.label}
            value={form.confidence[d.key]}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={v => setNested('confidence', d.key, v)}
          />
        ))}
      </Section>

      <Section title="Step 2 — Predicted Value">
        <p className="text-xs text-gray-500 -mt-1">Select the value tier using the Rule of 10 estimation</p>
        <div className="grid grid-cols-2 gap-2">
          {VALUE_TIERS.map(t => (
            <button
              key={t.label}
              type="button"
              onClick={() => set('predictedValueTier', t.label)}
              className={`rounded-xl border p-3 text-left transition-all ${
                form.predictedValueTier === t.label
                  ? 'border-indigo-500/60 bg-indigo-500/15'
                  : 'border-white/8 bg-white/5 hover:bg-white/8'
              }`}
            >
              <p className="font-semibold text-sm" style={{ color: t.color }}>{t.label}</p>
              <p className="text-xs text-gray-500">{t.range}</p>
            </button>
          ))}
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Key Assumptions</label>
          <textarea
            value={form.assumptions}
            onChange={e => set('assumptions', e.target.value)}
            rows={3}
            placeholder="Document the key assumptions behind your value estimate..."
            className="w-full rounded-lg bg-white/8 border border-white/12 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
          />
        </div>
      </Section>

      <Section title="Step 3 — Time Sensitivity">
        <ScoringSlider
          label="Time Sensitivity Multiplier"
          value={form.timeSensitivity}
          min={0.7}
          max={1.5}
          step={0.1}
          onChange={v => set('timeSensitivity', v)}
          description="0.7 = strategic delay adds value · 1.0 = neutral · 1.5 = act now or lose opportunity"
        />
        <div className="grid grid-cols-3 gap-2 mt-1">
          {[
            { v: 0.8, label: 'Delay' },
            { v: 1.0, label: 'Neutral' },
            { v: 1.2, label: 'Urgent' },
            { v: 1.4, label: 'High' },
            { v: 1.5, label: 'Critical' },
          ].map(({ v, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => set('timeSensitivity', v)}
              className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                form.timeSensitivity === v
                  ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                  : 'border-white/8 text-gray-500 hover:bg-white/5'
              }`}
            >
              {v}× {label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Step 4 — Strategic Fit">
        <p className="text-xs text-gray-500 -mt-1">Score each dimension 0.1 (weak) · 0.2 (moderate) · 0.3 (strong)</p>
        {STRATEGIC_FIT_DIMENSIONS.map(d => (
          <ScoringSlider
            key={d.key}
            label={d.label}
            value={form.strategicFit[d.key]}
            min={0.1}
            max={0.3}
            step={0.1}
            onChange={v => setNested('strategicFit', d.key, v)}
            description={d.description}
          />
        ))}
      </Section>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-white/12 text-sm text-gray-400 hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          {initial ? 'Save Changes' : 'Add Initiative'}
        </button>
      </div>
    </form>
  )
}
