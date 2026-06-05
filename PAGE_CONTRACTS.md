# PAGE_CONTRACTS.md

## Purpose

This file defines the product and UX contracts for every DemandLab route.

AGENTS.md defines how coding agents should work.
DEVELOPMENT_NOTES.md tracks progress, deferred work, and review notes.
PAGE_CONTRACTS.md defines what each page is responsible for and what it must not become.

Every future coding step must read this file before making UI or route changes.

## Global Product Rule

DemandLab is not a generic admin dashboard.

It is a premium dark-mode Product Intelligence Command Center for ecommerce product testing decisions.

Every page must help the user decide, inspect, prioritize, or manage product testing opportunities.

Do not add decorative UI that does not improve decision-making.

## Global Language Rules

Use these terms:

* Demand signal
* Visible competition
* Test candidate
* Priority candidate
* Manual review
* Market opportunity
* Controlled test
* Product research dataset

Avoid these terms:

* Guaranteed winner
* Proven saturation
* Guaranteed profit
* Automatic success
* Winning product unless clearly framed as a test candidate

Never claim the platform proves sales or profitability from ad-library signals alone.

## Global Data Rules

n8n handles scraping and ingestion.
Supabase stores product research data.
Next.js displays and analyzes the data.

Until explicitly requested:

* Supabase is read-only.
* No writes.
* No auth.
* No API routes.
* No manual decision persistence.
* No test tracking writes.

Use fallback mock data only when Supabase data is unavailable.

## Global Visual Rules

Use the approved DemandLab visual direction:

* Dark mode
* Fixed sidebar
* Top header
* Dense but readable data layout
* Semantic color usage
* Rounded cards
* Subtle borders
* No generic admin template look

Semantic colors:

* Blue = demand
* Green = opportunity
* Orange = medium visible competition
* Red = risk, rejection, high visible competition
* Yellow = manual review or warning
* Purple = intelligence or advanced analysis

## Feature Contract: TikTok Creative Evidence

Purpose:
Find and store accurately matching TikTok product creatives so the user can inspect real video angles, hooks, demonstrations, and market language for a researched product.

Primary question:
What TikTok creatives exist for this exact product or a highly similar product, and are they relevant enough to support creative research?

Architecture rule:
DemandLab must not scrape TikTok directly from the browser or from frontend components.

Allowed future architecture:

* /research submits Dropi product ID and catalog country to the existing server-side API route.
* Next.js API route calls protected n8n webhook.
* n8n owns TikTok creative search, matching, filtering, scoring, and Supabase writes.
* Supabase stores accepted creative evidence.
* /products/[id] displays stored creative evidence read-only.

Required matching standard:
TikTok creatives must match the actual product type, not just the broad category.

Example:
For “Limpiador Facial Espatula Puntos Negros”, acceptable matches include ultrasonic skin scrubber, facial spatula blackhead remover, or visually similar handheld facial scrubber devices.

Unacceptable matches include generic skincare routines, creams, blackhead masks, unrelated beauty influencers, or broad facial care videos without the product.

Required QA fields for future storage:

* product_id
* platform
* creative_url
* thumbnail_url
* creator_name
* caption
* matched_query
* match_confidence
* match_reason
* product_match_type
* country
* source
* found_at
* raw_payload
* created_at
* updated_at

Required match confidence labels:

* EXACT_PRODUCT
* HIGHLY_SIMILAR_PRODUCT
* RELATED_BUT_WEAK
* REJECTED

Acceptance rule:
Only EXACT_PRODUCT and HIGHLY_SIMILAR_PRODUCT should be displayed as accepted creative evidence by default.

RELATED_BUT_WEAK may be stored later for review, but should not be shown as accepted evidence unless a review mode is built.

REJECTED should not be displayed.

Required future Product Detail section:
Section title:
TikTok Creative Evidence

Required empty state:
No TikTok creative evidence stored for this product yet.

Required displayed fields:

* Thumbnail if available
* Creator name
* Caption or title
* Creative URL
* Matched query
* Match confidence
* Match reason
* Product match type
* Country
* Found at

Required language rule:
Do not present TikTok creatives as proof of sales.
Describe them as creative research, product angle evidence, or video examples.

Forbidden:

* Direct TikTok scraping from frontend
* Browser-visible scraper credentials
* Fake videos
* Fake engagement numbers
* Guaranteed winner claims
* Guaranteed sales claims
* Manual decision writes
* Test tracking writes

