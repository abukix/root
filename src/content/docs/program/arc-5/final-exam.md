---
title: "Arc 5 Capstone + Final Exam — vantage + Pattern Paper"
description: "The graduation gate for /root. The capstone. vantage MVP launched publicly + Pattern Paper (3,500-5,000 words) published. Scenario-based final exam covering the AI infrastructure stack. The program completes here."
tags: [arc-5, final-exam, capstone, graduation]
arc: 5
---

> The graduation gate for /root. The capstone. The end.
> Scenario-based exam + capstone work (vantage MVP + Pattern Paper).

By the time you sit Arc 5's exam, basecamp has all 8 modules alive (`warden` from Phase 50). The 12 shipping artifacts are public. The `chronicle` holds ~250 weekly logs, ~25 postmortems, ~140 runbooks. You've shipped `prism` and the MCP servers loudly. The pattern depth is real: ~30-40 patterns at DEEP, ~60-70 at OUTLINE+.

Now you ship the capstone: **`vantage`** (the unified UI, the visible product surface) and the **Pattern Paper** (3,500-5,000 word synthesis essay distilling the multi-arc journey). Together they are the senior-IC interview portfolio.

This is also the program's graduation. After this, /root is complete. The career begins.

---

## Ship gates (verify before sitting the exam)

```
[ ] All 12 Arc 5 phases complete; `prism` + `loom` + `warden` alive
[ ] basecamp `vantage` in progress (the Capstone produces it)
[ ] prism v0.1 + MCP servers public
[ ] `warden` alive — AIOps operational
[ ] vantage MVP working at the public site (whatever you've decided to call it)
[ ] Pattern Paper draft in progress (3,500-5,000 words, due 4 weeks after exam)
[ ] All Arc 1-Arc 5 phase Exit Tests passed (50 of them)
[ ] ~60-70 Pattern Library entries at OUTLINE+; ~30-40 at DEEP
[ ] chronicle: ~250 weekly logs, ~25 postmortems, ~140 runbooks, ~15 ADRs
[ ] At least 5 merged upstream PRs across the 5 years
[ ] multi-year journal in the Story doc with monthly + yearly retrospectives
```

If any ship gate is missing, finish it before sitting the exam.

---

## The Capstone: what you build

### `vantage`

A single artifact: a public, working web UI + command palette that renders every basecamp module to a reviewer in 5 minutes. Layout:

```
public-site/
├── /                       ← landing: "Building an AI Platform in Public. Kernel to LLM."
├── /program/               ← /root curriculum (Arc 1-Arc 5)
├── /basecamp/              ← LIVE: module status, agent activity, recent deploys
│     ├── Overview          ← live K8s state, service map, recent activity
│     ├── Services          ← every basecamp service, SLO, runbook link
│     ├── AI Activity       ← agent runs, prism usage, AIOps triages
│     └── Recipes           ← clickable composition flows
├── /patterns/              ← Pattern Library — ~70 patterns
├── /projects/              ← 9 OSS plans + repo links
├── /blog/                  ← ~250 posts
│     └── /pattern-paper/   ← THE PAPER
├── /talks/                 ← 5+ recorded talks
└── /capstone/              ← the integrated arc doc
```

vantage MVP requirements:
- Public; deployable from its own repo source
- Authentication on the live basecamp surface (read-only)
- Command palette (Cmd-K) for navigation + common actions
- 3+ composition recipes (e.g., "Deploy an ML model end-to-end", "Investigate an incident", "Onboard a new service")

### Pattern Paper

A 3,500-5,000 word synthesis essay. Published at `/blog/pattern-paper/`. Audience: a senior engineering hiring manager. The reader should finish in 20 minutes feeling they understand how you think.

**Prompt:** *"What patterns actually compounded across 5 years of operating basecamp? Which were predicted in the [program overview](/program/overview/) and held? Which were over-rated? Which emerged that you didn't expect? Write the synthesis."*

**Structure (suggested):**

1. The bet revisited: restate /root's pattern-first bet; what did you stake?
2. Patterns that held: 5-7 patterns that compounded as predicted; cite evidence from real work
3. Patterns that under-delivered: 2-3 patterns that didn't pay expected interest; honest why
4. Patterns that emerged unexpectedly: 2-3 patterns you didn't plan but turned out load-bearing
5. The K8s-native ecosystem meta-pattern: your synthesis of why composition over isolation won
6. What you'd do differently: honest reflection
7. What comes next: deferred work + how the patterns prepare you for it

**Pass bar:**
- 3,500-5,000 words
- Cites at least 10 patterns by name with specific examples
- No fluff; every paragraph earns its place
- Reads like a senior engineer's lessons, not a textbook chapter
- Honest about what didn't work

---

## The Exam: three parts, 6 hours

### Part 1: Build (180 min)

**The task:** Add a new feature to vantage that ties together at least 4 prior phases.

