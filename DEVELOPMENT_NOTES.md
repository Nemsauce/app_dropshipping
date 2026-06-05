# DEVELOPMENT_NOTES.md

## Purpose

This file tracks deferred work, decisions, assumptions, and follow-up items for DemandLab.

AGENTS.md defines how agents should work.
DEVELOPMENT_NOTES.md tracks what remains to be done and when.

## Current Phase

Frontend foundation and static UI structure.

Supabase, real data, auth, and backend behavior are intentionally deferred.

## Completed Steps

### Step 1: Visual Foundation

Status: Approved

Notes:

* Premium dark DemandLab visual direction approved.
* Sidebar, header, KPI cards, filter bar, products table, and expanded signal panel created.
* Static mock data only.
* No backend connection.

### Step 2: Routes, Navigation, and Currency Context

Status: Approved

Notes:

* Base app routes created.
* Sidebar is route-aware.
* Placeholder pages created.
* Mock data now distinguishes Colombia and Mexico currency context.
* CO uses COP.
* MX uses MXN.

### Step 3: Frontend Scoring and Formatting Helpers

Status: Approved

Notes:

* Created reusable frontend formatting helpers.
* Created reusable scoring UI helpers.
* ScoreBadge now supports muted tone.
* StatusBadge can safely display backend-style recommendation strings.
* ProductsTable now uses shared score and formatting helpers.
* Scoring UI helpers now safely handle null or missing backend-like values.
* Supabase remains deferred.
* No backend, auth, API routes, or real data fetching added.

### Step 4: Read-only Supabase Dashboard Integration

Status: Approved

Notes:

* Added read-only Supabase client using NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
* Added Supabase product row types.
* Added Supabase product fetch utility for dashboard rows.
* Added product mapper from Supabase rows to ProductOpportunity UI model.
* Dashboard now renders real Supabase products when env vars are available.
* Dashboard falls back to mock data if env vars are missing, query fails, or no rows are returned.
* No service_role key used.
* No writes, auth, API routes, or manual decision workflow added.

### Step 5: Dynamic Selected Product Signal Panel

Status: Approved

Notes:

* Added dynamic selected-product analysis helpers.
* Expanded signal panel now uses the selected product instead of static mock signal data.
* Recommendation reasons are generated from the selected product.
* Selected product key details are generated dynamically.
* Panel language avoids unsupported claims like guaranteed winners or proven saturation.
* KPI cards remain static and deferred.
* Supabase remains read-only.
* No writes, auth, API routes, manual decisions, Product Detail page, or Market Radar added.

### Step 6: Dynamic Dashboard KPI Cards

Status: Approved

Notes:

* Added dynamic dashboard KPI helper.
* KPI cards are now calculated from the current product list.
* KPI cards work with real Supabase products or fallback mock products.
* Calculated KPIs include analyzed products, priority candidates, CO opportunities, MX opportunities, high competition, and policy risk.
* Supabase remains read-only.
* No writes, auth, API routes, Product Detail page, Market Radar, or test tracking added.

### Step 7: Dynamic Hero Mini Metrics

Status: Approved

Notes:

* Added dynamic hero metric helper.
* Queue Score is now calculated from product demand, confidence, and inverse visible competition.
* CO/MX Split is now calculated from actionable product market exposure.
* Review Load is now calculated from product risk and manual-review recommendations.
* Hero mini metrics now work with real Supabase products or fallback mock products.
* Supabase remains read-only.
* No writes, auth, API routes, Product Detail page, Market Radar, or test tracking added.

### Step 8B: Products Page Contract Correction

Status: Approved

Notes:

* Added PAGE_CONTRACTS.md before this correction to reduce interpretation drift.
* Corrected /products so it behaves as a product inventory explorer instead of a dashboard duplicate.
* Removed the large selected-product RecommendationPanel from /products.
* Kept summary cards, static exploration toolbar, and ProductsTable.
* Added Product Explorer Notes card below the table.
* Kept filtering, sorting, export, row click-through, and /products/[id] deferred.
* Supabase remains read-only.
* No writes, auth, API routes, Product Detail page, Market Radar, or manual decisions added.

