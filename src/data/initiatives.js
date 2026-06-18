export const CONFIDENCE_LEVELS = [
  { range: '0.0–0.1', label: 'Assumed belief', description: 'No evidence, pure hypothesis' },
  { range: '0.1–0.2', label: 'Gut feel', description: 'Informal signals, anecdotal' },
  { range: '0.3–0.4', label: 'Early indication', description: 'Some user interviews or desk research' },
  { range: '0.5–0.6', label: 'Validated hypothesis', description: 'Prototype tested, early data' },
  { range: '0.7–0.8', label: 'Strong evidence', description: 'Pilot completed, quantitative results' },
  { range: '0.9–1.0', label: 'Proven and predictable', description: 'At-scale, repeatable performance' },
]

export const VALUE_TIERS = [
  { label: 'Small', range: '<$1m', color: '#6b7280' },
  { label: 'Medium', range: '$1m–$10m', color: '#3b82f6' },
  { label: 'Large', range: '$10m–$100m', color: '#8b5cf6' },
  { label: 'XL', range: '>$100m', color: '#f59e0b' },
]

export const VALUE_TIER_MIDPOINTS = {
  Small: 500000,
  Medium: 5000000,
  Large: 50000000,
  XL: 100000000,
}

export const TIME_SENSITIVITY_TIERS = [
  { range: '0.7–0.8', label: 'Strategic Delay', description: 'Waiting improves position; act in 12+ months' },
  { range: '0.9–1.0', label: 'No Urgency', description: 'Low competitive pressure; 6–12 months window' },
  { range: '1.0', label: 'Neutral', description: 'Standard pace appropriate' },
  { range: '1.1–1.2', label: 'Moderate Urgency', description: 'Market moving; 3–6 month window' },
  { range: '1.3–1.4', label: 'High Urgency', description: 'Competitive risk; 1–3 month window' },
  { range: '1.5', label: 'Critical Urgency', description: 'Act immediately or lose the opportunity' },
]

export const STRATEGIC_FIT_DIMENSIONS = [
  { key: 'highValueProblem', label: 'High-Value Problem', description: 'Does this solve a real, painful, frequent problem?' },
  { key: 'companyAdvantage', label: 'Company Advantage', description: 'Do we have unique capability or assets to win here?' },
  { key: 'marketAttractiveness', label: 'Market Attractiveness', description: 'Is the market large, growing and accessible?' },
  { key: 'trendAlignment', label: 'Trend Alignment', description: 'Are macro trends accelerating this opportunity?' },
]

export const CONFIDENCE_DIMENSIONS = [
  { key: 'technicalFeasibility', label: 'Technical Feasibility' },
  { key: 'userDesirability', label: 'User Desirability' },
  { key: 'marketViability', label: 'Market Viability' },
  { key: 'operationalDelivery', label: 'Operational Delivery' },
  { key: 'implementationReadiness', label: 'Implementation Readiness' },
  { key: 'regulatoryCompliance', label: 'Regulatory Compliance' },
]

const EMPTY_CONFIDENCE_EVIDENCE = () =>
  Object.fromEntries(CONFIDENCE_DIMENSIONS.map(d => [d.key, '']))

const EMPTY_STRATEGIC_FIT_EVIDENCE = () =>
  Object.fromEntries(STRATEGIC_FIT_DIMENSIONS.map(d => [d.key, '']))

