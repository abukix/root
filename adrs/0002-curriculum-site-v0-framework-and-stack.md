---
adr_number: 0002
title: "Curriculum site v0 — framework, deployment, domain, and identity stack"
status: accepted
deciders: [@jc]
date: 2026-06-30
supersedes: null
superseded_by: null
tags: [adr, site, astro, tailwind, cloudflare-pages, brand]
---

# ADR 0002: Curriculum site v0: framework, deployment, domain, and identity stack

## Status

**Accepted**, 2026-06-30.

## Context

After /root v0.1.0 was pushed to GitHub as a private markdown repo, the question of *how* the content is consumed became immediate. Raw markdown browsed on github.com works for code-readers but is hard to use as the operator's daily source of truth, and the operator (the author) needs the curriculum to feel like a designed product, not a folder of text.

Multiple deferred decisions from the brand identity converge in this moment:

- Site framework (deferred)
- Deployment platform (deferred)
- Public URL structure (deferred; `abukix.dev` reserved, no commitment to subdomain shape)
- Visual identity v0 vs v1 (v1 was deferred to Arc 5 Capstone)
- Community channel (Slack workspace, not yet created)
- Releases UI (was undefined; CHANGELOG.md is the source)

The brand identity's substance-first rule originally said:
> "Polishing the visual brand before Arc 3 Phase 24 → brand without substance reads as performance."

But the operator's reasoning has shifted: **the site is operational tooling**, not marketing. The curriculum is denser than the operator can comfortably navigate as raw markdown. A polished site makes the curriculum usable during operation. That reframes the investment from "vanity polish" to "operator tool," a different category than the substance-first rule was guarding against.

Two related decisions also converge here:

1. A previous Astro project exists (Starlight-based, archived) with usable SVG assets (logos + favicon + og-image) but a docs framework choice (Starlight) that fights the desired dark-themed design pattern (gradient accents, custom callouts, specific card layouts).
2. The community-channel question (Discord vs Slack vs Matrix): Slack chosen because the operator wants the channel-per-service pattern (#help-root, #help-basecamp, #help-warden, etc.) common at large tech workspaces.

## Decision

**Curriculum site v0 ships with the following stack:**

| Layer | Decision |
|---|---|
| **Framework** | Astro 7 + Tailwind CSS 4 (no Starlight) |
| **CSS approach** | Tailwind 4 via `@tailwindcss/vite` plugin; config-in-CSS at `src/styles/base.css` (`@theme` block); no separate `tailwind.config.*` file |
| **Typography** | `Inter Variable` for body/display; `JetBrains Mono Variable` for code + brand wordmark |
| **Content collections** | Astro content collections at `src/content/docs/` (existing curriculum) |
| **Docs system** | Custom Astro pages — sidebar nav + breadcrumbs + Pagefind search built from scratch (not Starlight) |
| **Hosting** | Cloudflare Pages (free tier; preview deployments per PR) |
| **Domain** | `root.abukix.dev` (curriculum); `abukix.dev` apex reserved for future brand-level site |
| **Releases UI** | CHANGELOG.md drives the `/releases/` page; cards per release; series grouping |
| **Community** | Slack workspace `abukix.slack.com` (free tier); channel-per-project pattern (`#help-root`, `#help-basecamp`, future `#help-warden`, etc.); icon in site header |
| **Visual identity v0** | Existing `/root` JetBrains Mono wordmark (SVG) + favicon + og-image, migrated from the archived project's `public/` |
| **Visual identity v1** | Still deferred to Arc 5 Capstone period (logo polish, full color system, typography commit) |

The Astro project structure lands inside the `/root` repo itself (same repo as the curriculum content). The old Starlight-based Astro project becomes archival; its Starlight setup is discarded.

## Consequences

**Positive:**

- The operator gains a daily-usable, well-designed source of truth for the curriculum.
- Pure Astro + Tailwind = pixel-perfect control to match the design pattern (vs fighting Starlight's defaults).
- Tailwind 4's config-in-CSS (`@theme` in `src/styles/base.css`) removes the separate JS config file: one fewer thing to keep in sync, and design tokens sit alongside the CSS that uses them.
- Cloudflare Pages provides preview deployments per PR, composing cleanly with [ADR-0001](./0001-solo-operator-with-disciplined-review.md)'s overnight-review rhythm.
- Visual identity v0 commits with minimal cost (assets already exist); v1 polish remains future work.
- Slack channel-per-service pattern is operationally proven (widely used at hyperscale-company workspaces); transfers cleanly to Abukix scale.
- CHANGELOG-driven releases page = single source of truth; no separate release-notes maintenance.

**Negative:**

- Framework lock-in: Astro 7 + Tailwind 4 are current majors as of 2026-07 but will eventually need migration. Mitigated by Astro's strong backwards compatibility and Tailwind 4's stable CSS-native config surface.
- Building the docs system from scratch (sidebar, breadcrumbs, search) is more work than adopting Starlight. ~5-7 hours of authoring vs ~0 with Starlight defaults. Justified by pixel-perfect design output.
- Cloudflare Pages requires a Cloudflare account; vendor dependence. Mitigated: deployment config is portable; static-site output works anywhere.
- The substance-first rule in the brand identity is partially overridden: visual identity v0 commits at Year 0 (not Arc 5). Justified by the reframing: site is operational tooling, not marketing polish.
- Slack free tier has 90-day message-history retention. Acceptable for `#help-*` support channels; not load-bearing for institutional memory (a private operational-record corpus carries that separately).

**Neutral:**

- The /root repo now contains BOTH curriculum content AND site code (Astro project files at the root). Single source of truth; no cross-repo coordination.
- The CHANGELOG is now load-bearing for two purposes: traditional release notes AND the public `/releases/` page rendering source.

## Alternatives considered

### 1. Astro + Starlight (the previous project's stack)

**Why considered:** Starlight is Astro's purpose-built docs framework. Provides sidebar, breadcrumbs, search, dark mode out of the box. ~70% of the docs work for free.

**Why rejected:** Starlight has its own visual language (clean docs-app feel, white-ish content cards, conventional sidebar layout). Matching the target design (dark theme, gradient accents, custom callouts, specific card layouts) means heavy CSS overrides that fight Starlight's defaults. Result would be ~75% design match with rough edges showing through. For the operator's daily-use criterion, the 25% polish gap matters.

### 2. Next.js + Tailwind

**Why considered:** Most popular React framework; capable of everything we need; large ecosystem.

**Why rejected:** Heavier than necessary. Astro is purpose-built for content-heavy static sites; bundles less JavaScript; faster to develop content-first. Next.js's React-everywhere mental model isn't a fit for a curriculum site that's 90% markdown.

### 3. Hugo + custom theme

**Why considered:** Mature static-site generator; fast builds; large theme ecosystem.

**Why rejected:** Hugo's templating language (Go templates) is more limited than Astro's component model. Custom theme work in Hugo to match the target design would be harder than in Astro.

### 4. Pure HTML + Tailwind + a small generator script

**Why considered:** Maximally simple; no framework lock-in.

**Why rejected:** Loses the markdown-to-page pipeline that content collections provide. Loses type-safe frontmatter validation. Loses Pagefind integration. Would require building infrastructure that Astro provides for free.

### 5. GitHub Pages instead of Cloudflare Pages

**Why considered:** Simplest deployment; free; integrated with GitHub directly.

**Why rejected:** No preview deployments per PR (which the [ADR-0001](./0001-solo-operator-with-disciplined-review.md) workflow benefits from). Slower CDN. No native image optimization. Cloudflare Pages is strictly better for ~zero additional cost.

### 6. Discord workspace instead of Slack

**Why considered:** Strong OSS-community precedent; some pattern-engineering communities live there.

**Why rejected:** The operator prefers the channel-per-service Slack pattern (`#help-X`, `#help-Y`). That pattern transfers natively to Slack's UX; Discord's "server with channels" model is structurally similar, but the channel-discovery and threaded-conversation UX differs. Slack matches the operator's mental model.

### 7. Apex domain `abukix.dev` (not a subdomain) for the curriculum

**Why considered:** Simpler URL; "abukix.dev IS the curriculum site."

**Why rejected:** The curriculum is one Abukix artifact among (eventually) many: `basecamp` and its 8 modules, standalone Arc 1 tools, the broader brand. Reserving the apex for the umbrella brand site (when it eventually exists) keeps long-term namespace clean. `root.abukix.dev` is the curriculum specifically.

## Follow-ups

- [x] Author this ADR
- [x] Scaffold Astro project structure (package.json, astro.config.mjs, tailwind.config.mjs, tsconfig.json)
- [x] Migrate SVG assets (logo, logo-light, logo-dark, favicon, og-image) from the archived project
- [x] Author base layout (BaseLayout.astro + Header + Footer)
- [x] Author hello-world homepage (src/pages/index.astro) with hero shape
- [x] Define content collection schema (src/content.config.ts): permissive passthrough
- [ ] **In subsequent phases**: build out landing-page sections (capability cards, feature mockups, devices grid)
- [ ] Build custom docs system (sidebar nav + breadcrumbs + callouts + Pagefind search)
- [ ] Build `/releases/` page driven by CHANGELOG
- [ ] Create Slack workspace `abukix.slack.com`; start `#help-root` + `#announcements`
- [ ] Deploy preview to Cloudflare Pages; iterate
- [ ] Custom-domain config: `root.abukix.dev` → Cloudflare Pages
- [ ] Flip GitHub repo from private to public when v0.2.0 ships
- [ ] Update the [`brand`](https://github.com/abukix/brand) repo's [`identity.md`](https://github.com/abukix/brand/blob/main/identity.md) to reflect visual identity v0 commitment

## References

- [ADR-0001](./0001-solo-operator-with-disciplined-review.md): the workflow this site operates under
- [**`brand/identity.md`**](https://github.com/abukix/brand/blob/main/identity.md): the brand identity this site renders (external repo)
- [program/ai-learning-protocol.md](../src/content/docs/program/ai-learning-protocol.md): discipline this site visibly enforces
- Astro 7 docs: https://docs.astro.build/
- Tailwind 4 docs: https://tailwindcss.com/docs
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Pagefind: https://pagefind.app/
- The previous Starlight-based Astro project (archived after migration; assets reused)
