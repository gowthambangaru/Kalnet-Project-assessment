'use client'
// components/BeforeAfter.jsx

export default function BeforeAfter({ original, simplified }) {
  return (
    <div className="ba-grid">
      <div className="ba-card ba-before">
        <div className="ba-tag">
          <div className="dot" />
          Before — Raw Input
        </div>
        <p className="ba-text">{original}</p>
      </div>
      <div className="ba-card ba-after">
        <div className="ba-tag">
          <div className="dot" />
          After — Simplified
        </div>
        <p className="ba-text">{simplified}</p>
      </div>
    </div>
  )
}