### Step 9: Products Page Search and Filters

Status: Approved

Notes:

* Added dedicated client-side ProductsExplorer component for /products.
* /products page remains a server component that fetches read-only Supabase data and falls back to mock products.
* Added functional client-side search.
* Added functional Market, Recommendation, Risk, Provider, and Tier filters.
* Filters combine with AND logic.
* Summary cards now calculate from the filtered product list.
* Added Clear Filters behavior.
* Added empty state when no products match.
* Export View remains visible but disabled and intentionally deferred.
* Product Explorer Notes card remains below the table.
* Supabase remains read-only.
* No writes, auth, API routes, Product Detail page, Market Radar, or manual decisions added.

### Step 10B: Manual Research API Route

Status: Approved

Notes:

* Created secure server-side API route at /api/manual-research/dropi-id.
* API route validates Dropi product ID server-side.
* API route reads N8N_MANUAL_RESEARCH_WEBHOOK_URL and N8N_MANUAL_RESEARCH_SECRET from server-only environment variables.
* API route calls the protected n8n webhook server-side.
* API route does not expose the n8n webhook URL or secret to the browser.
* API route does not call Dropi, Meta Ads, Apify, or Supabase directly.
* Real curl test confirmed the workflow starts successfully through n8n.
* No /research UI added yet.
* No auth, packages, Supabase writes, or service_role usage added.

### Step 10C: Manual Research UI

Status: Approved

Notes:

* Created /research page for Manual Dropi ID Research.
* Added ManualResearchForm client component.
* Added client-side Dropi ID validation.
* Form submits valid IDs to /api/manual-research/dropi-id.
* Form does not call n8n directly from the browser.
* Form shows idle, loading, success, and error states.
* Status area shows session-level request status only.
* Page includes How It Works and Research Guardrails cards.
* Sidebar now includes Research between Products and Market Radar.
* No persistent job history, polling, product detail auto-redirect, fake completed results, auth, packages, or Supabase writes added.

### Step 11A: Products Search by Dropi ID

Status: Approved

Notes:

* Added product ID to /products client-side search.
* Updated search placeholder to make ID lookup explicit.
* /products can now search by Dropi product ID, product name, category, provider, tier, market, price, profit, recommendation, and risk.
* Existing filters still combine with search using AND logic.
* Fixed Supabase visibility issue by confirming RLS was enabled without a select policy and adding a read-only anon select policy for products.
* /products now shows real Supabase products instead of mock fallback data.
* /products remains a read-only product explorer.
* No writes, auth, API routes, schema changes, Product Detail page, Market Radar, or polling added.

### Step 11B: Data Reliability Metadata Read Layer

Status: Approved

Notes:

* Added data reliability metadata columns to the Supabase product read select.
* Added TypeScript row fields for run mode, Dropi catalog country, manual research request time, last researched time, research status, research error, and Meta checked timestamps.
* Confirmed manual research can populate reliability metadata in Supabase.
* UI display of reliability metadata remains deferred.
* Product Detail page remains deferred.
* Supabase remains read-only from the app.
* No writes, auth, API routes, packages, or UI changes added.

### Step 12B: Single Product Fetch Utility

Status: Approved

Notes:

* Added read-only getProductById(productId) utility.
* Reused the shared PRODUCT_SELECT from the product Supabase read layer.
* Reused the existing Supabase to ProductOpportunity mapper.
* Added mock fallback by product ID when Supabase is unavailable or no row is found.
* getProductsForDashboard remains unchanged.
* Product Detail route remains deferred.
* No UI, writes, auth, API routes, schema changes, polling, manual decisions, or test tracking added.

### Step 12C: Read-only Product Detail Page

Status: Approved

Notes:

* Created dynamic /products/[id] route.
* Product Detail fetches one product by Dropi ID using getProductById.
* /products/37759 renders successfully in the browser.
* Product Detail follows PAGE_CONTRACTS.md layout order.
* Product Detail shows available ProductOpportunity fields first.
* Reliability metadata and top ad evidence remain placeholder sections until raw fields are exposed through the UI model.
* Product not-found state exists.
* Page remains read-only.
* No writes, auth, API routes, packages, polling, manual decision controls, test tracking, or external calls added.

### Step 12D: Product Detail Metadata and Ad Evidence Display

Status: Approved

Notes:

* Exposed reliability metadata and top Meta Ads evidence fields through ProductOpportunity.
* Added required top ad evidence fields to SupabaseProductRow.
* Added required top ad evidence fields to PRODUCT_SELECT.
* Mapped Supabase raw metadata and ad evidence fields into the UI model.
* Updated /products/[id] to show real research freshness data when available.
* Updated /products/[id] to show stored top Meta Ads evidence links when available.
* /products/37759 now shows real research metadata in the browser.
* Product Detail remains read-only.
* No writes, auth, API routes, packages, polling, manual decisions, test tracking, or external calls added.

### Step 13A: Products Row Click-through

Status: Approved

Notes:

* Made ProductsTable support optional rowHref(product) navigation.
* /products now passes rowHref so product rows open /products/[id].
* /products/37759 opens correctly from the product table.
* Dashboard ProductsTable remains non-clickable because rowHref is not passed there.
* Preserved ProductsTable reuse.
* Product Detail remains read-only.
* No writes, auth, API routes, packages, polling, manual decisions, test tracking, external calls, or schema changes added.

### Step 14A: TikTok Creative Evidence Contract

Status: Approved

Notes:

* Added TikTok Creative Evidence feature contract to PAGE_CONTRACTS.md.
* Defined the purpose as finding accurately matching TikTok product creatives for researched products.
* Defined architecture boundary: no TikTok scraping from the browser or frontend components.
* Defined future architecture: /research to Next.js API route to protected n8n webhook, with n8n owning TikTok search, matching, filtering, scoring, and Supabase writes.
* Defined strict matching standard to avoid broad-category false positives.
* Defined accepted match labels: EXACT_PRODUCT and HIGHLY_SIMILAR_PRODUCT.
* Defined weak/rejected labels: RELATED_BUT_WEAK and REJECTED.
* Defined future storage fields for creative evidence.
* Defined future Product Detail display requirements.
* Defined language rules so TikTok creatives are treated as creative research, not proof of sales.
* No schema, UI, API routes, writes, auth, packages, n8n changes, TikTok calls, Apify calls, or fake creative data added.

### Step 14B: TikTok Creative Evidence Supabase Schema

Status: Approved

Notes:

* Created public.product_creatives table for TikTok creative evidence.
* product_creatives.product_id references public.products(id) with cascade delete.
* Added fields for creative URL, thumbnail, creator, caption, matched query, match confidence, match reason, product match type, country, source, found time, and raw payload.
* Added match confidence constraint for EXACT_PRODUCT, HIGHLY_SIMILAR_PRODUCT, RELATED_BUT_WEAK, and REJECTED.
* Added platform constraint for tiktok.
* Added indexes for product_id, match_confidence, and unique product/platform/creative_url.
* Enabled RLS on product_creatives.
* Added read-only anon policy that exposes only EXACT_PRODUCT and HIGHLY_SIMILAR_PRODUCT rows.
* Added updated_at trigger for product_creatives.
* No UI, app writes, API routes, auth, packages, n8n changes, TikTok calls, Apify calls, or fake creative data added.

### Step 14C: TikTok Creative Evidence Read Utility

Status: Approved

Notes:

* Added ProductCreativeRow TypeScript type for public.product_creatives.
* Added read-only getAcceptedCreativesByProductId(productId) Supabase utility.
* Utility filters by product_id, platform tiktok, and accepted confidence labels only.
* Accepted confidence labels are EXACT_PRODUCT and HIGHLY_SIMILAR_PRODUCT.
* Utility returns an empty array when product ID is empty, Supabase is unavailable, the query fails, or an exception occurs.
* Utility limits results to 12 and orders by found_at and created_at.
* No UI, routes, writes, auth, API routes, packages, schema changes, n8n changes, TikTok calls, Apify calls, or fake creative data added.

### Step 14D: TikTok Creative Evidence Product Detail Display

Status: Approved

Notes:

* Wired accepted TikTok creative evidence into /products/[id].
* Product Detail fetches accepted creatives read-only using getAcceptedCreativesByProductId(productId).
* Added TikTok Creative Evidence section after Top Meta Ads Evidence and before Guardrail Note.
* Section uses the required intro copy: Stored TikTok video examples for this product. These are creative research signals, not proof of sales.
* Empty state displays correctly when no accepted creatives are stored.
* /products/37759 shows the TikTok Creative Evidence section with the empty state.
* Creative cards are ready to show thumbnail, creator, caption, matched query, match confidence, match reason, product match type, country, found time, and external creative link when rows exist.
* Product Detail remains read-only.
* No writes, auth, API routes, packages, polling, n8n changes, TikTok calls, Apify calls, fake creative data, manual decisions, or test tracking added.

### Step 14E: TikTok Creative Evidence End-to-End Pipeline

Status: Approved

Notes:

* Extended the duplicated n8n manual research workflow with TikTok creative search through Apify.
* Added product-specific TikTok search query variants.
* Added TikTok creative branch gating with tiktok_creative_search_enabled.
* Added merge step to preserve Dropi product context before QA.
* Added TikTok creative QA with accepted confidence labels EXACT_PRODUCT and HIGHLY_SIMILAR_PRODUCT.
* Updated QA to prioritize real video creatives before slideshow/photo creatives.
* Added accepted creative explosion step matching public.product_creatives.
* Added Supabase upsert into product_creatives.
* Upsert uses on_conflict=product_id,platform,creative_url and merge-duplicates.
* Confirmed duplicate reruns do not crash.
* Confirmed product 37759 stores multiple TikTok creative examples.
* Confirmed Product Detail displays stored TikTok creatives.
* App remains read-only.
* No fake creative data, app writes, auth, API routes, packages, or Supabase schema changes added.

### Product Detail UI/UX Cleanup Pass 1

Status: Approved

Notes:

* Reduced visible technical clutter on /products/[id].
* Removed Research Freshness from the visible page.
* Renamed Market Comparison to Market Snapshot.
* Renamed Supply and Pricing to Supply Snapshot.
* Removed raw technical market rows from the visible Market Snapshot.
* Improved Product Detail copy to be more intuitive for ecommerce product testing decisions.
* Reworded score explanations, market copy, supply copy, Meta evidence copy, TikTok evidence copy, and guardrail copy.
* Simplified TikTok Creative Evidence cards to show only thumbnail and Open creative link.
* Product Detail remains read-only.
* No data fetching, business logic, Supabase schema, n8n workflow, API routes, auth, or packages changed.

## Deferred Items

### Supabase Write Operations

Status: Deferred
Do when: Manual decision workflow phase.
Reason: Read-only Supabase is connected. Writes should remain deferred until manual decisions are implemented safely.

### Real Product Data

Status: Deferred
Do when: After Supabase read utilities are added.
Reason: Current dashboard uses mock data to validate layout and UX first.

### Authentication

Status: Deferred
Do when: After the dashboard works with real Supabase data.
Reason: Auth is not needed for the first internal MVP.

### Market Radar Full Visualization

Status: Deferred
Do when: After real product data is available or after the scoring helpers are stable.
Reason: It needs real or well-shaped data to be useful.

### Product Detail Page

Status: Deferred
Do when: After product list data structure is stable.
Reason: It should reuse the same score helpers and real product fields.

