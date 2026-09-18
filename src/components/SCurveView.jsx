import { useState } from 'react'
import { calcXV, calcConfidence, formatXV, formatCurrency } from '../data/initiatives'

const STAGE_ORDER = ['Discovery', 'Ideation', 'Validation', 'Pilot', 'Scale']

// S-curve Y position for each stage (0–1), roughly sigmoid
const STAGE_CURVE_Y = {
  Discovery: 0.08,
  Ideation: 0.18,
  Validation: 0.42,
  Pilot: 0.72,
  Scale: 0.92,
}

const STAGE_COLORS = {
  Discovery: '#475569',
  Ideation: '#6366f1',
  Validation: '#8b5cf6',
  Pilot: '#3b82f6',
  Scale: '#22c55e',
}

const QUADRANT_LABELS = [
  { label: 'SCALE', sub: 'High xV · Low cost', x: '28%', y: '12%', color: '#22c55e' },
  { label: 'WATCH', sub: 'High xV · High cost', x: '72%', y: '12%', color: '#f59e0b' },
  { label: 'QUESTION', sub: 'Low xV · Low cost', x: '28%', y: '82%', color: '#a855f7' },
  { label: 'KILL', sub: 'Low xV · High cost', x: '72%', y: '82%', color: '#ef4444' },
]

function Tooltip({ initiative, xv, confidence, x, y, visible }) {
  if (!visible) return null
  return (
    <div
      className="absolute z-30 pointer-events-none bg-[#1a1a2e] border border-white/12 rounded-xl px-4 py-3 shadow-xl text-xs"
      style={{ left: x + 12, top: y - 40, minWidth: 180 }}
    >
      <p className="font-semibold text-white text-sm mb-1">{initiative.name}</p>
      <p className="text-gray-400">{initiative.stage} · {initiative.owner || 'No owner'}</p>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
        <span className="text-gray-500">xV</span><span className="text-indigo-300 font-mono">{formatXV(xv)}</span>
        <span className="text-gray-500">Confidence</span><span className="text-white font-mono">{(confidence * 100).toFixed(0)}%</span>
        <span className="text-gray-500">Investment</span><span className="text-white font-mono">{initiative.investment ? formatCurrency(initiative.investment) : '—'}</span>
      </div>
    </div>
  )
}