## Route Contract: /

### Page Name

Dashboard

### Purpose

High-level decision cockpit.

### Primary Question

What should I pay attention to right now?

### User Mindset

The user wants a fast overview of the current product research state and the most important candidates.

### Allowed Content

The Dashboard may show:

* Page title
* Short page description
* Hero mini metrics
* KPI cards
* A prioritized product opportunity table
* A selected-product analysis panel
* Signal breakdown for the selected product
* Recommendation reasons for the selected product
* Current research state summaries

### Required Current Sections

1. Header area

   * Eyebrow text: Testing decisions / May 2026
   * Title: Product Intelligence Dashboard
   * Description: Demand, competition, margin, policy risk, and supply signals for Colombia and Mexico product testing.

2. Hero mini metrics

   * Queue Score
   * CO/MX Split
   * Review Load

3. KPI cards

   * Analyzed Products
   * Priority Candidates
   * CO Opportunities
   * MX Opportunities
   * High Competition
   * Policy Risk

4. Product Opportunity Queue

   * Product table
   * Selected row highlight

5. Expanded Signal Panel

   * Signal Breakdown
   * Why this product was recommended
   * Key Details

### Forbidden Content

The Dashboard must not become:

* Full product inventory management
* A deep product detail page
* A full filtering workspace
* A manual decision workflow
* A campaign test tracking page
* A market radar visualization

### Component Rules

Allowed:

* AppShell
* KpiCard
* ProductsTable
* RecommendationPanel
* FilterBar, as a lightweight dashboard filter surface
* Hero metric helpers

Do not add:

* Product detail route logic
* Write buttons
* Persistent decision controls
* Campaign tracking widgets
* Market Radar chart

### Data Rules

Use:

* getProductsForDashboard()
* fallback mock products
* dashboard KPI helpers
* hero metric helpers
* selected-product analysis helpers

Do not use:

* Supabase writes
* API routes
* client-side fetching unless explicitly requested

---

## Route Contract: /products

### Page Name

Products

### Purpose

Product inventory and exploration workspace.

### Primary Question

What products exist in the database, and how can I inspect, filter, compare, and browse them?

### User Mindset

The user wants to explore the product research dataset, not receive a dashboard-style recommendation story.

### Critical UX Difference From Dashboard

/products must not feel like a copy of the Dashboard.

The Dashboard is a decision cockpit.
The Products page is an inventory explorer.

### Required Layout

/products must follow this order:

1. Page header
2. Summary cards
3. Product exploration toolbar
4. Product table
5. Data source/status card or compact notes area

Do not place a large selected-product analysis panel under the table.

### Required Page Header

Eyebrow:
Product research

Title:
Products

Description:
Explore the full product research dataset across demand signals, visible competition, market, risk, supplier, and recommendation.

### Required Summary Cards

Place summary cards directly below the page header.

Cards, left to right:

1. Total Products

   * Shows total product count
   * Tone: demand
   * Description: Current research dataset

2. Priority Test

   * Shows count of products with PRIORITY TEST
   * Tone: opportunity
   * Description: Ready for controlled review

3. Manual Review

   * Shows count of products with MANUAL REVIEW or risk Review
   * Tone: review
   * Description: Needs policy or signal review

4. Ignored / Rejected

   * Shows count of products with IGNORE or REJECT
   * Tone: risk
   * Description: Not prioritized for testing

### Required Product Exploration Toolbar

Place the toolbar below the summary cards and above the table.

Toolbar layout:

* Left side: search input
* Right side: static filter/action buttons

Search input:

* Placeholder: Search by ID, product, category, or provider...
* Icon: Search
* Does not need to work yet

Static filter buttons:

* Market
* Recommendation
* Risk
* Provider
* Tier

Action button:

* Export View

Button behavior:

* These buttons are static placeholders for now.
* Do not implement filtering yet.
* Do not implement export yet.
* Do not add dropdown menus yet.
* Do not add client-side state yet unless explicitly requested.

### Required Product Table

Use ProductsTable.

The table should be the main content of the page.

The page should pass:

* productList as products
* selectedProduct.id as selectedProductId

The selected row may remain highlighted for now, but the page must not show the full dashboard RecommendationPanel.

### Required Data Source / Notes Card

Place a compact card below the table.

Title:
Product Explorer Notes

Required text:
This page is a read-only product exploration workspace. Filtering, sorting, exports, row click-through, and product detail pages are intentionally deferred.