### Manual Decision Workflow

Status: Deferred
Do when: After Supabase is connected.
Reason: Decisions must write to the database, so no fake persistence yet.

### Test Tracking

Status: Deferred
Do when: After product decisions exist.
Reason: Tests should be created from approved candidates.

### TikTok Creative Evidence

Status: Priority 1
Do when: Step 14.
Reason: Manual product research should also find accurately matching TikTok product creatives so the user can inspect real creative angles and video examples from Product Detail.

### Secrets Cleanup

Status: Deferred but mandatory before production.
Do when: Before deployment or before committing sensitive workflow exports.
Reason: Dropi, Apify, and Supabase service keys must not be committed or exposed.

### Multi-currency Normalization

Status: Deferred
Do when: Before serious financial comparisons across CO and MX.
Reason: Current UI shows explicit currencies. Later we may need normalized values for cross-market ranking.

### Predictive Statistical Models

Status: Deferred
Do when: After real test performance data exists.
Reason: Current ad-library signals are research signals, not sales outcomes.

### Null-safe Backend Field Handling

Status: Partially done, continue monitoring
Do when: During Supabase connection and real data integration.
Reason: Core UI helpers now handle common null values, but real Supabase rows may expose additional missing fields or unexpected values.

### Hero Metric Label Refinement

Status: Deferred
Do when: Dashboard polish phase.
Reason: CO/MX Split currently represents market exposure and can double-count CO + MX products. The label may later be refined to CO/MX Exposure for clarity.

### Product Detail Page Selected Product Expansion

Status: Deferred
Do when: Product Detail phase.
Reason: The dashboard selected-product panel is now dynamic, but a dedicated Product Detail page should later reuse and expand the same analysis helpers.

### Dropi Mexico Price Normalization

Status: Deferred
Do when: Before serious financial comparisons or before launch.
Reason: Some Mexico product rows show very large numeric prices/profits. We need to validate whether values are MXN, COP, cents, or unnormalized supplier values.

### Products Export View

Status: Deferred
Do when: Products page polish or reporting phase.
Reason: Export View is visible but disabled. Export should only be implemented once the product table columns, filters, and data shape are stable.

### Manual Dropi ID Research

Status: Priority 1
Do when: Step 10.
Reason: The user needs a way to manually submit a specific Dropi product ID and trigger the Meta Ads research pipeline through n8n.

### Manual Research Job Persistence

Status: Deferred
Do when: After initial manual Dropi ID trigger works.
Reason: The first version can submit to n8n and show session-level status. Persistent job history should come later with a dedicated Supabase table.

### n8n Manual Research Webhook

Status: Required for Step 10 implementation
Do when: Before or during Step 10 backend integration.
Reason: DemandLab should call a protected n8n webhook. n8n handles Dropi lookup, Meta Ads research, scoring, and Supabase upsert.

### Manual Research Product Lookup After Submit

Status: Deferred
Do when: After n8n reliably upserts manual research results into Supabase.
Reason: The current /research UI submits the request and shows session-level status. The next improvement should help the user find or refresh the researched product after n8n finishes.

## Current Assumptions

* n8n handles scraping and ingestion.
* Supabase stores product research data.
* Vercel/Next.js displays and analyzes the data.
* Meta Ads exact product search is the primary demand signal for now.
* Visible competition is not true saturation.
* ads_score is a prioritization score, not proof of profitability.
* winner_candidate means test candidate, not guaranteed winner.

## Notes From Latest Review

TikTok Creative Evidence is approved end to end, and the first Product Detail UI/UX cleanup pass is approved. Next priority is improving the main product list /products so users can scan opportunities faster before opening a product detail page.

## Step 3 Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* Existing routes still build correctly.
* Dashboard remains static and mock-data based.
* Ready to start Supabase planning in the next step.

## Step 4 Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* Dashboard route is now dynamically server-rendered.
* Supabase integration is read-only.
* Real product table data is connected.
* KPI cards and expanded recommendation panel still use mock/static supporting data and must be updated in a later step.

