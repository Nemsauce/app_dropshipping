# CLAUDE.md

## Project Name

DemandLab

## Project Purpose

DemandLab is a Product Intelligence Command Center for ecommerce product testing decisions.

The platform helps analyze products from Dropi, compare global Meta Ads demand, compare visible local competition in Colombia and Mexico, and decide which products should be tested.

This is not a generic admin dashboard. It is a premium dark-mode product intelligence platform.

---

## Required Files — Read Before Every Task

Before making any changes, always read:

1. CLAUDE.md (this file)
2. DEVELOPMENT_NOTES.md
3. PAGE_CONTRACTS.md

These three files define project state, route contracts, and development rules.
Never guess structure or intent. Always check these first.

---

## Architecture

n8n handles scraping and ingestion.
Supabase stores product research data.
Next.js (Vercel) displays and analyzes data.

The app never calls Dropi, Meta Ads, TikTok, or Apify directly.
All external research goes through: browser → Next.js API route → protected n8n webhook → Supabase.

---

## Current Project State

The following routes and features are built and approved. Do not rebuild or restructure them unless explicitly requested.

### Active Routes

| Route | Description |
|---|---|
| / | Dashboard — dynamic KPIs, product queue, signal panel. Supabase read-only. |
| /products | Products explorer — client-side search and filters. Supabase read-only. |
| /products/[id] | Product Detail — demand, competition, supply, Meta Ads evidence, TikTok creatives. Supabase read-only. |
| /research | Manual research form — submits Dropi ID + catalog country to API route. No direct n8n calls from browser. |
| /api/manual-research/dropi-id | Server-side route — validates input and calls protected n8n webhook. |

### Placeholder Routes

These exist as polished placeholders. Do not implement them until explicitly requested.

- /market-radar
- /manual-review
- /opportunities
- /tests
- /settings

### Supabase Tables

| Table | Status |
|---|---|
| public.products | RLS enabled. Anon read policy active. |
| public.product_creatives | RLS enabled. Anon read policy for EXACT_PRODUCT and HIGHLY_SIMILAR_PRODUCT only. |

### n8n Pipelines

- Manual research workflow: Dropi lookup → Meta Ads research → scoring → Supabase upsert.
- TikTok creative pipeline: Apify search → QA matching → Supabase upsert into product_creatives.

---

## Development Workflow

Work one step at a time.

For every task:

1. Read CLAUDE.md, DEVELOPMENT_NOTES.md, and PAGE_CONTRACTS.md before starting.
2. Make only the changes requested.
3. Do not add unrelated features.
4. Do not connect new backend services unless explicitly requested.
5. Do not refactor large parts of the codebase unless explicitly requested.
6. Keep changes small, testable, and reversible.
7. After changes, report exactly what files were created or modified.
8. Run all required checks before marking the task complete.

### Required Checks

```
npm run typecheck
npm run lint
npm run build
```

If any check fails, fix the issue before finishing. Do not report success with a failing build.

---

## Tech Stack

Use:

- Next.js App Router
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui style components
- lucide-react icons
- Supabase (read-only, anon key only in frontend code)

Do not add:

- Redux or unnecessary state management libraries
- New backend API routes unless explicitly requested
- Authentication unless explicitly requested
- New chart libraries unless explicitly requested
- External scraping logic inside the Next.js app

---

## Design Direction

DemandLab must look like a premium dark product intelligence command center.

Visual inspiration: Bloomberg Terminal, Linear, Vercel dashboard.

The UI must feel: premium, analytical, dense but readable, serious, fast, decision-focused.

Avoid:

- Generic admin templates
- White dashboards
- Excessive animations
- Oversized empty cards
- Decorative colors with no semantic meaning

---

## Color Semantics

Use colors strictly by meaning. Never use them decoratively.

| Color | Meaning |
|---|---|
| Blue | Demand |
| Green | Opportunity |
| Orange | Medium competition |
| Red | Risk, rejection, high competition |
| Yellow | Manual review or warning |
| Purple | Intelligence or advanced analysis |

### Approved Palette

```
Main background:      #080B12
Secondary background: #0D111C
Card background:      #111827
Elevated card:        #151B2B
Border:               #273244
Main text:            #F8FAFC
Secondary text:       #94A3B8
Muted text:           #64748B
Blue demand:          #38BDF8
Green opportunity:    #22C55E
Yellow review:        #FACC15
Red risk:             #EF4444
Purple intelligence:  #A855F7
Orange competition:   #FB923C
```

---

## Data Model Concepts

| Field | Meaning |
|---|---|
| global_meta_ads_score | Global exact Meta Ads demand signal |
| co_visible_competition_score | Visible Meta ad competition in Colombia |
| mx_visible_competition_score | Visible Meta ad competition in Mexico |
| opportunity_co | Global demand exists and CO visible competition is low |
| opportunity_mx | Global demand exists and MX visible competition is low |
| recommended_market | Suggested market to consider testing |
| ads_score | Prioritization score, not proof of sales |
| winner_candidate | Candidate for testing, not guaranteed winner |
| final_recommendation | Helps prioritize manual decisions |

### Approved Language

Use these terms:

- visible competition
- demand signal
- market opportunity
- test candidate
- manual review
- controlled test
- priority candidate

### Forbidden Language

Never use:

- guaranteed winner
- proven saturation
- certain profit
- automatic success
- winning product (unless clearly framed as test candidate)

---

## Currency Rules

- Colombia = COP
- Mexico = MXN

Do not show generic dollar values without currency context.

Examples: COP $79.900 / MXN $399

Global ad scores do not use currency.

---

## Supabase Rules

Supabase is connected read-only.

- Use only NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend code.
- Never use the service_role key in frontend or client code.
- Never hardcode secrets.
- All reads must go through existing utility functions in lib/supabase/.
- Do not modify the Supabase schema unless explicitly requested.
- Do not add write operations unless explicitly requested.

---

## Security Rules

Never commit secrets.

Never put in code:

- Dropi bearer token
- Apify token
- Supabase service_role key
- N8N_MANUAL_RESEARCH_WEBHOOK_URL
- N8N_MANUAL_RESEARCH_SECRET
- Any private API keys

Use environment variables.
Server-only variables must not have the NEXT_PUBLIC prefix.

---

## Code Style

Use:

- TypeScript strict mode
- Small reusable components
- Clear prop types
- Readable naming
- Server components by default when possible
- Client components only when hooks or interactivity require them

Do not:

- Use `any` without a strong reason
- Ignore TypeScript errors
- Duplicate existing components
- Create unnecessarily large files
- Add unused packages
- Leave dead code

---

## Reporting Requirements

After every task, report:

1. Files created
2. Files modified
3. Packages installed (if any)
4. Results of npm run typecheck, npm run lint, npm run build
5. Any assumptions made
6. Anything intentionally deferred

---

## Currently Deferred — Do Not Implement Until Requested

- Supabase write operations
- Authentication
- Market Radar full visualization
- Manual decision workflow
- Test tracking
- Manual research job persistence (polling, history)
- Products Export View
- Multi-currency normalization
- Predictive statistical models
- Bulk manual research
- Product detail auto-redirect from /research
