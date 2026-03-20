/**
 * lib/prompt.js
 *
 * PROMPT DESIGN PHILOSOPHY
 * -------------------------
 * The prompt is broken into three layers:
 *
 * Layer 1 — Role + Constraint:
 *   Assign the model a strict expert persona and mandate JSON-only output.
 *   This prevents markdown, preamble, and hallucinated commentary.
 *
 * Layer 2 — Schema Definition:
 *   Provide the exact JSON structure the model must fill.
 *   Explicit field names + types reduce hallucination and parsing errors.
 *
 * Layer 3 — Scoring Rules:
 *   Define scoring rubrics inline so the model's logic is auditable.
 *   Each dimension has a max and clear criteria — no ambiguity.
 */

export function buildAnalysisPrompt(userInput) {
  return `You are an expert plan analyst and strategic thinking coach. Your job is to analyze raw, unstructured ideas and convert them into actionable, structured plans.

CRITICAL: Respond ONLY with a valid JSON object. No markdown, no backticks, no explanations, no extra text before or after. Just raw JSON.

Analyze the following user input and return this exact JSON structure:

{
  "clarityScore": <integer 0-100>,
  "scoreVerdict": "<one clear sentence explaining why this score was given>",
  "scoreBreakdown": [
    { "label": "Goal Clarity",   "score": <integer 0-30>, "max": 30 },
    { "label": "Steps Defined",  "score": <integer 0-30>, "max": 30 },
    { "label": "Timeline",       "score": <integer 0-20>, "max": 20 },
    { "label": "Resources",      "score": <integer 0-20>, "max": 20 }
  ],
  "simplifiedVersion": "<A clear, concise 2-3 sentence rewrite. Use simple language. State what the person wants, how they plan to do it, and by when — filling gaps where possible.>",
  "structuredPlan": {
    "goal": "<The specific, measurable goal extracted or inferred from input>",
    "method": "<The approach or strategy mentioned or implied>",
    "steps": ["<Step 1>", "<Step 2>", "<Step 3 if present — minimum 1, max 5>"],
    "timeline": "<Exact timeline if mentioned, otherwise 'Not specified'>",
    "resources": "<Tools, money, skills, or people mentioned, otherwise 'Not specified'>"
  },
  "missingElements": [
    { "category": "<Category name e.g. Timeline / Budget / Target Audience / Success Metric>", "detail": "<Specific explanation of what is missing and why it matters for execution>" }
  ],
  "actionableSteps": [
    { "title": "<Short imperative verb phrase e.g. Define your target audience>", "description": "<1-2 sentences of practical, specific guidance>" }
  ]
}

SCORING RULES (apply strictly):
- Goal Clarity (0-30):
    30 = Specific, measurable, outcome-focused goal
    20 = Clear goal but missing measurability
    10 = Vague direction but some intent visible
    0  = No clear goal whatsoever

- Steps Defined (0-30):
    30 = Concrete ordered steps with clear actions
    20 = Some steps mentioned but incomplete
    10 = Vague methods hinted at
    0  = No steps or method at all

- Timeline (0-20):
    20 = Specific dates or durations provided
    10 = Vague time reference (e.g. "soon", "next year")
    0  = No timeline mentioned

- Resources (0-20):
    20 = Tools, budget, skills, or team clearly identified
    10 = Some resources implied but not explicit
    0  = No resources mentioned

RULES:
- missingElements: include only genuinely missing items (minimum 1, maximum 5)
- actionableSteps: provide 4-6 practical, immediately actionable steps
- Be honest and critical — do not inflate the clarity score
- steps in structuredPlan should reflect what the user actually said, not invented steps

User's raw input:
"${userInput.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
}