## Step 5 Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* Dashboard still renders.
* Products table still uses real Supabase data when available.
* Selected product panel now reflects the actual selected product.
* KPI cards remain static and should be handled in a later step.

## Step 6 Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* Dashboard still renders.
* Products table still uses real Supabase data when available.
* KPI cards now use dynamic values from the current product list.
* Hero mini metrics still use static values and should be handled in the next step.

## Step 7 Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* Dashboard still renders.
* Products table still uses real Supabase data when available.
* KPI cards use dynamic values from the current product list.
* Hero mini metrics now use dynamic values from the current product list.
* Main dashboard is now free of obvious static mock metrics, except placeholder routes and intentionally deferred features.

## Step 8 Planned Work

Status: Superseded by Step 8B

Notes:

* Replace /products placeholder with a real read-only product exploration page.
* Reuse Supabase product fetch and mock fallback.
* Reuse ProductsTable and dynamic selected-product panel.
* Add static toolbar and summary cards.
* Keep actual filtering deferred.
* No writes, auth, API routes, Product Detail page, Market Radar, or manual decisions yet.
* Initial Step 8 implementation was technically functional but too similar to the Dashboard. Step 8B corrected the route contract.

## Step 8B Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /products renders as a read-only product exploration page.
* /products uses real Supabase data when available and mock fallback when needed.
* /products now follows PAGE_CONTRACTS.md.
* /products no longer duplicates the dashboard selected-product analysis pattern.

## Step 9 Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /products still renders with real Supabase data when available and mock fallback when needed.
* Search works client-side.
* Market, Recommendation, Risk, Provider, and Tier filters work client-side.
* Filters combine with AND logic.
* Clear Filters resets all filters and search.
* Empty state appears when no products match.
* Export View remains disabled.
* /products still follows PAGE_CONTRACTS.md.

## Step 10A Planned Work

Status: In Progress

Notes:

* Add /research route contract for Manual Product Research by Dropi ID.
* Document the secure architecture: browser to Next.js API route to protected n8n webhook.
* Keep scraping, scoring, and Supabase upsert inside n8n.
* Do not create the API route yet.
* Do not create the /research UI yet.
* Do not modify app code yet.

## Step 10B Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /api/manual-research/dropi-id exists and builds as a dynamic server route.
* Manual curl test returned ok: true.
* n8n responded with Workflow was started.
* Next step should create the /research UI that submits Dropi product IDs to this API route.

## Step 10C Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /research route exists and builds.
* Sidebar includes Research.
* /research follows PAGE_CONTRACTS.md layout.
* Form validates Dropi product ID client-side.
* Form submits to /api/manual-research/dropi-id.
* Browser does not call n8n directly.
* No webhook URL or secret is exposed in client code.
* UI does not fake completed product results.

## Step 10C.1 Planned Work

Status: In Progress

Notes:

* Add Dropi catalog country to Manual Research.
* Update /research form to submit Dropi Product ID plus Dropi Catalog Country.
* Update API route to validate dropiCountry.
* Forward dropiCountry to n8n.
* Keep n8n responsible for Dropi lookup, Meta Ads research, scoring, and Supabase upsert.
* No direct Dropi, Meta Ads, Apify, or Supabase writes from the app.

## Step 11A Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /products search now includes product.id.
* Search placeholder now explicitly mentions ID lookup.
* Existing filters remain functional.
* Supabase products table had RLS enabled with no select policy, causing anon reads to return an empty array.
* Added read-only anon select policy for public.products.
* /products now renders real Supabase data.
* Dashboard and /research remain unchanged.

## Step 12A Planned Work

Status: In Progress

Notes:

* Define /products/[id] Product Detail route contract.
* Product Detail should show supply, pricing, demand signal, local visible competition, recommendation, research freshness, and top ad evidence.
* Product Detail must remain read-only.
* No route implementation yet.
* No writes, auth, API routes, polling, manual decisions, or test tracking added.