export default function SCurveView({ initiatives, onEdit }) {
  const CHART_W = 900
  const CHART_H = 480
  const PAD = { t: 40, r: 40, b: 60, l: 60 }
  const plotW = CHART_W - PAD.l - PAD.r
  const plotH = CHART_H - PAD.t - PAD.b

  if (!initiatives.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/12 p-12 text-center">
        <p className="text-gray-500 text-sm">No initiatives to plot. Add some first.</p>
      </div>
    )
  }

  const scored = initiatives.map(i => ({
    initiative: i,
    xv: calcXV(i),
    confidence: calcConfidence(i.confidence ?? {}),
  }))

  const maxXV = Math.max(...scored.map(s => s.xv), 1)

  // S-curve path (Discovery → Scale)
  const curvePoints = STAGE_ORDER.map((stage, si) => {
    const xFrac = (si + 0.5) / STAGE_ORDER.length
    const yFrac = 1 - STAGE_CURVE_Y[stage]
    return [PAD.l + xFrac * plotW, PAD.t + yFrac * plotH]
  })

  // Build smooth path with cubic bezier
  function smoothPath(pts) {
    if (pts.length < 2) return ''
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const cpx = (prev[0] + curr[0]) / 2
      d += ` C ${cpx} ${prev[1]}, ${cpx} ${curr[1]}, ${curr[0]} ${curr[1]}`
    }
    return d
  }

  // Bubble positions: x by stage, y by xV score, radius by investment
  const MAX_R = 32
  const MIN_R = 8
  const maxInv = Math.max(...initiatives.map(i => i.investment || 0), 1)

  const bubbles = scored.map(({ initiative: i, xv, confidence }) => {
    const si = STAGE_ORDER.indexOf(i.stage)
    const stageX = si >= 0 ? (si + 0.5) / STAGE_ORDER.length : 0.5
    // Jitter x slightly to avoid perfect overlap on same stage
    const seed = i.id.charCodeAt(0) / 255
    const jitterX = (seed - 0.5) * 0.12
    const xFrac = Math.max(0.02, Math.min(0.98, stageX + jitterX))
    const yFrac = 1 - Math.max(0.02, Math.min(0.95, xv / maxXV))
    const r = i.investment
      ? MIN_R + ((i.investment / maxInv) ** 0.5) * (MAX_R - MIN_R)
      : MIN_R + 4
    return {
      initiative: i, xv, confidence,
      cx: PAD.l + xFrac * plotW,
      cy: PAD.t + yFrac * plotH,
      r,
      color: STAGE_COLORS[i.stage] ?? '#6366f1',
    }
  })

  const [hovered, setHovered] = useState(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Innovation S-Curve</h2>
        <p className="text-gray-500 text-sm mt-1">
          Initiatives plotted by stage and xV score — bubble size reflects investment
        </p>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/8 p-6 overflow-x-auto">
        <div className="relative" style={{ width: CHART_W, height: CHART_H }}>
          <svg width={CHART_W} height={CHART_H} className="absolute inset-0">
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(f => (
              <line key={f}
                x1={PAD.l} y1={PAD.t + f * plotH}
                x2={PAD.l + plotW} y2={PAD.t + f * plotH}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1"
              />
            ))}
            {STAGE_ORDER.map((_, si) => {
              const x = PAD.l + ((si + 0.5) / STAGE_ORDER.length) * plotW
              return (
                <line key={si}
                  x1={x} y1={PAD.t}
                  x2={x} y2={PAD.t + plotH}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4"
                />
              )
            })}

            {/* S-curve reference line */}
            <path
              d={smoothPath(curvePoints)}
              fill="none"
              stroke="rgba(99,102,241,0.18)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Axes */}
            <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1={PAD.l} y1={PAD.t + plotH} x2={PAD.l + plotW} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

            {/* Y-axis label */}
            <text transform={`translate(16, ${PAD.t + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill="#6b7280">xV Score</text>

            {/* Stage labels on x-axis */}
            {STAGE_ORDER.map((stage, si) => {
              const x = PAD.l + ((si + 0.5) / STAGE_ORDER.length) * plotW
              return (
                <text key={si} x={x} y={PAD.t + plotH + 22} textAnchor="middle" fontSize="11" fill={STAGE_COLORS[stage]}>
                  {stage}
                </text>
              )
            })}

            {/* Y-axis ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map(f => (
              <text key={f} x={PAD.l - 8} y={PAD.t + (1 - f) * plotH + 4} textAnchor="end" fontSize="10" fill="#4b5563">
                {(f * 100).toFixed(0)}%
              </text>
            ))}

            {/* Bubbles */}
            {bubbles.map(({ initiative: i, cx, cy, r, color, xv, confidence }) => (
              <g key={i.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => setHovered({ initiative: i, xv, confidence, x: cx, y: cy })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onEdit(i.id)}
              >
                <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5" />
                {r > 14 && (
                  <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="600"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {i.name.length > 8 ? i.name.slice(0, 7) + '…' : i.name}
                  </text>
                )}
              </g>
            ))}
          </svg>

          {hovered && (
            <Tooltip
              initiative={hovered.initiative}
              xv={hovered.xv}
              confidence={hovered.confidence}
              x={hovered.x}
              y={hovered.y}
              visible={true}
            />
          )}
        </div>
      </div>

      {/* Stage legend */}
      <div className="flex gap-4 flex-wrap">
        {STAGE_ORDER.map(s => (
          <div key={s} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: STAGE_COLORS[s] }} />
            <span className="text-xs text-gray-400">{s}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-4">
          <span className="w-2 h-2 rounded-full bg-gray-500 opacity-40 border border-gray-500" />
          <span className="text-xs text-gray-600">Bubble size = investment</span>
        </div>
      </div>

      {/* Portfolio map */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Portfolio Decisions</h3>
        <div className="grid grid-cols-2 gap-3 max-w-lg">
          {QUADRANT_LABELS.map(q => (
            <div key={q.label} className="rounded-xl border border-white/8 bg-white/4 p-4">
              <p className="font-semibold text-sm" style={{ color: q.color }}>{q.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{q.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Use these quadrants to frame portfolio decisions — compare xV score against total investment to decide: Scale, Watch, Question, or Kill.
        </p>
      </div>

      {/* Ranked list */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
        <h3 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Ranked by xV</h3>
        {[...scored].sort((a, b) => b.xv - a.xv).map(({ initiative: i, xv, confidence }) => {
          const pct = maxXV > 0 ? (xv / maxXV) * 100 : 0
          return (
            <div key={i.id}
              className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onEdit(i.id)}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: STAGE_COLORS[i.stage] ?? '#6366f1' }} />
              <div className="w-36 truncate text-sm text-gray-200 font-medium">{i.name}</div>
              <div className="w-20 text-xs text-gray-500">{i.stage}</div>
              <div className="flex-1 h-1.5 rounded-full bg-white/8 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full rounded-full bg-indigo-500 transition-all duration-700"
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="w-24 text-right text-sm font-mono font-semibold text-indigo-300">{formatXV(xv)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