Show 3 small note chips:

* Read-only Supabase data
* Mock fallback enabled
* Filters coming later

### Forbidden Content

/products must not include:

* The large RecommendationPanel
* Full selected-product signal breakdown
* Why this product was recommended section
* Key Details panel
* Decision buttons
* Manual decision writes
* Ad proof panels
* Campaign test tracking
* Market radar visualization

### Component Rules

Allowed:

* AppShell
* PageHeader
* ProductsTable
* Button
* Input
* Static summary cards
* Static toolbar
* Compact Product Explorer Notes card

Not allowed:

* RecommendationPanel
* SignalBreakdown
* Manual decision components
* Product detail panels

### Data Rules

Use:

* getProductsForDashboard()
* fallback mock products
* normalizeRecommendationLabel()

Do not use:

* Supabase writes
* auth
* API routes
* local storage
* client-side filter state yet

### Deferred Items

The following are intentionally deferred:

* Functional search
* Functional filters
* Sorting controls
* Export view
* Row click-through
* /products/[id]
* Bulk actions
* Saved views

---

## Route Contract: /products/[id]

### Page Name

Product Detail

### Purpose

Polished product intelligence page for one product.

Show one product in detail so the user can evaluate supply readiness, Meta Ads demand, visible local competition, recommended market, research freshness, and next decision.

### Primary Question

Should this specific product be tested, where, and why?

### Status

Deferred.

Do not build this route until explicitly requested.

### Required Layout

/products/[id] must follow this exact order when implemented:

1. Page header
2. Product hero summary
3. Decision summary cards
4. Signal breakdown section
5. Market comparison section
6. Supply and pricing section
7. Research freshness section
8. Top Meta Ads evidence section
9. Guardrail note section

### Required Page Header

Eyebrow:
Product intelligence

Title:
Use product name.

Description:
Use this exact structure:
Dropi ID {id} / {category} / {provider}

### Required Product Hero Summary

Must show:

* Product image if available
* Product name
* Dropi ID
* SKU
* Category
* Provider
* Tier
* Target market or recommended market
* Final recommendation badge
* Research status badge

### Required Decision Summary Cards

Cards must show:

* Global Demand Score
* Colombia Visible Competition
* Mexico Visible Competition
* Best Local Opportunity Score
* Margin
* Stock

### Required Signal Breakdown Section

Must reuse or align with existing scoring helpers where possible.

Must not claim guaranteed winner.

Must not claim proven saturation.

Must phrase Meta Ads as visible ad activity or demand signal.

### Required Market Comparison Section

Must compare:

* CO visible competition score
* MX visible competition score
* opportunity_co
* opportunity_mx
* recommended_market
* market_opportunity_tier

### Required Supply and Pricing Section

Must show:

* precio_costo
* precio_sugerido
* ganancia
* margen_pct
* stock
* proveedor
* tier
* dropi_catalog_country if available

### Required Research Freshness Section

Must show:

* run_mode
* research_status
* research_error if present
* manual_research_requested_at
* last_researched_at
* meta_global_last_checked_at
* meta_co_last_checked_at
* meta_mx_last_checked_at
* updated_at

### Required Top Meta Ads Evidence Section

Must show available top ad links:

* meta_top_ad_1_url/page/query level
* meta_top_ad_2_url/page/query level
* meta_top_ad_3_url/page/query level
* co_top_ad_1_url/page
* co_top_ad_2_url/page
* co_top_ad_3_url/page
* mx_top_ad_1_url/page
* mx_top_ad_2_url/page
* mx_top_ad_3_url/page

If no ad links exist, show an empty state:
No top ad evidence stored for this product yet.

### Required Guardrail Note

Use this exact copy:
DemandLab uses Dropi supply data and Meta Ads visible activity as research signals. These signals help prioritize controlled tests, but they do not guarantee sales, profitability, or market saturation.

### Required Behavior

* Route must fetch one product by id from Supabase.
* If product is not found, show a polished not-found state.
* Page must be read-only.
* No manual decision writes.
* No test creation.
* No auth.
* No direct Dropi, Meta Ads, or Apify calls.
* No n8n calls.
* No polling.

### Forbidden Until Later

Do not add:

* Persistent decision writes until manual decision workflow phase
* Test creation until test tracking phase
* Fake campaign results
* Auth-dependent behavior
* Direct scraping calls
* n8n calls
* Polling

---