## Step 12B Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* getProductById(productId) exists and is exported.
* Single-product Supabase fetch uses PRODUCT_SELECT and maybeSingle().
* Mock fallback by ID is available.
* No Product Detail route was created.
* No UI changes were added.
* No writes, auth, API routes, packages, or schema changes were added.

## Step 12C Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /products/[id] route exists and builds as dynamic.
* /products/37759 renders successfully in the browser.
* Unknown product IDs render the polished not-found state.
* Page follows PAGE_CONTRACTS.md route contract.
* Page remains read-only.
* No writes, auth, API routes, packages, polling, manual decision controls, test tracking, or external calls were added.

## Step 12D Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* ProductOpportunity now exposes optional reliability metadata and ad evidence fields.
* SupabaseProductRow includes top ad evidence fields.
* PRODUCT_SELECT includes top ad evidence fields.
* Product mapper populates reliability metadata and ad evidence into the UI model.
* /products/37759 shows real research freshness metadata in the browser.
* Top Meta Ads Evidence section shows stored links when available and keeps the empty state when no links exist.
* Page remains read-only.
* No writes, auth, API routes, packages, polling, manual decisions, test tracking, or external calls were added.

## Step 13A Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /products table rows navigate to /products/[id].
* /products/37759 opens correctly from normal product browsing.
* Dashboard ProductsTable remains non-clickable.
* Existing selected row styling remains.
* Product Detail remains read-only.
* No writes, auth, API routes, packages, polling, manual decisions, test tracking, external calls, or schema changes were added.

## Step 14A Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* PAGE_CONTRACTS.md includes TikTok Creative Evidence feature contract.
* DEVELOPMENT_NOTES.md includes Step 14A planning and review notes.
* No app code changed.
* No schema changed.
* No UI added.
* No API routes added.
* No n8n changes added.
* No TikTok calls, Apify calls, or fake creative data were added.

## Step 14B Review

Status: Approved

Review notes:

* Supabase product_creatives table exists.
* product_id foreign key references products.id.
* RLS is enabled.
* anon read policy only exposes accepted creative evidence.
* Required indexes exist.
* Required constraints exist.
* updated_at trigger exists.
* No app code changed.
* No UI added.
* No API routes added.
* No n8n changes added.
* No TikTok calls, Apify calls, or fake creative data were added.

## Step 14C Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* ProductCreativeRow type exists and is exported.
* getAcceptedCreativesByProductId(productId) exists and is exported.
* Utility reads only accepted TikTok creatives.
* Utility returns [] safely on missing client, empty ID, error, or exception.
* No UI changed.
* No app writes added.
* No API routes added.
* No schema changes added.
* No n8n changes added.

## Step 14D Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* /products/[id] fetches accepted creatives read-only.
* Product Detail shows TikTok Creative Evidence section.
* Empty state appears when no creatives are stored.
* /products/37759 confirmed in browser with empty state.
* Page remains read-only.
* No writes, auth, API routes, packages, polling, n8n changes, TikTok calls, Apify calls, fake data, manual decisions, or test tracking were added.

## Step 14E Review

Status: Approved

Review notes:

* TikTok creative search runs through the duplicated n8n manual research workflow.
* TikTok query variants improved creative recall.
* QA stores accepted creatives and rejects weak matches.
* Video creatives are prioritized before slideshow creatives.
* Supabase product_creatives receives accepted creatives.
* Duplicate creative reruns merge correctly.
* /products/[id] displays TikTok creative thumbnails and Open creative links.
* Product Detail page remains read-only.

## Product Detail UI/UX Cleanup Pass 1 Review

Status: Approved

Review notes:

* npm run typecheck passed.
* npm run lint passed.
* npm run build passed.
* Product Detail copy is clearer and less technical.
* Product Detail has less visible clutter.
* TikTok creative cards are minimal.
* Meta evidence remains available.
* No writes or backend changes were added.
