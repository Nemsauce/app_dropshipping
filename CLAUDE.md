# CLAUDE.md

## Project: DemandLab

DemandLab is a premium dark-mode Product Intelligence Command Center for ecommerce
product testing decisions.

It analyzes products from Dropi, compares global Meta Ads demand signals, compares
visible local competition in Colombia and Mexico, and helps decide which products
should be tested.

This is not a generic admin dashboard. Every page must help the user decide, inspect,
prioritize, or manage product testing opportunities.

---

## Architecture

n8n handles scraping and ingestion.
Supabase stores product research data.
Vercel/Next.js displays and analyzes data.

Never scrape Dropi, Meta Ads, TikTok, or Apify directly from the browser or from
frontend components. All scraping goes through n8n.

---

## Tech Stack

Use:
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui style components
- lucide-react icons
- Supabase (read-only anon client, already connected)
- Server components by default

Do not add:
- Redux or unnecessary state management libraries
- Authentication before explicitly requested
- Chart libraries before explicitly requested
- External scraping logic inside the Vercel app
- New npm packages unless explicitly requested

---

## Current State

The following phases are complete:

- Visual foundation and design system
- Route structure and sidebar navigation
- Supabase read-only connection with RLS policies
- Dashboard with dynamic KPI cards and hero metrics
- /products with client-side search and filters
- /products/[id] Product Detail with supply, pricing, Meta Ads evidence,
  TikTok creative evidence, and research metadata
- /research with Manual Dropi ID Research form, server-side API route,
  and n8n webhook integration
- TikTok Creative Evidence end-to-end pipeline via n8n + Apify +
  product_creatives table

Active placeholders (do not build until explicitly requested):
- /market-radar
- /manual-review
- /opportunities
- /tests
- /settings

---

## Supabase Rules

Supabase is connected and read-only.

Use:
- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for the anon client
- Read utilities in lib/supabase/ for all data fetching
- Server components for Supabase queries where possible

Do not:
- Use the service_role key in frontend or client code
- Write to Supabase until manual decision workflow is explicitly requested
- Expose Supabase secrets in browser-accessible code

---

## Security Rules

Never commit secrets.

Do not put these in code:
- Dropi bearer token
- Apify token
- Supabase service_role key
- N8N_MANUAL_RESEARCH_WEBHOOK_URL
- N8N_MANUAL_RESEARCH_SECRET
- Any private API keys

Use server-only environment variables (no NEXT_PUBLIC_ prefix) for secrets.

---

## Development Workflow

Work one step at a time.

For every task:
1. Read relevant existing files before making changes.
2. Make only the changes requested.
3. Do not add unrelated features.
4. Do not refactor large parts of the codebase unless explicitly requested.
5. Do not add new packages unless explicitly requested.
6. Keep changes small, testable, and reversible.
7. After changes, report exactly what files were created or modified.

Required checks before marking any task complete:
- npm run typecheck
- npm run lint
- npm run build

If any check fails, fix the issue before finishing.

---

## Reference Files

Before making UI or route changes, read:
- PAGE_CONTRACTS.md — defines what every route is responsible for and what it must not become
- DEVELOPMENT_NOTES.md — tracks completed steps, deferred work, and review notes

If a requested change conflicts with PAGE_CONTRACTS.md, stop and report the
conflict instead of guessing.

---

## Design Direction

DemandLab must look like a premium dark product intelligence command center.

Visual inspiration: Bloomberg Terminal, Linear, Vercel dashboard.

The UI must feel:
- Premium and analytical
- Dense but readable
- Decision-focused
- Fast

Avoid:
- Generic admin templates
- White or light backgrounds
- Excessive animations
- Decorative colors with no semantic meaning
- Oversized empty cards

---

## Color Palette

Main background:     #080B12
Secondary bg:        #0D111C
Card background:     #111827
Elevated card:       #151B2B
Border:              #273244
Main text:           #F8FAFC
Secondary text:      #94A3B8
Muted text:          #64748B
Blue (demand):       #38BDF8
Green (opportunity): #22C55E
Yellow (review):     #FACC15
Red (risk):          #EF4444
Purple (intel):      #A855F7
Orange (competition):#FB923C

---

## Color Semantics

Blue    = demand
Green   = opportunity
Orange  = medium visible competition
Red     = risk, rejection, high visible competition
Yellow  = manual review or warning
Purple  = intelligence or advanced analysis

---

## Language Rules

Use these terms:
- Demand signal
- Visible competition
- Test candidate
- Priority candidate
- Manual review
- Market opportunity
- Controlled test
- Product research dataset

Avoid these terms:
- Guaranteed winner
- Proven saturation
- Guaranteed profit
- Automatic success
- "Winning product" unless clearly framed as a test candidate

Never claim the platform proves sales or profitability from ad-library signals alone.

---

## Data Model Concepts

- global_meta_ads_score = global exact Meta Ads demand signal
- co_visible_competition_score = visible Meta ad competition in Colombia
- mx_visible_competition_score = visible Meta ad competition in Mexico
- opportunity_co = global demand exists + Colombia visible competition is low
- opportunity_mx = global demand exists + Mexico visible competition is low
- recommended_market = suggested market to consider testing
- ads_score = prioritization score, not proof of sales
- winner_candidate = candidate for testing, not guaranteed winner
- final_recommendation = helps prioritize manual decisions

---

## Currency Rules

CO = COP (format: COP $79.900)
MX = MXN (format: MXN $399)

Do not show generic dollar values without currency context.
Global ad scores do not use currency.

---

## Code Style

Use:
- TypeScript strict mode
- Small reusable components with clear prop types
- Server components by default
- Client components only when hooks or interactivity require them
- Readable naming

Do not:
- Use `any` without strong justification
- Duplicate existing components
- Create unnecessarily large files
- Leave dead code
- Ignore TypeScript errors

---

## Reporting Requirements

After every task, report:

1. Files created
2. Files modified
3. Packages installed (if any)
4. Results of: npm run typecheck / npm run lint / npm run build
5. Any assumptions made
6. Anything intentionally left for later
