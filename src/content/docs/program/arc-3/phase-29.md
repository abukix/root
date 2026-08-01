---
title: "FinOps + Cost Engineering"
description: "Phase 29 of /root Arc 3: cost as architecture. Cost attribution per tenant, reserved vs spot vs on-demand strategy, egress awareness, OpenCost. Apply FinOps discipline to basecamp's multi-cloud spend.."
tags: [arc-3, infrastructure, finops, cost]
arc: 3
phase: 29
---

> Thirteenth phase of Arc 3. Cost as an engineering concern.

Most engineering teams reason about cost only after the first surprising bill. Senior engineers treat cost as part of the architecture, alongside latency, availability, security. This phase installs that discipline. By phase end basecamp has cost attribution per workload, cost dashboards across all three clouds, reserved + spot strategies applied where they earn weight, and runbooks for "cost spike: investigate."

This isn't an accounting phase. It's an engineering phase. The patterns transfer to every later employer where cost-of-infrastructure is a real number on a real spreadsheet.

---

## Prerequisites

> - [Phase 28](/program/arc-3/phase-28/) complete; observability operational (cost is just another metric)

---

## Why this phase exists

In on-prem you buy hardware once. In cloud you pay continuously. This changes architecture: idle compute is expensive, cross-AZ traffic is expensive, data egress is *very* expensive. Architecture decisions made without cost awareness produce 2-3× cost overruns at scale.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

basecamp runs across K3s + EKS + GKE. Each charges differently for the same workload. You need to know where money goes (attribution), what's optimizable (analysis), what trade-offs to make (architecture). And you want to do this without becoming a finance team.

---

## 2. PRINCIPLES

### 2.1 Cost attribution

You can't optimize what you can't attribute. Per-workload, per-team, per-environment cost visibility.

→ Pattern: `finops`

**Investigate:**
- How does Kubernetes-native cost attribution work (per-namespace, per-pod)?
- What does OpenCost give you that AWS Cost Explorer doesn't?
- Why is "showback" different from "chargeback"?

### 2.2 Reserved vs spot vs on-demand

Three pricing models per cloud. On-demand: flexible, expensive. Reserved (or Savings Plans): commit for a discount. Spot: cheap, can be evicted.

**Investigate:**
- What workloads fit spot? (Hint: batch, stateless replicas, async work.)
- When do Reserved Instances vs Savings Plans win?
- What's the right ratio of RIs to on-demand for a steady-state workload?

### 2.3 Cross-AZ + egress costs

Cross-availability-zone traffic costs money. Cross-region traffic costs more. Egress to the public internet costs the most. These are invisible to most architecture decisions until they bite.

**Investigate:**
- AWS cross-AZ pricing: what are the exact numbers?
- Why is NAT Gateway $32/month just for being on?
- When does CDN in front of egress pay for itself?

### 2.4 Idle as a cost category

Idle compute is the largest cost waste in most cloud-native deployments. Workloads provisioned for peak but running at 15% average.

**Investigate:**
- What's the right utilization target for a fleet?
- How does autoscaling (HPA, VPA, cluster autoscaler) help?
- When does "rightsizing" become "underprovisioning"?

### 2.6 Node autoscaling with Karpenter

**Karpenter** is the K8s-native node autoscaler (Phase 20 deployed it). At FinOps scale, Karpenter's NodePool CRDs are how you express cost-optimization policies declaratively: "use spot instances when available, fall back to on-demand," "prefer arm64 for compute-bound workloads," "consolidate nodes when underutilized."

→ Pattern: `karpenter-as-finops-tool` (or just reinforcement of `finops` + `operator-pattern`)

**Investigate:**
- Walk a Karpenter NodePool CRD: declare allowed instance types + spot preference + consolidation policy → controller provisions optimally.
- Why does Karpenter beat the older cluster-autoscaler for cost optimization? (Hint: instance-type flexibility per pending pod, not static node groups.)
- What's "consolidation," and when does it save real money?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Pricing model | On-demand only; RIs/Savings Plans; mixed | On-demand: flexibility, premium. RIs: discount, commitment risk. |
| Spot strategy | All-spot; mixed; none | All-spot: cheapest, eviction risk. Mixed: pragmatic. None: stable, expensive. |
| Attribution tool | OpenCost; Kubecost; cloud-native (Cost Explorer + tags); none | OSS: K8s-native. Cloud: integrated, gaps for K8s. None: blind. |

---

## 4. TOOLS (as of 2026-06)

- **OpenCost** (CNCF Sandbox)
- **Kubecost** (commercial extension)
- **AWS Cost Explorer + tagging discipline**
- **GCP Billing Console**
- **Infracost**: predict TF cost changes in PRs

### Reading
- "Cloud FinOps" (J.R. Storment + Mike Fuller)
- AWS Well-Architected Cost Optimization pillar
- OpenCost docs

---

## 5. MASTERY: FinOps on basecamp

```
[ ] OpenCost deployed on basecamp K3s
[ ] Per-namespace cost attribution working
[ ] AWS + GCP cost explorers reviewed weekly
[ ] Tagging standard applied: env, owner, service, cost-center
[ ] Reserved Instances or Savings Plans applied where steady-state workloads warrant
[ ] Spot pool configured for at least one batch workload
[ ] Egress costs audited; one architectural change reduced them measurably
[ ] HPA + VPA enabled for production services
[ ] Cost-spike alert wired (e.g., daily spend > 2× rolling average)
[ ] Infracost in CI to predict TF cost impact
```

---

## 6. COMPARE: Kubecost

Install Kubecost (commercial; free tier exists); compare its insights vs OpenCost.

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: cost spike, idle resources, RI utilization low, autoscaling broken
- 1-2 ADRs (RI commitment level; spot strategy)
- Weekly log

---

## 8. CONTRIBUTE

- OpenCost docs or providers
- Infracost docs
- A blog post on a real cost-optimization story

---

## What ships from this phase

- **Cost dashboards** for basecamp multi-cloud
- **Cost runbooks**
- **Tagging discipline** as a documented standard

---

## Validation criteria

```
[ ] Per-namespace cost attribution working on basecamp
[ ] Reserved Instances or Savings Plans applied where appropriate
[ ] Spot used for at least one workload
[ ] Egress audit + one reduction made
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 cost runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - finops → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2 hours.**

### Part 1: Analyze (60 min)
Given basecamp's cost dashboard, identify the top 3 optimization opportunities. Propose specific changes with estimated savings.

### Part 2: Articulate (60 min)
~1000 words: *"Walk basecamp's cost structure. Top 3 line items per cloud. Where the architecture decisions drove cost. What you'd change with infinite optimization budget vs limited."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| "Just turn off the dev environment at night" without automation | Won't happen consistently |
| Reserved Instances for workloads that scale wildly | RIs lock in baseline; scale beyond pays on-demand |
| Untagged resources | Untaggable means unattributable means unoptimizable |
| Ignoring egress until the bill | Egress is the highest hidden cost in most deployments |

---

## Patterns touched this phase

- `finops`: OUTLINE

---

→ Next: [Phase 30: Reliability Engineering](/program/arc-3/phase-30/)
