---
title: "ML Evaluation + Monitoring"
description: "Phase 41 of /root Arc 5: offline + online evals, drift detection (data + concept), A/B testing for models, LLM-as-judge for open-ended tasks. `crag` matures to complete the ML-serving substrate."
tags: [arc-5, ml, evals, monitoring, drift]
arc: 5
phase: 41
---

> Third phase of Arc 5. The eval discipline.

You can't operate models without evaluating them. This phase installs the *eval discipline*: offline evals (does the model meet the bar before promotion), online evals (does it still meet the bar in production), drift detection (is the data the model sees still the data it was trained on), and LLM-as-judge for open-ended tasks (where ground truth is fuzzy).

By phase end basecamp continuous evaluation running: every promoted model passes offline gates, every Production model is monitored for drift + performance erosion, every detected issue routes to an alert. The discipline pays compound interest for Arc 5.s later LLM + agent phases; same eval patterns apply there with twists.

---

## Prerequisites

> - [Phase 40](/program/arc-5/phase-40/) complete; Feast operational
> - At least one model serving in Production via KServe

---

## Why this phase exists

Most ML projects measure once (during training) and never again. Production models silently degrade as data drifts; nobody notices until users complain. Eval discipline catches this: automated gates at promotion, continuous monitoring after deployment, alerts on drift, A/B tests for changes.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

A model is approved for Production based on offline metrics on a test set. In Production, the data it sees is subtly different (new users, seasonal shifts, business rule changes), or the relationship between features and labels has shifted (concept drift). The model's quality erodes. Without monitoring, you find out from a complaint.

---

## 2. PRINCIPLES

### 2.1 Offline evals as the promotion gate

Before promotion, the model must pass: held-out test set performance, slice-level performance (no group regression), robustness to known edge cases, behavioral checks (does it refuse appropriately).

→ Pattern: `evals`: **DEEP target this phase**

**Investigate:**
- What's a held-out test set vs a validation set? When does the distinction matter?
- What's a slice-level metric, and why does aggregate accuracy hide regressions?
- How do behavioral tests (CheckList-style) complement metric-based evals?

### 2.2 Online evals: A/B testing for models

In Production, route a fraction of traffic to a candidate model; compare its real-world performance against the current Production model. Statistical significance, sample size, ramp-up policy.

**Investigate:**
- Walk an A/B model test: cohort assignment, metric collection, significance test, ramp.
- Why is "interleaved" A/B better than "split traffic" for ranking models?
- What's the right minimum sample size for a reliable comparison?

### 2.3 Data drift detection

Data drift: the distribution of inputs shifts. Statistical tests (KS test, PSI) flag this. Drift doesn't always cause performance degradation, but it's the leading indicator.

→ Pattern: `drift-detection`

**Investigate:**
- Walk a Population Stability Index (PSI) calculation.
- Why does data drift sometimes NOT cause performance issues?
- What's the false-positive rate of drift alerts, and how do you tune it?

### 2.4 Concept drift detection

Concept drift: the relationship between features and labels changes. Harder to detect (requires ground truth labels eventually arriving). Performance monitoring is the proxy.

**Investigate:**
- What's the difference between data drift and concept drift?
- How do you detect concept drift without immediate ground truth?
- What's the typical lag between drift onset and detection?

### 2.5 LLM-as-judge for open-ended outputs

For tasks where ground truth is fuzzy (text generation, summarization), use an LLM to score outputs. Reliability requires careful prompt design, calibration, multiple judges.

→ Pattern: `llm-as-judge`

**Investigate:**
- Walk an LLM-as-judge prompt: rubric, examples, scoring scale.
- What's positional bias, and how do you mitigate?
- When is LLM-as-judge unreliable enough that human eval is required?

### 2.6 Evaluation as continuous pipeline

Evals run on a schedule (Argo CronWorkflow): pull recent production traffic, evaluate against current Production model, surface deltas. Not "we ran evals once."

