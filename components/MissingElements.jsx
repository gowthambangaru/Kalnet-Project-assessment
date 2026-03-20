'use client'
// components/MissingElements.jsx

export default function MissingElements({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="missing-list">
        <div className="missing-item missing-ok">
          <span className="missing-icon ok">✓</span>
          <span className="missing-text">No major gaps detected — your plan looks complete!</span>
        </div>
      </div>
    )
  }

  return (
    <div className="missing-list">
      {items.map((item, i) => (
        <div key={i} className="missing-item">
          <span className="missing-icon">!</span>
          <span className="missing-text">
            <span className="missing-cat">{item.category}</span>
            {item.detail}
          </span>
        </div>
      ))}
    </div>
  )
}
