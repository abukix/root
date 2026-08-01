---
title: "Multi-cloud Synthesis"
description: "Phase 24 of /root Arc 3: integration phase. Add GCP as the compare cloud. Run basecamp on K3s + EKS + GKE from one GitOps repo. The basecamp repo goes public. Proof Arc 3's patterns transferred.."
tags: [arc-3, infrastructure, multi-cloud, gcp, capstone]
arc: 3
phase: 24
---

> Eighth phase of Arc 3. Integration, not new content.
> Multi-cloud basecamp. The repo goes public.

Phases 17-23 added a lot: kernel internals, networking, containers from scratch, K8s, distributed systems, IaC, AWS. This phase doesn't add an eighth thing. It *proves* the previous seven transferred. GCP is the compare-cloud step at year scale. Multi-cloud basecamp is the integration. `basecamp` going public is the artifact.

This is also the moment Arc 3 stops being internal practice and starts being a portfolio. `basecamp` flips from private to public. Anyone landing on its GitHub repo now sees a multi-cloud GitOps platform with forge + beacon + observability + mesh. That's the senior-engineer signal.

---

## Prerequisites

> - All of [Phases 17-23](/program/arc-3/) complete
> - GCP $300 credits available
> - basecamp substrate + `forge` alive on homelab + AWS
> - You accept: **this phase is the proof, not the lesson. Lessons happened in Phases 17-23. Here you make them visible.**

---

## Why this phase exists

A capstone integration phase serves two purposes. First, it forces previous phases' work to actually *compose*: most engineering pain happens at integration boundaries. Second, it produces a visible artifact (the public basecamp repo) that proves Arc 3 happened.

The GCP compare is the year-scale instance of the COMPARE step. If GCP feels easy after Phase 23's AWS, the pattern transferred. If GCP feels foreign, AWS taught you AWS-specific naming.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have a working platform on homelab + AWS. You have IaC + GitOps + paved-road discipline. The question: did the patterns transfer to a different cloud? If yes, basecamp runs on GCP with minimal changes. If no, you'll discover AWS-specific assumptions leaked into the platform.

---

## 2. PRINCIPLES

### 2.1 Multi-tenancy

A multi-tenant platform serves multiple isolated workloads on shared substrate. At Arc 3 scale, "multi-cloud" is a form of multi-tenancy.

→ Pattern: `multi-tenancy`: first OUTLINE

**Investigate:**
- What does isolation mean across clouds (identity, network, data, control plane)?
- When does multi-cloud add real resilience vs complexity tax?
- What changes about developer experience with 3 clouds vs 1?

### 2.2 Cloud abstraction (the limits)

You discovered in Phase 22 that IaC doesn't actually abstract clouds. The platform layer has more abstraction potential: the developer says "deploy this service" and the platform decides which cloud.

**Investigate:**
- What does `ascent new service` need to do differently for GKE vs EKS?
- Which basecamp services *can* run anywhere, and which are pinned?
- Where does AWS-specific assumption leak into the platform layer?

### 2.3 Cost across clouds

Each cloud has different pricing curves. Egress expensive on AWS, less on GCP. GPU instances easier to reserve on GCP for short bursts. Storage costs vary.

**Investigate:**
- Where does basecamp cost-optimize for AWS in ways that won't transfer?
- What's the right cost-distribution strategy for production on both?
- Why is cross-cloud egress almost always the largest unexpected cost?

### 2.4 Capstone discipline

A capstone is *subtractive*. What do you cut to keep the narrative clear?

**Investigate:**
- Smallest GCP services you need to prove the pattern transferred?
- What does basecamp's README need to look like for a stranger to grok in 5 minutes?
- Which substrate + `forge` components don't need to be visible in the public repo?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Multi-cloud scope | All workloads; selected critical; one workload | Wider scope = exponentially more ops. One workload everywhere is enough to prove pattern. |
| GCP managed | GKE Autopilot; GKE Standard; raw VMs | Autopilot: locked-in. Standard: comparable to EKS. VMs: closest to homelab K3s. |
| Repo visibility | Fully public; public with private submodules; staged | Fully public: strongest signal, requires hygiene. Sub-modules: pragmatic. Staged: hedging. |
| Integration scope | Add GCP; integrate everything; cut something | Subtract to clarify. |

---