export const SEED_INITIATIVES = [
  {
    id: '1',
    name: 'Cards Platform',
    description: 'Digital card issuance and management platform',
    owner: 'Product',
    stage: 'Validation',
    investment: 250000,
    confidence: {
      technicalFeasibility: 0.4,
      userDesirability: 0.3,
      marketViability: 0.3,
      operationalDelivery: 0.2,
      implementationReadiness: 0.2,
      regulatoryCompliance: 0.1,
    },
    confidenceEvidence: {
      technicalFeasibility: 'API prototype tested in sandbox. 3rd party SDK evaluation complete.',
      userDesirability: '8 user interviews conducted. Pain point validated.',
      marketViability: '',
      operationalDelivery: '',
      implementationReadiness: '',
      regulatoryCompliance: '',
    },
    predictedValueTier: 'Large',
    assumptions: 'Assumes regulatory approval within 6 months. Value estimate based on 3% market penetration.',
    timeSensitivity: 1.2,
    timeSensitivityEvidence: 'Competitor launched similar product in Q4. Window to capture early adopters closing.',
    strategicFit: {
      highValueProblem: 0.3,
      companyAdvantage: 0.2,
      marketAttractiveness: 0.3,
      trendAlignment: 0.2,
    },
    strategicFitEvidence: {
      highValueProblem: 'Manual card management costs ops team ~15hrs/week. Flagged in 2025 ops review.',
      companyAdvantage: '',
      marketAttractiveness: '',
      trendAlignment: '',
    },
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'HR Agent',
    description: 'AI-powered agent for HR query resolution and onboarding',
    owner: 'HR Tech',
    stage: 'Ideation',
    investment: 80000,
    confidence: {
      technicalFeasibility: 0.3,
      userDesirability: 0.2,
      marketViability: 0.2,
      operationalDelivery: 0.1,
      implementationReadiness: 0.1,
      regulatoryCompliance: 0.2,
    },
    confidenceEvidence: EMPTY_CONFIDENCE_EVIDENCE(),
    predictedValueTier: 'Medium',
    assumptions: 'Assumes LLM API costs stay below $0.01/query. Targets 500 HR queries/day.',
    timeSensitivity: 1.1,
    timeSensitivityEvidence: '',
    strategicFit: {
      highValueProblem: 0.2,
      companyAdvantage: 0.2,
      marketAttractiveness: 0.2,
      trendAlignment: 0.3,
    },
    strategicFitEvidence: EMPTY_STRATEGIC_FIT_EVIDENCE(),
    createdAt: '2026-02-01',
  },
  {
    id: '3',
    name: 'Bid Builder',
    description: 'Automated bid generation and pricing optimisation tool',
    owner: 'Commercial',
    stage: 'Discovery',
    investment: 120000,
    confidence: {
      technicalFeasibility: 0.2,
      userDesirability: 0.3,
      marketViability: 0.2,
      operationalDelivery: 0.1,
      implementationReadiness: 0.1,
      regulatoryCompliance: 0.1,
    },
    confidenceEvidence: EMPTY_CONFIDENCE_EVIDENCE(),
    predictedValueTier: 'Medium',
    assumptions: 'Win-rate improvement of 5-8% based on competitor benchmarks. Assumes integration with CRM.',
    timeSensitivity: 1.3,
    timeSensitivityEvidence: '',
    strategicFit: {
      highValueProblem: 0.3,
      companyAdvantage: 0.3,
      marketAttractiveness: 0.2,
      trendAlignment: 0.2,
    },
    strategicFitEvidence: EMPTY_STRATEGIC_FIT_EVIDENCE(),
    createdAt: '2026-02-20',
  },
]

export function calcConfidence(dims) {
  const vals = Object.values(dims).filter(v => typeof v === 'number' && isFinite(v))
  if (!vals.length) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function calcStrategicFit(dims) {
  return Object.values(dims).reduce((a, b) => a + b, 0)
}

export function calcXV(initiative) {
  const confidence = calcConfidence(initiative.confidence ?? {})
  const value = (VALUE_TIER_MIDPOINTS[initiative.predictedValueTier] ?? 0) / 1000000
  const timeSensitivity = initiative.timeSensitivity ?? 1.0
  const strategicFit = calcStrategicFit(initiative.strategicFit ?? {})
  return confidence * value * timeSensitivity * strategicFit
}

export function formatXV(xv) {
  if (xv >= 1000) return `${(xv / 1000).toFixed(1)}k`
  if (xv >= 1) return xv.toFixed(1)
  return xv.toFixed(2)
}

export function calcEfficiencyRatio(initiative) {
  const xv = calcXV(initiative)
  if (!initiative.investment || xv === 0) return null
  return (initiative.investment / 1000000) / xv
}
