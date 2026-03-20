'use client'
// components/ScoreCard.jsx
import { useEffect, useRef } from 'react'

function getScoreColor(score) {
  if (score >= 75) return '#4af0a0'
  if (score >= 50) return '#c8f04a'
  if (score >= 25) return '#ffb830'
  return '#ff6b6b'
}

function getScoreLabel(score) {
  if (score >= 80) return 'Crystal Clear'
  if (score >= 60) return 'Taking Shape'
  if (score >= 40) return 'Needs Work'
  if (score >= 20) return 'Very Vague'
  return 'Just an Idea'
}

export default function ScoreCard({ data }) {
  const numRef = useRef(null)
  const circleRef = useRef(null)

  const score = data.clarityScore
  const color = getScoreColor(score)
  const circumference = 289

  useEffect(() => {
    // Animate the ring
    if (circleRef.current) {
      const offset = circumference - (score / 100) * circumference
      circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'
      circleRef.current.style.strokeDashoffset = offset
      circleRef.current.style.stroke = color
    }
    // Animate the number count up
    if (numRef.current) {
      let current = 0
      const step = () => {
        current = Math.min(current + 2, score)
        numRef.current.textContent = current
        if (current < score) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
  }, [score, color])

  return (
    <div className="score-card">
      {/* Ring */}
      <div className="score-ring-wrap">
        <svg className="score-svg" viewBox="0 0 110 110">
          <circle className="score-bg" cx="55" cy="55" r="46" />
          <circle
            ref={circleRef}
            className="score-fill"
            cx="55" cy="55" r="46"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        <div className="score-center">
          <span ref={numRef} className="score-num" style={{ color }}>0</span>
          <span className="score-label">/ 100</span>
        </div>
      </div>

      {/* Details */}
      <div className="score-detail">
        <div className="score-title" style={{ color }}>{getScoreLabel(score)}</div>
        <div className="score-verdict">{data.scoreVerdict}</div>
        <div className="score-bars">
          {data.scoreBreakdown.map((item) => {
            const pct = (item.score / item.max) * 100
            const barColor = getScoreColor(pct)
            return (
              <div key={item.label} className="score-bar-item">
                <span className="score-bar-label">{item.label}</span>
                <div className="score-bar-track">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                <span className="score-bar-val">{item.score}/{item.max}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
