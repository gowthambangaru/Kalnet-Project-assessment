# Explain My Plan — AI Clarity & Structuring Tool

> KALNET Intern Assignment | Built with Next.js, GPT-4, and Supabase

---

## Live Demo

[→ View Live App](your-vercel-url-here)

---

## Project Overview

**Explain My Plan** is a full-stack web application that converts raw, unstructured ideas into clear, structured, and actionable plans using GPT-4.

Users type a vague plan in plain language. The app responds with:
- A **Clarity Score** (0–100) with a breakdown across 4 dimensions
- A **Before vs After** comparison showing the raw input vs a simplified version
- A **Structured Plan** (Goal, Method, Steps, Timeline, Resources)
- **Missing Elements** — gaps in the plan that need to be addressed
- **Actionable Next Steps** — practical guidance to move forward
- **Iteration Capability** — re-analyze after editing to track improvement

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | Next.js 14 (App Router), React |
| Styling    | Custom CSS (no UI library)  |
| Backend    | Next.js API Routes          |
| AI/LLM     | Google Gemini 1.5 Flash               |
| Database   | Supabase (PostgreSQL)       |
| Deployment | Vercel                      |

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/explain-my-plan.git
cd explain-my-plan
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.local.example .env.local
```

Fill in your keys in `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase database
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Paste and run the contents of `supabase/schema.sql`
4. Copy your **Project URL** and **Anon Key** from Settings → API

### 5. Run locally
```bash
npm run dev
```
Visit `http://localhost:3000`

---

## Deployment on Vercel

```bash
npm install -g vercel
vercel
```

Add the three environment variables in your Vercel project settings (Settings → Environment Variables) before deploying to production.

---

## Prompt Design Explanation

The prompt is structured in three deliberate layers:

### Layer 1 — Role + Output Constraint
```
"You are an expert plan analyst. Respond ONLY with a valid JSON object.
No markdown, no backticks, no explanations."
```
This forces the model into a strict machine-readable mode. Using GPT-4o's native `response_format: { type: 'json_object' }` parameter adds an extra enforcement layer at the API level.

### Layer 2 — Schema Definition
The exact JSON shape is provided in the prompt with field names, types, and descriptions. This eliminates ambiguity — the model knows precisely what to fill and where.

### Layer 3 — Scoring Rubric (Inline Rules)
Each scoring dimension has explicit criteria:
```
Goal Clarity (0-30):
  30 = Specific, measurable, outcome-focused goal
  20 = Clear goal but missing measurability
  10 = Vague direction, some intent visible
  0  = No clear goal whatsoever
```
By embedding the rubric in the prompt, the scoring logic is transparent to both the model and the user.

**Temperature** is set to `0.4` — low enough for consistent structured output, high enough to avoid robotic phrasing in the simplified version.

---

## Clarity Score Logic

The total score is out of 100, split across 4 dimensions:

| Dimension      | Max Score | What it measures                              |
|----------------|-----------|-----------------------------------------------|
| Goal Clarity   | 30        | Is the goal specific and measurable?          |
| Steps Defined  | 30        | Are concrete actions identified?              |
| Timeline       | 20        | Is there a specific timeframe?                |
| Resources      | 20        | Are tools, budget, or skills mentioned?       |

**Why this split?** Goal and Steps together make up 60% of the score because a plan without a clear goal or execution path is fundamentally broken, regardless of timeline. Timeline and Resources are important but secondary — they can be added once the core plan exists.

The score is computed by GPT-4 following the rubric above, making it auditable and explainable rather than a black-box number.

---

## Challenges & Approach (200 words)

**Challenge 1 — Consistent structured output from LLMs**
LLMs are generative by nature and don't always follow schemas strictly. I solved this by using GPT-4o's native JSON mode (`response_format: { type: 'json_object' }`), defining the exact schema in the prompt, and adding server-side field validation before returning the response to the client.

**Challenge 2 — Honest, non-inflated scoring**
Early prompt iterations produced scores that were too generous. I added an explicit instruction ("Be honest and critical — do not inflate the clarity score") and defined each score band with specific criteria, which significantly improved calibration.

**Challenge 3 — Prompt conciseness vs. precision**
Too long a prompt wastes tokens and can confuse the model. I iterated on the prompt to keep it dense and precise — every sentence earns its place. The scoring rubric and schema are co-located so the model has full context in one coherent block.

**Approach to AI prompting:** I treated the prompt as code — versioned, testable, and decomposed into logical layers (role, schema, rules). This made it easier to isolate issues and iterate on specific parts without breaking the whole.