**Investigate:**
- Design the eval CronWorkflow: data source, eval metrics, output destination, alert rule.
- How does the eval pipeline compose with MLflow tracking?
- What's the cost of comprehensive continuous evals?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Drift detection | **Evidently** (OSS); Arize; WhyLabs; custom | Evidently: K8s-native, OSS (recommended). Managed: convenience. Custom: control + ops. |
| LLM-as-judge model | GPT-4-class (closed); Claude-class (closed); open weights | Closed: best quality, $$ per judgment. Open: cheaper, quality varies. |
| A/B framework | Custom (Flagger from Phase 38); LaunchDarkly | Flagger: K8s-native (recommended). LaunchDarkly: feature flags + experiments. |
| Eval orchestration | **Argo CronWorkflows**; standalone scheduler; ad-hoc | Argo: composes with Phase 33 (recommended). |

---

## 4. TOOLS (as of 2026-06)

- **Evidently**: drift + monitoring; K8s-deployable
- **Promptfoo / Inspect**: LLM eval frameworks
- **MLflow**: metrics tracking
- **Argo CronWorkflows**: scheduling

### Reading
- "Designing Machine Learning Systems" (Chip Huyen): Ch. 8-9 on monitoring
- "Evaluating Machine Learning Models" (Alice Zheng)
- Evidently docs

---

## 5. MASTERY: Continuous eval pipeline

```
[ ] Evidently deployed via Flux + Helm
[ ] Define offline eval suite for one Production model: 20+ test cases
[ ] Define slice-level metrics; verify no group regression
[ ] A/B test framework via Flagger; route 5% to candidate model
[ ] Drift detection CronWorkflow: daily PSI on top 5 features
[ ] Alert on drift; verify Slack notification
[ ] LLM-as-judge for one open-ended task (e.g., summary quality)
[ ] Add eval-pass gate to MLflow promotion CI
[ ] Track eval metrics over time; observe natural drift
[ ] Document the eval contract for one model (what's measured, thresholds)
```

---

## 6. COMPARE: Arize or WhyLabs

Pick one managed monitoring service; explore free tier. Compare insights vs Evidently.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: drift alert investigation, slice regression diagnosis, LLM-as-judge prompt drift, A/B test ramp-up, eval pipeline failure
- 1-2 ADRs (Evidently over managed; LLM-as-judge model choice)
- Weekly log

---

## 8. CONTRIBUTE

- Evidently: features, docs
- Promptfoo / Inspect: eval definitions
- Public blog post on a real drift catch

---

## What ships from this phase

- **Continuous eval pipeline** on basecamp
- **Drift detection alerts** wired
- **LLM-as-judge** operational for at least one task
- **ML lifecycle discipline complete on basecamp**

---

## Validation criteria

```
[ ] Evidently deployed; drift alerts working
[ ] Offline eval suite gating promotion
[ ] A/B framework (Flagger) routing candidate models
[ ] LLM-as-judge for one open-ended task
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - evals → DEEP
    - drift-detection → OUTLINE
    - llm-as-judge → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Set up an Evidently drift report as an Argo CronWorkflow. Alert if PSI > 0.25 on any tracked feature. Trigger a deliberate drift; verify alert.

### Part 2: Diagnose (45 min)
A monitoring scenario (e.g., "drift alert fires daily but model performance looks fine"). Possible: false-positive PSI threshold; benign covariate shift; metric we care about isn't accuracy.

### Part 3: Articulate (15 min)
~400 words: *"When would you use LLM-as-judge vs human eval vs hard metric? Use one concrete example."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Eval once at training, never again | Production degrades silently |
| Aggregate accuracy as the only metric | Hides slice regressions |
| Drift alerts without action | Alert fatigue |
| LLM-as-judge without calibration | Judge bias contaminates results |

---

## Patterns touched this phase

- `evals`: **DEEP**
- `drift-detection`: OUTLINE
- `llm-as-judge`: OUTLINE

---

→ Next: [Phase 42: Vector Stores + Embeddings + RAG](/program/arc-5/phase-42/)
