'use client'
// app/page.jsx
import { useState, useRef } from 'react'
import ScoreCard from '@/components/ScoreCard'
import BeforeAfter from '@/components/BeforeAfter'
import StructuredPlan from '@/components/StructuredPlan'
import MissingElements from '@/components/MissingElements'
import ActionableSteps from '@/components/ActionableSteps'

const PLACEHOLDER =
  'e.g. I want to start a YouTube channel and earn money quickly. I\'ll upload gaming and tech videos. I think I can get 10k subscribers in a month.'

export default function Home() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [runCount, setRunCount] = useState(0)
  const resultsRef = useRef(null)

  async function handleAnalyze() {
    if (!input.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }

      setResult(data.result)
      setRunCount((c) => c + 1)

      // Smooth scroll to results after render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setInput('')
    setResult(null)
    setError('')
    setRunCount(0)
  }

  function handleKeyDown(e) {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze()
    }
  }

  return (
    <main className="app">
      {/* ── Header ────────────────────────────────────── */}
      <div className="header">
        <div className="header-tag">// KALNET intern assignment</div>
        <h1>
          AI Clarity & <span>Structuring Tool</span>
        </h1>
        <p className="header-sub">
          Paste your raw idea or plan. Get a structured breakdown, clarity
          score, missing elements, and actionable next steps — powered by GPT-4.
        </p>
      </div>

      {/* ── Input ─────────────────────────────────────── */}
      <div className="input-area">
        <label className="input-label">// your raw idea or plan</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          maxLength={2000}
          disabled={loading}
        />
        <div className="btn-row">
          <button
            className="btn-analyze"
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Plan →'}
          </button>
          <button className="btn-clear" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <span className="char-count">{input.length} / 2000</span>
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────── */}
      {loading && (
        <>
          <div className="loading-bar">
            <div className="loading-fill" />
          </div>
          <p className="loading-text">analyzing your plan with gpt-4...</p>
        </>
      )}

      {/* ── Error ─────────────────────────────────────── */}
      {error && <div className="error-msg">{error}</div>}

      {/* ── Results ───────────────────────────────────── */}
      {result && (
        <div ref={resultsRef}>
          {/* Clarity Score */}
          <div className="section-divider">
            <span>clarity score</span>
          </div>
          <ScoreCard data={result} />

          {/* Before vs After */}
          <div className="section-divider">
            <span>before vs after</span>
          </div>
          <BeforeAfter
            original={input.trim()}
            simplified={result.simplifiedVersion}
          />

          {/* Structured Plan */}
          <div className="section-divider">
            <span>structured plan</span>
          </div>
          <StructuredPlan plan={result.structuredPlan} />

          {/* Missing Elements */}
          <div className="section-divider">
            <span>missing elements</span>
          </div>
          <MissingElements items={result.missingElements} />

          {/* Actionable Steps */}
          <div className="section-divider">
            <span>actionable steps</span>
          </div>
          <ActionableSteps steps={result.actionableSteps} />

          {/* Iteration footer */}
          <div className="iterate-note">
            <span>edit your plan above and re-analyze to see clarity improve</span>
            {runCount > 0 && (
              <span className="iteration-badge">run #{runCount}</span>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