## Route Contract: /research

### Page Name

Manual Research

### Purpose

Manual product research trigger for analyzing a specific Dropi product by ID.

### Primary Question

Can I manually submit a Dropi product ID and trigger the research pipeline for that product?

### User Mindset

The user already found a product outside the normal batch process and wants to force DemandLab/n8n to research it now.

### Critical Architecture Rule

The app must not scrape Dropi, Meta Ads, TikTok Ads, Apify, or external ad libraries directly.

The app may only submit a validated Dropi product ID to a secure server-side Next.js route.

The server-side route may call a protected n8n webhook.

n8n is responsible for:

* Fetching the product from Dropi.
* Running Meta Ads global research.
* Running Meta Ads Colombia research.
* Running Meta Ads Mexico research.
* Calculating research scores.
* Upserting the result into Supabase.
* Returning job or result status.

### Required Current Layout

/research must follow this exact order when implemented:

1. Page header
2. Manual Research form card
3. How it works card
4. Recent/manual research status area or placeholder
5. Guardrails notes card

### Required Page Header

Eyebrow:
Manual research

Title:
Analyze by Dropi ID

Description:
Trigger the research pipeline for a specific Dropi product ID and send it through Meta Ads validation.

### Required Form Card

Card title:
Analyze a specific product

Required body text:
Enter a Dropi product ID and catalog country to request a fresh research run. DemandLab will send the request to n8n, and n8n will handle Dropi lookup, Meta Ads research, scoring, and Supabase upsert.

Input label:
Dropi Product ID

Input placeholder:
Example: 1678755

Select label:
Dropi Catalog Country

Select options:
* Colombia
* Mexico

Default:
Colombia

Primary button:
Analyze Product

Secondary button:
Clear

Validation rules:

* Required
* Digits only
* Minimum length: 3
* Maximum length: 20

Validation messages:

* Empty: Enter a Dropi product ID.
* Invalid: Dropi product ID must contain digits only.

Button states:

* Default: Analyze Product
* Loading: Sending to research pipeline...
* Success: Request submitted
* Error: Retry Analysis

### Required How It Works Card

Title:
How the manual research pipeline works

Steps, in this exact order:

1. DemandLab validates the Dropi product ID and catalog country.
2. DemandLab sends the request to a protected n8n webhook.
3. n8n fetches the product from Dropi.
4. n8n runs Meta Ads research for global, Colombia, and Mexico signals.
5. n8n scores the opportunity and visible competition.
6. n8n upserts the product into Supabase.
7. DemandLab reads the updated product data from Supabase.

### Required Status Area

Title:
Research request status

Initial placeholder text:
No manual research request has been submitted in this session.

After submit, future UI may show:

* Submitted
* Queued
* Running
* Completed
* Failed

Do not fake completed results unless n8n returns them.

### Required Guardrails Notes Card

Title:
Research guardrails

Required notes:

* DemandLab does not scrape Dropi or Meta Ads directly.
* n8n owns scraping, scoring, and Supabase upsert.
* Meta Ads signals indicate visible ad activity, not guaranteed sales.
* A researched product is a test candidate, not a guaranteed winner.

### Required API Integration

When implemented, /research should call:

POST /api/manual-research/dropi-id

Request body:
{
"dropiProductId": "1678755",
"dropiCountry": "COLOMBIA"
}

The browser must not call n8n directly.

### Required Server Route

When implemented, create:

app/api/manual-research/dropi-id/route.ts

The route must:

* Accept POST only.
* Validate JSON body.
* Validate dropiProductId.
* Read N8N_MANUAL_RESEARCH_WEBHOOK_URL from server env.
* Read N8N_MANUAL_RESEARCH_SECRET from server env if configured.
* Call n8n webhook server-side.
* Return a safe JSON response to the browser.
* Never expose the n8n webhook URL.
* Never expose the n8n secret.
* Never use Supabase service_role in client code.

### Required Environment Variables

Future required server-only env vars:

* N8N_MANUAL_RESEARCH_WEBHOOK_URL
* N8N_MANUAL_RESEARCH_SECRET

Do not prefix these with NEXT_PUBLIC.

### Forbidden Content

/research must not include:

* Direct Dropi API calls from the browser.
* Direct Meta Ads or Apify calls from the browser.
* n8n webhook URL visible in client code.
* n8n secret visible in client code.
* Supabase service_role key.
* Fake successful product results.
* Fake campaign performance data.
* Manual decision writes.
* Product testing writes.

