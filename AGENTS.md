# AGENTS.md

## Project Name

DemandLab

## Project Purpose

DemandLab is a Product Intelligence Command Center for ecommerce product testing decisions.

The platform helps analyze products from Dropi, compare global Meta Ads demand, compare visible local competition in Colombia and Mexico, and decide which products should be tested.

This is not a generic admin dashboard. It is a premium dark-mode product intelligence platform.

## Development Workflow

Work one step at a time.

For every task:
1. Make only the changes requested.
2. Do not add unrelated features.
3. Do not connect backend services unless explicitly requested.
4. Do not refactor large parts of the codebase unless explicitly requested.
5. Keep changes small, testable, and reversible.
6. After changes, report exactly what files were created or modified.
7. Run the required checks before saying the task is complete.

Required checks:
- npm run typecheck
- npm run lint
- npm run build

If any check fails, fix the issue before finishing.

## Current Build Strategy

The project is being built in controlled phases:

1. Visual foundation
2. Route structure and navigation
3. Static dashboard polish
4. Supabase connection
5. Real product data integration
6. Market Radar
7. Product Detail Page
8. Manual decision workflow
9. Statistical scoring display
10. Product testing tracker

Do not skip phases.

## Tech Stack

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- lucide-react icons
- Supabase later, only when explicitly requested

Do not add:
- Redux
- unnecessary state management libraries
- backend APIs before requested
- authentication before requested
- chart libraries before requested
- external scraping logic inside the Vercel app

n8n handles scraping and ingestion.
Supabase stores data.
Vercel/Next.js displays and analyzes data.

## Design Direction

DemandLab must look like a premium dark product intelligence command center.

Visual inspiration:
- Bloomberg Terminal
- Linear
- Vercel dashboard
- Product testing laboratory
- Data-heavy SaaS analytics

The UI should feel:
- premium
- analytical
- dense but readable
- serious
- fast
- decision-focused

Avoid:
- generic admin templates
- white dashboards
- ecommerce storefront styling
- childish colors
- excessive animations
- oversized empty cards
- decorative colors with no meaning

## Color Semantics

Use colors by meaning:

- Blue = demand
- Green = opportunity
- Orange = medium competition
- Red = risk, rejection, high competition
- Yellow = manual review or warning
- Purple = intelligence or advanced analysis

Approved palette:

- Main background: #080B12
- Secondary background: #0D111C
- Card background: #111827
- Elevated card: #151B2B
- Border: #273244
- Main text: #F8FAFC
- Secondary text: #94A3B8
- Muted text: #64748B
- Blue demand: #38BDF8
- Green opportunity: #22C55E
- Yellow review: #FACC15
- Red risk: #EF4444
- Purple intelligence: #A855F7
- Orange competition: #FB923C

## UI Rules

Use:
- dark mode by default
- fixed sidebar
- top header
- dense data tables
- score badges
- signal breakdown cards
- clear recommendation badges
- compact but readable layouts
- semantic color usage
- polished empty states
- modular reusable components

Do not use:
- random gradients everywhere
- too many animations
- fake clutter
- generic Bootstrap-like components
- visual elements that do not help decisions

## Data Model Concepts

The platform works with product research signals.

Important concepts:
- global_meta_ads_score means global exact Meta Ads demand signal.
- co_visible_competition_score means visible Meta ad competition in Colombia.
- mx_visible_competition_score means visible Meta ad competition in Mexico.
- opportunity_co means global demand exists and Colombia visible competition is low.
- opportunity_mx means global demand exists and Mexico visible competition is low.
- recommended_market is the suggested market to consider testing.
- ads_score is a prioritization score, not proof of sales.
- winner_candidate means candidate for testing, not guaranteed winner.
- final_recommendation helps prioritize manual decisions.

Never claim the platform proves saturation, profitability, or guaranteed winners.

Use wording like:
- visible competition
- demand signal
- market opportunity
- test candidate
- manual review

Avoid wording like:
- guaranteed winner
- proven saturation
- certain profit
- automatic success

## Currency Rules

The platform supports Colombia and Mexico.

Use:
- CO = COP
- MX = MXN

Do not show generic dollar values without currency context.

Examples:
- COP $79.900
- MXN $399

Global ad scores do not use currency.

## Supabase Rules

Do not connect Supabase until explicitly requested.

When Supabase is requested:
- use environment variables
- do not hardcode secrets
- never expose service_role keys in frontend code
- read data through safe server-side utilities or appropriate Supabase clients
- keep schema names aligned with the existing products table

## Security Rules

Never commit secrets.

Do not put these in code:
- Dropi bearer token
- Apify token
- Supabase service_role key
- private API keys

Use environment variables.

Secrets cleanup will be handled later, but do not make the problem worse.

## Code Style

Use:
- TypeScript strict mode
- small reusable components
- clear prop types
- readable naming
- minimal client components
- server components by default when possible
- client components only when hooks or interactivity require them

Do not:
- use `any` unless there is a strong reason
- ignore TypeScript errors
- duplicate components
- create huge files unnecessarily
- add unused packages
- leave dead code

## Reporting Requirements

After every task, report:

1. Files created
2. Files modified
3. Packages installed
4. Commands run
5. Results of:
   - npm run typecheck
   - npm run lint
   - npm run build
6. Any assumptions made
7. Anything intentionally left for later

## Current Priority

The immediate priority is building a clean frontend foundation before connecting real data.

Do not rush into Supabase or backend features until the frontend structure is approved.