## 4. TOOLS (as of 2026-06)

- **`gcloud` CLI**
- **GKE Standard** (not Autopilot; operational visibility matters)
- **Cloud SQL** for Postgres
- **GCS** for object storage
- **Secret Manager** for secrets

### Reading
- "Google Cloud Platform in Action" (Geewax)
- GCP docs: *Foundations* and *Networking* concepts

---

## 5. MASTERY: Multi-cloud basecamp

### 5.1 The integration

- Provision small GKE via your forge GCP modules
- Connect GKE to basecamp's ArgoCD as a target
- Deploy `beacon` to GKE in parallel with EKS and K3s
- Wire Cilium Mesh across all three (or use federation pattern)
- Update `ascent` to support `--target gke|eks|k3s` (Phase 26 deepens ascent)
- Verify `ascent new service hello --target gke` works end-to-end

### 5.2 Going public

Flip basecamp's repo from private to public. Before flipping:

- No secrets in Git history (`git-secrets` or `trufflehog` scan)
- Strong README: what is basecamp, what does it run, who is it for, how to read it
- LICENSE chosen (Apache 2.0 or MIT)
- Architecture diagram included
- ADRs published

### 5.3 Operational depth checklist

```
[ ] GKE small cluster provisioned via forge; destroyed cleanly
[ ] ArgoCD multi-cluster: same Application synced to both EKS and GKE
[ ] ascent --target gke working end-to-end (foreshadow Phase 26)
[ ] basecamp repo scanned for secrets; clean
[ ] basecamp public on GitHub; README explains in 5 minutes
[ ] Two services running on all 3 clouds; same Helm chart, different cluster targets
[ ] Cost dashboard showing AWS + GCP + homelab side-by-side
[ ] Demo: deploy a new service via ascent to all 3 clouds in one command
```

---

## 6. COMPARE: Cost analysis

Run the same workload on AWS, GCP, homelab for 1 week. Capture cost. Build a small markdown table showing total cost per service per cloud.

400-word reflection: where did surprises come from? Predictable from docs vs not? Single cloud for next employer, and which and why?

---

## 7. OPERATE

- 3-4 runbooks: multi-cloud
- 1-2 ADRs (EKS as primary, GKE as DR, or similar)
- Weekly log

---

## 8. CONTRIBUTE

- ArgoCD multi-cluster docs
- Cilium federation / cluster-mesh docs
- `gcloud` CLI corpus

---

## What ships from this phase

- **basecamp repo goes public**: the most consequential ship of the year
- **GKE-side of basecamp** alive, parallel to EKS and K3s
- **Architecture diagram + ADRs** published in basecamp/docs
- Arc 3's public artifact set: forge, beacon, basecamp

---

## Validation criteria

```
[ ] Multi-cloud basecamp working (K3s + EKS + GKE)
[ ] basecamp repo public; README + LICENSE + architecture diagram
[ ] ascent --target flag working for all 3 clouds (foreshadow Phase 26)
[ ] All 8 operational depth checks
[ ] Cost comparison reflection (400 words)
[ ] 3-4 multi-cloud runbooks
[ ] Pattern entries:
    - multi-tenancy → first OUTLINE
    - all prior Arc 3 patterns reinforced toward DEEP
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Provision fresh GKE cluster via forge; connect to ArgoCD; deploy `hello` to it. Verify mTLS works between `hello` on GKE and `beacon` on EKS via mesh federation (or document why federation is too expensive at this scale).

### Part 2: Articulate (90 min)
~1200 words: *"basecamp is now multi-cloud. Defend the choice. Cover developer experience, operational cost, resilience, vendor lock-in, and what specifically you'd change to add a third cloud (Azure). Cite Arc 3 patterns."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Going public with secrets in Git history | Biggest career-impacting mistake. Scan thoroughly. |
| Treating multi-cloud as goal, not test | Point is "the patterns transferred." Celebrate that, not the diagram. |
| Adding GCP services not present in AWS | Compare requires symmetry. |
| Sprawling README | Reviewer has 5 minutes. Lead with what basecamp is + a diagram. |

---

## Patterns touched this phase

- `multi-tenancy`: first OUTLINE
- All Arc 3 patterns reinforced toward DEEP

---

→ Next: [Phase 25: Service Mesh + Zero-Trust Networking](/program/arc-3/phase-25/)
