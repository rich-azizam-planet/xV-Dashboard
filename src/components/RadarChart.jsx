export default function RadarChart({ dims }) {
  const CX = 110
  const CY = 110
  const R = 80

  const keys = ['highValueProblem', 'companyAdvantage', 'marketAttractiveness', 'trendAlignment']
  const labels = ['High-value problem', 'Company advantage', 'Market attractiveness', 'Trend alignment']

  function norm(v) {
    return Math.max(0, Math.min(1, (v - 0.1) / 0.2))
  }

  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]

  function pt(i, radius) {
    return [CX + radius * Math.cos(angles[i]), CY + radius * Math.sin(angles[i])]
  }

  const dataPoints = keys.map((k, i) => pt(i, norm(dims[k] ?? 0.1) * R))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'

  const rings = [0.1, 0.2, 0.3]
  const labelOffset = 14

  const labelPos = [
    [CX, CY - R - labelOffset],
    [CX + R + labelOffset, CY],
    [CX, CY + R + labelOffset],
    [CX - R - labelOffset, CY],
  ]

  const labelAnchors = ['middle', 'start', 'middle', 'end']

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" role="img" aria-label="Strategic fit radar chart">
      <title>Strategic fit radar chart</title>

      {rings.map((r, ri) => {
        const ringR = ((r - 0.1) / 0.2) * R
        if (ringR <= 0) return null
        const rpts = keys.map((_, i) => pt(i, ringR))
        const rpath = rpts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z'
        return <path key={ri} d={rpath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      })}

      {keys.map((_, i) => {
        const [x, y] = pt(i, R)
        return <line key={i} x1={CX} y1={CY} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      })}

      <path d={dataPath} fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" />

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p[0].toFixed(1)} cy={p[1].toFixed(1)} r="4" fill="#6366f1" />
      ))}

      {labels.map((label, i) => {
        const [lx, ly] = labelPos[i]
        const words = label.split(' ')
        const lineH = 11
        const totalH = words.length * lineH
        const startY = i === 2 ? ly + 4 : i === 0 ? ly - totalH + 10 : ly - totalH / 2 + 6
        return (
          <text key={i} textAnchor={labelAnchors[i]} fontSize="9.5" fill="#9ca3af">
            {words.map((w, wi) => (
              <tspan key={wi} x={lx.toFixed(1)} y={(startY + wi * lineH).toFixed(1)}>{w}</tspan>
            ))}
          </text>
        )
      })}

      {rings.map((r, ri) => {
        const ringR = ((r - 0.1) / 0.2) * R
        if (ringR <= 0) return null
        return (
          <text key={ri} x={(CX + 3).toFixed(1)} y={(CY - ringR + 3).toFixed(1)} fontSize="8" fill="rgba(255,255,255,0.2)">{r.toFixed(1)}</text>
        )
      })}
    </svg>
  )
}