Spec: A new vantage "Recipe" called *"Run a fine-tune + deploy"*. Click button, and vantage:
- Creates a fine-tune RayJob (Phase 45) via the ascent operator (Phase 26)
- Tracks the run in MLflow (Phase 39)
- On completion, registers + promotes to Staging
- Deploys via KServe with canary + scale-to-zero (Phase 38 + 43)
- Routes traffic through `prism` (Phase 46) with a new prompt version (Phase 47)
- Updates the AI Activity panel with run status (Phase 48 + 50)

All declarative, all K8s-native, all reproducible from Git.

**Pass bar:**
- After 180 minutes, the recipe works end-to-end
- All components are CRDs reconciled by operators
- Telemetry visible
- AI security + observability hooks in place

**Anti-pattern checks (auto-fail):**
- Imperative shortcuts
- Skipping evals or security
- AI-generated code (the Build is your hands)

### Part 2: Defend (90 min)

Live oral defense (recorded) or written defense, on **one of three** prompts:

**A. The K8s-native ecosystem bet.**
> Defend basecamp's K8s-native ecosystem choice across all 9 tiers. Engage with the hardest counterargument (e.g., "you've locked in to Kubernetes; what when something replaces it?"). Cite at least 12 patterns.

**B. The /root program design.**
> Defend the pattern-first program design spanning 5 arcs and 50 phases. Engage with "you could have learned this in 18 months focused on AI/ML directly" or "you over-invested in infrastructure for an AI Infra role." Cite measurable outcomes.

**C. The capstone choice.**
> Defend vantage + Pattern Paper as the capstone (vs alternatives: another OSS project, a hardened production service). Engage with "vantage is a fake UI without real users." Cite the patterns vantage surfaces vs hides.

Pass bar: ~1500 words written or 15 minutes spoken; 12+ patterns cited; engages with counterargument honestly.

### Part 3: Articulate the Pattern Paper preview (90 min)

You'll submit the Pattern Paper 4 weeks after the exam. In the exam, deliver the **opening 1500 words** of the paper, the section that hooks the reader.

Pass bar:
- Compelling opening (would a hiring manager keep reading?)
- The pattern-first bet stated clearly
- 3+ patterns named with concrete examples ready to expand
- Pattern of "honest about what didn't work" established

---

## Scoring

Each part: Pass / Pass-with-notes / Fail. Plus Pattern Paper submitted on time + meets bar.

| Outcome | Meaning |
|---|---|
| 3 Pass + paper landed | Full graduation. /root is complete. |
| 2 Pass + 1 Pass-with-notes + paper landed | Graduation with action item: address in 4-week post-exam period. |
| 2 Pass + 1 Fail OR paper not landed | Conditional graduation. Re-attempt in 6 weeks. |
| ≤ 1 Pass | Not yet. Identify gap; 6-8 weeks more work; retake. |

---

## After passing

```
You can:
- Operate an ML platform (Ray, MLflow, KServe, Feast) on K8s-native substrate
- Ship a working LLM gateway with routing, caching, observability, fallback
- Build agents that use tools via MCP with structured outputs + evals
- Reason about train/serve parity, embeddings, vector search, RAG at first principles
- Defend AI security posture (prompt injection, capability allowlisting, signed models)
- Build product surfaces (vantage) over infrastructure
- Write synthesis prose that distills 5 years into a 20-minute read
- Build a custom Kubernetes operator (kubebuilder) for platform abstractions

The capstone artifact:
- basecamp public on GitHub: all 8 modules alive K8s-native across multi-cloud
- 9 OSS projects: sift, pulse, beacon, forge, ascent + custom operator,
                  crag umbrella, prism, MCP servers, vantage
- warden: agents operating the platform
- chronicle: ~250 weekly logs, ~25 postmortems, ~140 runbooks, ~15 ADRs
- ~70 patterns at OUTLINE+, ~30-40 at DEEP
- public site: blog with ~250 posts, /talks/ with 5+ recordings,
               /capstone/ with the Pattern Paper

Exit ramp: ML Platform / AI Infrastructure at frontier labs
Compensation range: $300K-$700K base, $500K-$1.2M total depending on company stage

Interview pitch (one sentence):
  "I spent 5 years building an AI platform from the kernel up — opensource,
   K8s-native, end-to-end. 9 tiers from K3s through an LLM gateway with AIOps
   agents on top. Same patterns the platforms I'd be operating run at scale.
   Here's the URL. The Pattern Paper explains the 60 months that got me here."
```

→ The program completes. Welcome to the senior tier.

---

## Anti-patterns when sitting the exam + writing the paper

| Anti-pattern | Why |
|---|---|
| Treating as memory test | Competence test |
| Compressing breaks | Cognitive fatigue produces wrong answers |
| AI coding the Build | Auto-fail |
| Pattern Paper as feature list | Features are evidence; patterns are argument |
| Citing patterns without specifics | "GitOps was useful" is empty. "GitOps caught the sift regression on 2027-03-15, see ADR 0042" is real. |
| Skipping public publication | The paper unpublished is half an artifact |
| Re-taking immediately on a Fail | 6-8 weeks. The program ends when the work is real, not when the calendar says. |
