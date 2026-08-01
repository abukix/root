---
title: "Platform Engineering: ship ascent + custom kubebuilder operator"
description: "Phase 26 of /root Arc 3: platform-as-product, made K8s-native. Paved-road CLI (ascent) emits Workload CRDs that a custom kubebuilder operator reconciles into the underlying Helm + Kustomize + Flux + NetworkPolicy + SLO stack. The Crossplane + custom kubebuilder operator pattern at homelab scale.."
tags: [arc-3, infrastructure, platform-engineering, kubebuilder, projects]
arc: 3
phase: 26
---

> Tenth phase of Arc 3. Platform-as-product, made K8s-native.
> Ship `ascent` **and** its custom kubebuilder operator, the platform-control module.

This phase is where basecamp stops being a personal homelab with services and starts being a *platform*: something another engineer could pick up, run a paved-road CLI against, and ship their own service. And it does it in the K8s-native pattern that Crossplane, kubebuilder, and every senior platform team converges on: **a custom CRD reconciled by a custom controller**.

By phase end you've shipped two things in concert:

1. **[`ascent`](/projects/ascent/plan/) v0.1**: a Go CLI that emits a `Workload` CRD when a developer runs `ascent new service my-app`.
2. **A custom kubebuilder operator**: a Kubernetes controller that watches `Workload` CRDs and reconciles them into the underlying state (Helm chart in Git, Kustomize overlay, Flux HelmRelease, NetworkPolicy, SLO definition, chronicle entry).

The user's interface is the CLI. The platform's interface is the CRD. The work happens in the controller. This is the *senior-IC differentiator* of the program.

---

## Prerequisites

> - [Phase 25](/program/arc-3/phase-25/) complete; mesh operational
> - basecamp substrate + `forge` alive multi-cloud
> - Go fluency (Phase 4); kubebuilder installed; familiarity with K8s controllers from observing CloudNativePG, Redis Operator, Karpenter in [Phase 20](/program/arc-3/phase-20/)
> - You accept: **platform engineering is a discipline. Tools change; the pattern of *CRD + controller + reconciliation* is what survives. Crossplane-driven platforms at frontier-lab scale codify this pattern at planetary scale.**

---

## Why this phase exists

Most platforms fail not because of technology but because of *developer experience*. A team that has to read 12 wiki pages, copy 8 YAML files, and Slack 2 senior engineers to deploy a new service will route around the platform. Or worse, they'll use it and resent it.

Platform Engineering treats the platform as a product, developers as customers, and developer experience as the unit of work. The K8s-native expression of this is: developers interact with the platform through CRDs, and a custom controller reconciles the CRD into the underlying state. The CLI is just a friendly UI on top of the CRD interface.

This is the pattern Crossplane's XRDs codify. The kubebuilder ecosystem exists to make this pattern accessible at any scale, including a homelab platform.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have a platform (substrate + `forge`). You have developers (yourself, hypothetically a team). They want to ship services. Each service needs: Git repo, CI/CD, Helm chart + Kustomize overlay, deploy templates, service mesh integration, secrets, observability, SLO definitions, runbook templates.

If every service does this from scratch, snowflakes. If the platform does it via *paved-road CLI → CRD → controller*, every service starts identically and the platform's discipline scales without manual intervention.

---

## 2. PRINCIPLES

### 2.1 Platform-as-product

Platform is a product. Developers are customers. Their experience is the unit of work.

→ Pattern: `platform-as-product`; **DEEP target this phase**

**Investigate:**
- What does "platform team treats developers as customers" look like operationally?
- Why do paved-road CLIs beat documentation wikis as the developer interface?
- When does platform-as-product overrotate (gold-plating)?

### 2.2 The CRD-driven platform

The K8s-native pattern: developers (or ascent on their behalf) create a `Workload` CRD instance describing what they want. A custom controller reconciles the CRD into the underlying state.

→ Pattern: `operator-pattern`; reinforced from [Phase 20](/program/arc-3/phase-20/); deepens here through *building your own*

**Investigate:**
- What's the difference between an Operator and a Controller? (Hint: vocabulary; operators are usually domain-specific.)
- Walk a Crossplane-driven platform: XRDs reconciled by Compositions.
- When is "build your own controller" the right answer vs "configure an existing one"?

### 2.3 kubebuilder + the controller-runtime

**kubebuilder** is the scaffolding tool for K8s controllers in Go. **controller-runtime** is the library that handles the reconciliation loop, watches, queues, retries. Together they make custom operators tractable.

**Investigate:**
- What does `kubebuilder create api` actually scaffold?
- Walk the reconciliation loop: watch → enqueue → reconcile → return result + requeue.
- What's the "owner reference" pattern, and why does it matter for garbage collection?

### 2.4 The paved road

Not every service uses the paved road for every concern, but the paved road is the *easiest* path. Off-road is allowed but costly.

**Investigate:**
- What goes on the paved road for basecamp? (Service templates, mesh integration, SLO scaffolds, default observability, secret provisioning.)
- What stays off-road? (Weird one-offs, prototypes, research.)
- How do you measure paved-road adoption?

