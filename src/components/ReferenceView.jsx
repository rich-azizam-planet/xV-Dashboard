import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function Section({ title, accent, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/4 transition-colors text-left"
      >
        <span className="font-semibold text-white text-sm">{title}</span>
        <div className="flex items-center gap-3">
          {accent && <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">{accent}</span>}
          {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-white/6 pt-4">{children}</div>}
    </div>
  )
}

function Row({ label, value, sub, color }) {
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-white/5 last:border-0">
      <div className="w-32 shrink-0">
        <p className="text-xs font-semibold" style={{ color: color || '#a5b4fc' }}>{label}</p>
      </div>
      <div>
        <p className="text-sm text-gray-200">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function Callout({ children }) {
  return (
    <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/20 px-4 py-3 text-sm text-indigo-300">
      {children}
    </div>
  )
}

export default function ReferenceView() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-semibold text-white">xV Framework Reference</h2>
        <p className="text-gray-500 text-sm mt-1">Scoring guidance and definitions for every component of the xV formula</p>
      </div>

      <Callout>
        <span className="font-mono font-semibold">xV = Confidence × Predicted Value × Time Sensitivity × Strategic Fit</span>
        <p className="mt-1 text-xs text-indigo-400/80">
          The multiplication is intentional — a near-zero in any one component collapses the total. xV is only as strong as its weakest factor.
        </p>
      </Callout>

      <Section title="What is xV?" defaultOpen={true}>
        <p className="text-sm text-gray-400 leading-relaxed">
          xV (Expected Value) is a dynamic model for assessing innovation. It replaces gut-feel prioritisation with an evidence-based score that evolves as an initiative matures.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { label: 'Dynamic', desc: 'Values evolve as learning continues — rescore after each experiment or milestone.' },
            { label: 'Evidence-based', desc: 'Beliefs are grounded in validation, not opinion. Document the evidence.' },
            { label: 'Transparent', desc: 'Assumptions are made explicit, not hidden. Others should be able to challenge them.' },
            { label: 'Adaptive', desc: 'The approach changes as initiatives mature and move through stages.' },
          ].map(p => (
            <div key={p.label} className="rounded-xl bg-white/4 border border-white/8 p-3">
              <p className="text-xs font-semibold text-indigo-400 mb-1">{p.label}</p>
              <p className="text-xs text-gray-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step 1 — Confidence" accent="0.1 → 1.0">
        <p className="text-sm text-gray-400 leading-relaxed">
          Confidence is a composite of six dimensions. Score each from <strong className="text-white">0.1</strong> (assumed, no evidence) to <strong className="text-white">1.0</strong> (proven at scale). The average of all six dimensions becomes the Confidence multiplier.
        </p>
        <div className="mt-2">
          {[
            { dim: 'Technical Feasibility', guide: 'Can we build it reliably? Has the core technology been validated in our context?' },
            { dim: 'User Desirability', guide: 'Is there a real, painful, frequent problem? Have users confirmed it exists and they want this solution?' },
            { dim: 'Market Viability', guide: 'Is the market large enough and accessible? Can we win commercially?' },
            { dim: 'Operational Delivery', guide: 'Can we deliver and run this at scale? Do we have the processes and people?' },
            { dim: 'Implementation Readiness', guide: 'Are we ready to move forward? Is the organisation aligned and resourced?' },
            { dim: 'Regulatory Compliance', guide: 'Have we assessed the legal/regulatory risks? Is the path clear or are blockers identified?' },
          ].map(d => (
            <Row key={d.dim} label={d.dim} value={d.guide} />
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-white/4 border border-white/6 overflow-hidden">
          <div className="px-4 py-2 bg-white/3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Confidence Benchmarks</div>
          {[
            { range: '0.1', label: 'Assumed belief', desc: 'No evidence, pure hypothesis' },
            { range: '0.2–0.3', label: 'Gut feel / early signals', desc: 'Informal anecdote, desk research only' },
            { range: '0.4–0.5', label: 'Early indication', desc: 'User interviews or initial prototype feedback' },
            { range: '0.6–0.7', label: 'Validated hypothesis', desc: 'Prototype tested with real users, early data' },
            { range: '0.8–0.9', label: 'Strong evidence', desc: 'Pilot completed, quantitative results available' },
            { range: '1.0', label: 'Proven at scale', desc: 'Repeatable performance in production environment' },
          ].map(b => (
            <div key={b.range} className="flex items-center gap-4 px-4 py-2 border-b border-white/5 last:border-0">
              <span className="w-16 font-mono text-xs text-indigo-400 shrink-0">{b.range}</span>
              <span className="w-40 text-sm text-white shrink-0">{b.label}</span>
              <span className="text-xs text-gray-500">{b.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step 2 — Predicted Value" accent="$ amount">
        <p className="text-sm text-gray-400 leading-relaxed">
          Predicted Value is the monetary upside if this initiative succeeds — typically measured over three years. Enter a specific dollar amount. Use the <strong className="text-white">Rule of 10</strong> to calibrate your estimate if you are uncertain.
        </p>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          The key is <em>directionality</em>, not precision. Understanding whether an initiative represents a $100k, $1m, or $10m opportunity is meaningful even when exact figures are uncertain.
        </p>
        <div className="mt-3 rounded-xl bg-white/4 border border-white/6 overflow-hidden">
          <div className="px-4 py-2 bg-white/3 text-xs font-semibold text-gray-400 uppercase tracking-widest">Rule of 10 — Value Tiers</div>
          {[
            { tier: 'Small', range: '< $1m', hint: 'Efficiency improvement or narrow niche use case' },
            { tier: 'Medium', range: '$1m – $10m', hint: 'Significant departmental or product-level impact' },
            { tier: 'Large', range: '$10m – $100m', hint: 'Business-unit or market-level transformation' },
            { tier: 'XL', range: '> $100m', hint: 'Enterprise-wide or category-defining change' },
          ].map(t => (
            <div key={t.tier} className="flex items-center gap-4 px-4 py-2 border-b border-white/5 last:border-0">
              <span className="w-16 font-mono text-xs text-indigo-400 shrink-0">{t.tier}</span>
              <span className="w-32 text-sm text-white shrink-0">{t.range}</span>
              <span className="text-xs text-gray-500">{t.hint}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Document your key assumptions alongside the value estimate — this makes the basis for your figure challengeable and improvable over time.
        </p>
      </Section>

      <Section title="Step 3 — Time Sensitivity" accent="0.7 → 1.5×">
        <p className="text-sm text-gray-400 leading-relaxed">
          Time Sensitivity is a multiplier that adjusts xV based on the urgency of acting now. It prevents a common trap: high-effort initiatives jumping the queue simply because they are available, rather than because acting now is critical.
        </p>
        <div className="mt-3 rounded-xl bg-white/4 border border-white/6 overflow-hidden">
          {[
            { range: '0.7 – 0.8', label: 'Strategic Delay', desc: 'Waiting improves position. Act in 12+ months.' },
            { range: '0.9 – 1.0', label: 'No Urgency', desc: 'Low competitive pressure. 6–12 month window.' },
            { range: '1.0', label: 'Neutral', desc: 'Standard pace is appropriate. No urgency signal.' },
            { range: '1.1 – 1.2', label: 'Moderate Urgency', desc: 'Market is moving. 3–6 month window.' },
            { range: '1.3 – 1.4', label: 'High Urgency', desc: 'Competitive risk is real. 1–3 month window.' },
            { range: '1.5', label: 'Critical Urgency', desc: 'Act immediately or lose the opportunity permanently.' },
          ].map(t => (
            <div key={t.range} className="flex items-center gap-4 px-4 py-2 border-b border-white/5 last:border-0">
              <span className="w-20 font-mono text-xs text-indigo-400 shrink-0">{t.range}</span>
              <span className="w-36 text-sm text-white shrink-0">{t.label}</span>
              <span className="text-xs text-gray-500">{t.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step 4 — Strategic Fit" accent="0.1 / 0.2 / 0.3">
        <p className="text-sm text-gray-400 leading-relaxed">
          Strategic Fit is the sum of four dimensions, each scored <strong className="text-white">0.1</strong> (weak), <strong className="text-white">0.2</strong> (moderate), or <strong className="text-white">0.3</strong> (strong). Maximum total is 1.2. It captures whether this is the right initiative for this organisation at this moment.
        </p>
        <div className="mt-2">
          {[
            { dim: 'High-Value Problem', guide: '0.3 — Solves a real, painful, frequent problem. 0.2 — Problem exists but is not urgent. 0.1 — Unclear problem definition.' },
            { dim: 'Company Advantage', guide: '0.3 — Unique capability, asset, or distribution gives us a clear edge. 0.2 — Some advantage but not differentiated. 0.1 — No meaningful edge over competitors.' },
            { dim: 'Market Attractiveness', guide: '0.3 — Large, growing, accessible market with favourable dynamics. 0.2 — Moderate market size or growth. 0.1 — Small, declining, or hard to reach.' },
            { dim: 'Trend Alignment', guide: '0.3 — Strong macro trends actively accelerate this opportunity. 0.2 — Trends are supportive but not dominant. 0.1 — Neutral or trend-opposed.' },
          ].map(d => (
            <Row key={d.dim} label={d.dim} value={d.guide} />
          ))}
        </div>
      </Section>

      <Section title="Portfolio Decisions — Scale / Watch / Question / Kill">
        <p className="text-sm text-gray-400 leading-relaxed">
          Once scored, compare your initiatives on two axes — xV score and total investment — to make portfolio decisions:
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: 'SCALE', color: '#22c55e', cond: 'High xV · Low cost', desc: 'These are your best bets. Increase resource allocation and move to the next stage quickly.' },
            { label: 'WATCH', color: '#f59e0b', cond: 'High xV · High cost', desc: 'High potential but expensive. Find ways to reduce cost or de-risk before scaling.' },
            { label: 'QUESTION', color: '#a855f7', cond: 'Low xV · Low cost', desc: 'Cheap to run but low expected return. Re-score, pivot the approach, or retire if no path to higher xV.' },
            { label: 'KILL', color: '#ef4444', cond: 'Low xV · High cost', desc: 'Expensive with poor expected return. Stop and reallocate resources. Justify continuation with hard evidence.' },
          ].map(q => (
            <div key={q.label} className="rounded-xl border border-white/8 bg-white/4 p-4">
              <p className="font-semibold text-sm mb-0.5" style={{ color: q.color }}>{q.label}</p>
              <p className="text-xs text-gray-500 mb-2">{q.cond}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{q.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Efficiency Ratio — xV / Investment">
        <p className="text-sm text-gray-400 leading-relaxed">
          The Efficiency Ratio shows how much expected value each dollar of investment is expected to generate. A ratio of <strong className="text-white">10×</strong> means $1 of investment is expected to return $10 of value.
        </p>
        <div className="mt-2 rounded-xl bg-white/4 border border-white/6 px-4 py-3 font-mono text-sm text-indigo-300">
          Efficiency Ratio = xV ÷ Total Investment
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Use this to compare initiatives on equal footing regardless of absolute size. A $5m initiative with 20× efficiency should rank above a $50m initiative with 3× efficiency.
        </p>
      </Section>

      <div className="rounded-2xl bg-white/4 border border-white/6 px-5 py-4">
        <p className="text-xs text-gray-500">
          Based on Simon Hill's Expected Value framework ·{' '}
          <a href="https://xvbook.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">xvbook.com</a>
        </p>
      </div>
    </div>
  )
}
