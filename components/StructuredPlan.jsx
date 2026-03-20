'use client'
// components/StructuredPlan.jsx

const FIELDS = [
  { key: 'goal',      label: 'Goal' },
  { key: 'method',    label: 'Method / Approach' },
  { key: 'steps',     label: 'Steps Identified' },
  { key: 'timeline',  label: 'Timeline' },
  { key: 'resources', label: 'Resources' },
]

export default function StructuredPlan({ plan }) {
  return (
    <div className="plan-grid">
      {FIELDS.map(({ key, label }) => {
        const value = plan[key]
        const isArray = Array.isArray(value)
        return (
          <div key={key} className="plan-card">
            <div className="plan-card-head">{label}</div>
            <div className="plan-card-body">
              {isArray
                ? value.map((s, i) => (
                    <div key={i} className="plan-step-item">
                      <span className="plan-step-bullet">→</span>
                      <span>{s}</span>
                    </div>
                  ))
                : value || 'Not specified'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