### 2.5 The scaffolder pattern

A scaffolder takes a service idea + a template, generates a working service skeleton. With CRDs, the scaffolder generates a `Workload` CRD instance; the controller materializes the rest (Helm chart in Git, Flux Application, NetworkPolicy, SLO, runbook stub).

→ Pattern: `scaffolder-pattern`

**Investigate:**
- What's the right granularity for a scaffolder template?
- How do you keep templates from rotting?
- When does scaffolder-generated code become more burden than benefit?

### 2.6 The platform contract

A paved-road service signs up to a contract: I will follow these conventions (image format, mesh integration, SLO discipline) and the platform will provide these guarantees (deploy via GitOps, observability hooks, secret rotation, runbook template). The contract is *encoded in the `Workload` CRD's schema*.

**Investigate:**
- What does basecamp's paved-road contract look like?
- What's the platform's escalation path when a service breaks the contract?
- When do you allow off-paved-road services?

### 2.7 Internal-tooling DX

The CLI + the CRD are both UX surfaces. Speed, clarity, error messages, defaults all matter. Best-in-class K8s-native CLIs (`kubectl`, `flux`, `gh`, `gcloud`) set a high bar for platform tooling.

**Investigate:**
- Why do `kubectl`, `flux`, `gh`, `gcloud` set the modern CLI bar?
- What makes a CRD's schema "easy to use": sensible defaults, clear validation, good kubebuilder annotations?
- How do you instrument CLI + CRD usage to learn what developers actually do?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Platform interface | **CRD + custom operator + thin CLI**; Backstage software templates; Bash scripts; nothing | CRD + operator: K8s-native, composes with rest of basecamp (recommended). Backstage: rich, heavy. Bash: simple, fragile. Nothing: tickets. |
| Controller framework | **kubebuilder + controller-runtime**; Operator SDK; raw client-go; Metacontroller | kubebuilder: standard, Go (recommended). Operator SDK: similar, Red Hat lineage. client-go: lower-level. Metacontroller: scripting alternative. |
| Service catalog | Backstage; **Git-managed YAML catalog reconciled by the operator**; nothing | Backstage: rich UI. Git-managed: simpler, K8s-native. Nothing: real-world common, real-world tragic. |
| Scaffolder lifecycle | Generate-once (developer owns); **template-as-library (updates propagate via controller)** | Generate-once: simple, divergence over time. Template-as-library: updates flow, requires versioning |

---

## 4. TOOLS (as of 2026-06)

- **Go** (Phase 4 fluency): the CLI + controller language
- **kubebuilder**: controller scaffolding
- **controller-runtime**: reconciliation library
- **`cobra`**: CLI framework
- **`kustomize`**: used internally by the controller to produce overlays
- **Helm Go SDK**: for the controller to apply HelmRelease specs (or it just creates Flux HelmRelease CRDs and lets Flux do the work)
- **Backstage Community Edition** (compare alternative)

### Reading
- "Programming Kubernetes" (Hausenblas + Schimanski): the canonical operator-development book
- The kubebuilder book (free online), read end to end
- Crossplane's controller source: it's K8s-native operators at scale
- CloudNativePG operator source (Go): practical reference
- "Platform Engineering" (Massa + Smith): the discipline book
- "Team Topologies" (Skelton + Pais)

---

## 5. MASTERY: Ship ascent + the custom operator

### 5.1 What you ship: the two pieces working together

```
┌────────────────────────────────────────────────────────────────┐
│   ascent new service my-app                              │
│         │                                                      │
│         ▼                                                      │
│   creates a Workload CRD instance:                             │
│   ┌───────────────────────────────────────────────┐            │
│   │ apiVersion: platform.basecamp.io/v1alpha1     │            │
│   │ kind: Workload                                 │            │
│   │ metadata:                                      │            │
│   │   name: my-app                                 │            │
│   │ spec:                                          │            │
│   │   language: go                                 │            │
│   │   owner: "@jc"                                 │            │
│   │   slo: "99.5% over 30 days"                   │            │
│   │   targets: [k3s, eks, gke]                    │            │
│   └───────────────────────────────────────────────┘            │
│         │                                                      │
│         ▼                                                      │
│   basecamp's custom operator (in basecamp/operator/)           │
│   watches Workload resources and reconciles:                   │
│         │                                                      │
│         ├─ generates Helm chart skeleton in git                │
│         ├─ generates Kustomize overlays per target             │
│         ├─ creates Flux HelmRelease CRDs                       │
│         ├─ creates Cilium NetworkPolicy CRDs (deny-all default)│
│         ├─ creates Pyrra SLO definitions                       │
│         ├─ registers service in Git-managed catalog            │
│         └─ creates runbook stub in chronicle                │
│                                                                │
│   Result: in <5 minutes, my-app is deployable across 3 clouds  │
│   with full Arc 3 hygiene (mesh + secrets + SLO + observability). │
└────────────────────────────────────────────────────────────────┘
```

### 5.2 Ship bars

**ascent:**
- Public GitHub repo
- Cobra-based CLI
- Tests + CI
- Connects to the cluster's K8s API and creates `Workload` CRD instances
- Subcommands: `new service`, `list`, `delete`, `describe`

