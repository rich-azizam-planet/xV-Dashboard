export default function ScoringSlider({ label, value, min = 0, max = 1, step = 0.1, onChange, description }) {
  const pct = ((value - min) / (max - min)) * 100
  const color = value >= 0.6 * max ? '#6366f1' : value >= 0.3 * max ? '#8b5cf6' : '#475569'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-200">{label}</label>
        <span className="text-sm font-mono font-semibold text-indigo-300">{value.toFixed(1)}</span>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <div className="relative h-2 rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full pointer-events-none"
          style={{ width: `${pct}%`, background: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