### Deferred Items

The following are deferred:

* Persistent job table.
* Polling job status from Supabase.
* Manual research history.
* User authentication.
* Rate limiting per user.
* Product detail auto-redirect.
* TikTok Ads manual research.
* Bulk manual research by multiple IDs.

---

## Route Contract: /market-radar

### Page Name

Market Radar

### Purpose

Visual demand vs visible competition opportunity map.

### Primary Question

Where are the best demand vs visible competition gaps?

### Status

Placeholder for now.

### Future Allowed Content

When implemented, this page may show:

* Demand vs visible competition matrix
* CO opportunity quadrant
* MX opportunity quadrant
* Best opportunities
* Validated but competitive products
* Unclear products
* Avoid products
* Market and category filters

### Forbidden Content

Do not turn this page into:

* A product inventory table
* A dashboard duplicate
* A manual decision workflow
* A campaign tracking page

### Required Current Placeholder Behavior

Until implemented, it should remain a polished placeholder using AppShell, PageHeader, and PlaceholderCard components.

---

## Route Contract: /manual-review

### Page Name

Manual Review

### Purpose

Human review queue for products that should not be auto-prioritized.

### Primary Question

Which products need human judgment before testing?

### Status

Placeholder for now.

### Future Allowed Content

When implemented, this page may show products with:

* Risk = Review or High
* Recommendation = MANUAL REVIEW
* Weak demand signal
* Conflicting market signals
* High visible competition
* Policy-sensitive categories
* Supplier concerns

### Future Actions

Later, this page may include:

* Watchlist
* Reject
* Approve for test
* Add notes
* Assign priority

### Forbidden Until Manual Decision Phase

Do not add:

* Supabase writes
* Persistent decision buttons
* Auth-dependent features

### Required Current Placeholder Behavior

Until implemented, it should remain a polished placeholder using AppShell, PageHeader, and PlaceholderCard components.

---

## Route Contract: /opportunities

### Page Name

Opportunities

### Purpose

Prioritized opportunity workspace.

### Primary Question

Which products are the strongest candidates for controlled tests?

### Status

Placeholder for now.

### Future Allowed Content

When implemented, this page may show:

* Priority Test products
* Small Test products
* Opportunity by market
* Opportunity by category
* High-confidence candidates
* Products with strong global demand and lower local visible competition

### Forbidden Content

Do not turn this page into:

* Full product inventory
* Product detail page
* Manual review queue
* Market radar chart

### Required Current Placeholder Behavior

Until implemented, it should remain a polished placeholder using AppShell, PageHeader, and PlaceholderCard components.

---

## Route Contract: /tests

### Page Name

Tests

### Purpose

Track real product tests after launch.

### Primary Question

What are we testing, what happened, and what should we do next?

### Status

Placeholder for now.

### Future Allowed Content

When implemented, this page may show:

* Test campaigns
* Market
* Product
* Budget
* Spend
* Orders
* CPA
* ROAS
* Profit
* Status
* Continue, stop, scale recommendations

### Forbidden For Now

Do not add:

* Fake campaign performance data
* Test writes
* Budget tracking writes
* Campaign APIs

### Required Current Placeholder Behavior

Until implemented, it should remain a polished placeholder using AppShell, PageHeader, and PlaceholderCard components.

---

## Route Contract: /settings

### Page Name

Settings

### Purpose

Workspace and configuration settings.

### Primary Question

How should the DemandLab workspace be configured?

### Status

Placeholder for now.

### Future Allowed Content

When implemented, this page may show:

* Display preferences
* Scoring thresholds
* Market defaults
* Currency assumptions
* Integration status
* Environment check status

### Forbidden For Now

Do not add:

* Secret editing UI
* Service role key display
* API key display
* Auth settings until auth phase

### Required Current Placeholder Behavior

Until implemented, it should remain a polished placeholder using AppShell, PageHeader, and PlaceholderCard components.

---

## Future Step Prompt Requirements

Every future prompt should specify:

1. Step objective
2. Route affected
3. Exact components allowed
4. Exact components forbidden
5. Exact visible text
6. Exact button labels
7. Exact page order
8. Data source rules
9. Deferred items
10. Acceptance criteria
11. Security boundaries
12. Environment variables
13. Server/client responsibility split

If a requested change conflicts with PAGE_CONTRACTS.md, stop and report the conflict instead of guessing.
