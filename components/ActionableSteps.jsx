'use client'
// components/ActionableSteps.jsx

export default function ActionableSteps({ steps }) {
  return (
    <div className="steps-list">
      {steps.map((step, i) => (
        <div key={i} className="step-item">
          <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
          <div className="step-body">
            <div className="step-title">{step.title}</div>
            <div className="step-desc">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