**The custom operator (basecamp/operator/):**
- Public (or in basecamp repo)
- Built with kubebuilder
- Manages the `Workload` CRD lifecycle
- Reconciles all the materializations listed above
- Has owner references so deletion cascades correctly
- Has tests (envtest + ginkgo or similar)
- Includes the `Workload` CRD as a CustomResourceDefinition manifest

Volume:
- ascent: ~1500-3000 lines Go
- Custom operator: ~1500-3000 lines Go + manifests
- Effort: substantial (this is the longest phase in Arc 3)

### 5.3 Operational depth checklist

```
[ ] kubebuilder installed; scaffold a new operator project for basecamp
[ ] Define Workload CRD with at least: language, owner, slo, targets, dependencies
[ ] Implement reconciler: ensure Helm chart exists in Git, ensure Flux HelmRelease exists, etc.
[ ] Add owner references so deleting Workload cascades to managed resources
[ ] Build ascent; verify `ascent new service hello` creates a Workload
[ ] Verify the operator reconciles the Workload into a deployed service in <5 min
[ ] Apply Workload + observe operator's reconciliation loop in Prometheus
[ ] Add custom metrics from the operator (controller-runtime metrics)
[ ] Run envtest-based unit tests for the controller
[ ] Run end-to-end test on basecamp K3s
[ ] Document the platform contract (CRD spec + guarantees) in basecamp/docs/contract.md
[ ] Recreate one of your existing services via ascent as a smoke test
```

---

## 6. COMPARE: Backstage software templates

Install Backstage Community Edition; replicate the same paved road via Backstage templates (no custom operator).

400-word reflection on the trade-offs: Backstage gives you a UI + templates but the platform's logic lives in template generation, not in a reconciliation loop. Your custom operator gives you live reconciliation but no UI. What does each get right?

---

## 7. OPERATE

- 5-7 runbooks: catalog out of sync, scaffolder template bug, operator stuck reconciling, Workload deletion cascade failure, CRD migration
- 3-4 ADRs: Cilium over Istio; ESO + Vault over sealed-secrets; custom operator over Backstage; Workload CRD schema design
- Weekly log

---

## 8. CONTRIBUTE

- kubebuilder docs or examples
- A controller-runtime utility you find useful
- Crossplane providers (since you understand the operator pattern now)
- A blog post (when blog is live) on building a custom controller

---

## What ships from this phase

- **[`ascent`](/projects/ascent/plan/) v0.1**: public CLI
- **Custom kubebuilder operator**: public; reconciles `Workload` CRDs
- **`Workload` CRD**: the platform's API
- **`ascent` alive**: service catalog + operator + paved-road
- **At least one new service** deployed via ascent in <5 min
- **Platform runbooks**

---

## Validation criteria

```
[ ] ascent v0.1 shipped publicly
[ ] Custom operator shipped publicly (or in basecamp repo)
[ ] Workload CRD schema documented + versioned (v1alpha1)
[ ] At least one service end-to-end via ascent
[ ] Operator metrics + tests passing
[ ] All 12 operational depth checks
[ ] Backstage compare (400 words)
[ ] 5-7 platform runbooks
[ ] 3-4 ADRs
[ ] Pattern entries:
    - platform-as-product → DEEP
    - operator-pattern → OUTLINE (deepens in Arc 4-Arc 5 via KubeRay, KServe, etc.)
    - scaffolder-pattern → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3.5 hours.**

### Part 1: Build (120 min)
From scratch: use `ascent new service` to scaffold a new service called `hello`. Verify the Workload CRD is created. Watch the operator reconcile it. Verify mesh + SLO + observability + NetworkPolicy all wire up automatically. Total time from `ascent new` to running deployment: < 5 min.

### Part 2: Diagnose (60 min)
A platform scenario (e.g., "Workloads are being created but no HelmRelease appears"). Possible: operator panic; RBAC; reconciler bug; missing CRD field validation.

### Part 3: Articulate (30 min)
~800 words: *"Walk the lifecycle of a Workload CRD from `kubectl apply` to a running, observable, mesh-mTLS'd service. Cover every reconciliation step the controller does. Cite the operator-pattern and platform-as-product."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Building the paved road and not using it | Theater. Eat your own dog food. |
| Custom operator without owner references | Deletions leak resources |
| CRD spec that's a free-form bag of strings | Schema validation is your friend |
| Defining SLOs once and never revisiting | SLOs are living contracts. Quarterly review or they rot. |
| No off-paved-road escape hatch | Edge cases need paths. Don't force them through the wrong process. |
| ascent logic in the CLI instead of the controller | The CLI should be a thin shim; the controller is where the platform's intelligence lives |

---

## Patterns touched this phase

- `platform-as-product`: **DEEP**
- `operator-pattern`: OUTLINE (the central K8s-native pattern; deepens in Arc 4-Arc 5)
- `scaffolder-pattern`: OUTLINE

---

→ Next: [Phase 27: Secrets Lifecycle + Defense in Depth](/program/arc-3/phase-27/)
