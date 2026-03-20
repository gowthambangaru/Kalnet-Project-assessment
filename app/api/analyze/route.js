// app/api/analyze/route.js
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildAnalysisPrompt } from '@/lib/prompt'
import { supabase } from '@/lib/supabase'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { input } = body

    if (!input || typeof input !== 'string' || input.trim().length < 5) {
      return NextResponse.json(
        { error: 'Input is too short. Please describe your plan in more detail.' },
        { status: 400 }
      )
    }

    if (input.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Input too long. Please keep it under 2000 characters.' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 1200,
      },
    })

    const prompt = buildAnalysisPrompt(input.trim())
    const geminiResult = await model.generateContent(prompt)
    const rawContent = geminiResult.response.text()

    if (!rawContent) throw new Error('Empty response from Gemini')

    let analysisResult
    try {
      const clean = rawContent.replace(/```json|```/g, '').trim()
      analysisResult = JSON.parse(clean)
    } catch {
      throw new Error('Failed to parse AI response as JSON')
    }

    const required = [
      'clarityScore','scoreVerdict','scoreBreakdown',
      'simplifiedVersion','structuredPlan','missingElements','actionableSteps',
    ]
    for (const field of required) {
      if (!(field in analysisResult)) throw new Error(`Missing field: ${field}`)
    }

    if (supabase) {
      supabase.from('analyses').insert({
        raw_input: input.trim(),
        clarity_score: analysisResult.clarityScore,
        simplified_version: analysisResult.simplifiedVersion,
        structured_plan: analysisResult.structuredPlan,
        missing_elements: analysisResult.missingElements,
        actionable_steps: analysisResult.actionableSteps,
        score_breakdown: analysisResult.scoreBreakdown,
        score_verdict: analysisResult.scoreVerdict,
        created_at: new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.error('Supabase insert error:', error.message)
      })
    }

    return NextResponse.json({ result: analysisResult }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    if (error?.message?.includes('quota')) {
      return NextResponse.json({ error: 'Rate limit reached. Try again shortly.' }, { status: 429 })
    }
    return NextResponse.json(
      { error: error.message || 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
