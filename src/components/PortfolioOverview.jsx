import { calcXV, calcConfidence, calcStrategicFit, formatXV } from '../data/initiatives'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{label}</p>
      <p className={`text-3xl font-semibold tracking-tight ${accent || 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

function XVBar({ initiative }) {
  const xv = calcXV(initiative)
  const confidence = calcConfidence(initiative.confidence)
  const sf = calcStrategicFit(initiative.strategicFit)

  const barColor = confidence >= 0.6 ? '#6366f1' : confidence >= 0.3 ? '#8b5cf6' : '#475569'

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <div className="w-36 truncate text-sm text-gray-200 font-medium">{initiative.name}</div>
      <div className="flex-1 h-1.5 rounded-full bg-white/8 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(confidence * 100, 100)}%`, background: barColor }}
        />
      </div>
      <div className="w-16 text-right text-xs text-gray-400">{(confidence * 100).toFixed(0)}% conf</div>
      <div className="w-20 text-right text-sm font-mono font-semibold text-indigo-300">
        {formatXV(xv)} xV
      </div>
    </div>
  )
}

export default function PortfolioOverview({ initiatives }) {
  if (!initiatives.length) return null

  const scored = initiatives.map(i => ({ initiative: i, xv: calcXV(i) }))
  const totalXV = scored.reduce((a, s) => a + s.xv, 0)
  const avgConf = initiatives.reduce((a, i) => a + calcConfidence(i.confidence ?? {}), 0) / initiatives.length
  const totalInvestment = initiatives.reduce((a, i) => a + (i.investment || 0), 0)
  const costPerXV = totalInvestment && totalXV ? (totalInvestment / 1000000) / totalXV : null

  const sorted = [...scored].sort((a, b) => b.xv - a.xv)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Initiatives" value={initiatives.length} sub="in portfolio" />
        <StatCard label="Total xV" value={formatXV(totalXV)} sub="expected value score" accent="text-indigo-300" />
        <StatCard label="Avg Confidence" value={`${(avgConf * 100).toFixed(0)}%`} sub="across all initiatives" accent={avgConf >= 0.5 ? 'text-emerald-400' : 'text-amber-400'} />
        <StatCard
          label="Cost / xV"
          value={costPerXV ? `$${costPerXV.toFixed(2)}m` : '—'}
          sub="investment efficiency"
          accent="text-sky-400"
        />
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
        <h3 className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Portfolio Ranking by xV</h3>
        {sorted.map(({ initiative: i }) => <XVBar key={i.id} initiative={i} />)}
      </div>
    </div>
  )
}
