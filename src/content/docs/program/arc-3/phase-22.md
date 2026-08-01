---
title: "Infrastructure as Code — ship forge"
description: "Phase 22 of /root Arc 3: declarative infrastructure with Terraform (plan/apply) and Crossplane (reconcile loop). Ship forge as the first public OSS launch of the program — multi-cloud Terraform + Crossplane side-by-side.."
tags: [arc-3, infrastructure, iac, terraform, crossplane, projects]
arc: 2
phase: 22
---

> Sixth phase of Arc 3. Declarative infrastructure as the K8s-native default, with Terraform as the compare.
> Ship `forge`: the first real public launch.

[Phase 20](/program/arc-3/phase-20/) made the cluster declarative (Flux reconciling Git to K8s state). This phase lifts the same pattern up one floor: declarative *infrastructure*, meaning VMs, networks, IAM, managed databases. The K8s-native default is **Crossplane** (continuous reconciliation via custom controllers); **Terraform** is the compare. Same problem; different abstractions; different operational trade-offs.

This phase aligns with /root's broader K8s-native ecosystem framing: when a tool fits the CRD-driven controller pattern that the rest of basecamp uses, it composes naturally. Crossplane does; Terraform mostly doesn't (it's discrete plan/apply). Both belong in your toolkit, but the *default for basecamp* is the K8s-native one.

This is also the phase where you stop being *someone with a homelab* and start being *someone who ships OSS to the community*. [`forge`](/projects/forge/plan/) is the first artifact you launch loudly. README, examples, CI, blog post, Hacker News attempt.

---

## Prerequisites

> - [Phase 21](/program/arc-3/phase-21/) complete; DDIA vocabulary in place
> - AWS account created; root account secured with hardware MFA
> - You accept: **you are not learning Terraform. You are learning what declarative infrastructure is, with Terraform + Crossplane as two implementations.**

---

## Why this phase exists

Declarative infrastructure is the operational pattern that makes modern platforms possible. Without it, every environment is a snowflake, every DR is hope-driven, every onboarding is 40-hour shell-history archeology.

The pattern is *the same one Kubernetes uses*: desired state expressed in a manifest, observed state queried from the world, a reconciliation loop closing the gap. Terraform implements it as plan + apply (discrete). Crossplane implements it as continuous reconciliation. Both are correct. Understanding when each is right is a real engineering skill.

By phase end you ship `forge`, a public repo with multi-cloud modules implemented twice, once in each tool, with a README explaining the trade-offs. It's a teaching artifact that demonstrates pattern fluency in a way a single-tool tutorial can't.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have cloud accounts. You want to express infrastructure (VPCs, IAM, databases, K8s clusters, secrets) in version-controlled files that can be reviewed, audited, replicated to a second environment, recovered from disaster, and *changed safely*. You don't want to click around the cloud console.

That's the IaC problem. Terraform was its first widely-adopted answer (HashiCorp). Pulumi expresses it in real languages. Crossplane expresses it as Kubernetes CRDs reconciled by controllers. AWS CDK + CDK for Terraform sit in the middle.

---

## 2. PRINCIPLES

### 2.1 Declarative vs imperative

Declarative: you say what you want; the tool figures out the diff. Imperative: you say what to do; you handle the diff.

→ Pattern: `declarative-vs-imperative-infrastructure`: **DEEP target this phase**

**Investigate:**
- Why is `terraform apply` declarative even though it runs commands?
- What goes wrong with imperative bash scripts after 6 months?
- When is imperative right (one-off remediation, custom recovery)?

### 2.2 State

Terraform tracks state in a state file. Crossplane tracks state in K8s etcd. The state is *what the tool believes the world looks like*.

**Investigate:**
- What happens when TF state diverges from reality (someone clicks in the console)?
- How does `terraform import` resolve drift? What does it cost?
- Why does Crossplane have no state-file problem, and what problem does it have instead?

### 2.3 Reconciliation loops

Both tools implement reconciliation. Terraform's loop is CLI-invoked. Crossplane's is continuous.

→ Pattern: `control-loops` reinforced from Phase 20

**Investigate:**
- What does a Crossplane controller do every reconciliation pass?
- Cost trade-off: discrete vs continuous?
- When does continuous bite you (cost, API rate limits, retry storms)?

### 2.4 Modules and composition

Both compose. Terraform has modules. Crossplane has Compositions.

**Investigate:**
- Design a "small Postgres cluster" module in Terraform: params, outputs, validation.
- Design the same in Crossplane Compositions. Compare.
- When does the abstraction leak?

### 2.5 Drift detection and remediation

Drift: when real world stops matching declared state. Terraform detects at plan time. Crossplane continuously.

**Investigate:**
- Why does someone change cloud out-of-band? (Colleague, incident, feature flag.)
- Auto-correct vs alert vs both?
- When is human-mediated drift acceptable (operational override)?

### 2.6 Multi-cloud abstraction

Both can target multiple clouds but neither *abstracts* clouds. They wrap each cloud's primitives. Real multi-cloud code requires choosing cross-cutting concepts (compute, storage, secrets) and writing one module per cloud against the same interface.

**Investigate:**
- Why is "write once, deploy anywhere" a marketing lie?
- What's the minimum useful multi-cloud abstraction?
- When is multi-cloud strategically worth the complexity?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Tool | Terraform; Pulumi; Crossplane; CDK | TF: ubiquitous, HCL. Pulumi: real languages. Crossplane: K8s-native. CDK: AWS-flavored |
| State backend | Local; S3 + DynamoDB; Terraform Cloud; etcd (Crossplane) | Local: dev only. S3+DDB: ubiquitous. TFC: managed. etcd: K8s-native |
| Drift response | Auto-correct; Alert + manual; Both | Auto-correct: dangerous in prod. Alert: safe, needs humans. Hybrid: pragmatic |

---

## 4. TOOLS (as of 2026-06)

### Terraform ecosystem
- **`terraform` 1.7+** or **`opentofu`** (OSS fork)
- **`tflint`**, **`tfsec` / `checkov`**, **`terragrunt`**

### Crossplane ecosystem
- **Crossplane 1.15+**: installed on basecamp's K3s
- **provider-aws**, **provider-gcp**
- **Compositions + XRDs**

### Reading
- "Terraform: Up and Running" (Brikman, 4th ed.)
- Crossplane docs: read *Composition* section twice
- Your own forge project plan

---

## 5. MASTERY: Ship `forge`

### 5.1 What forge is

[`forge`](/projects/forge/plan/) is a public repo demonstrating declarative infrastructure across clouds, twice: once in Terraform, once in Crossplane, for the same topology:

- A VPC
- An IAM role with least-privilege
- A managed Postgres instance
- A managed K8s cluster (EKS or GKE)
- Sealed-secrets / External Secrets integration

The README compares the two implementations side-by-side: lines of code, time-to-apply, drift behavior.

### 5.2 Ship bar

- Public GitHub repo with README, LICENSE, CI (terraform validate + checkov + tflint + Crossplane CRD validation)
- Working examples in `examples/`; CI runs them on every push
- Blog post on `root.abukix.dev` (whenever the blog goes live) explaining the pattern comparison
- Hacker News / Reddit submission attempt
- 1+ external user files an issue or PR

Volume: ~1500-2500 lines of HCL + YAML + Go. Time: 35-50 hrs, weeks 3-8.

### 5.3 Operational depth checklist

```
[ ] Run terraform plan on real VPC + EKS topology; explain every resource the plan creates
[ ] Force drift (click in AWS console); observe TF report it
[ ] Same drift; observe Crossplane handle it
[ ] Write a Crossplane Composition for the same topology
[ ] Use sealed-secrets to put credentials in basecamp's GitOps repo safely
[ ] Implement a small Crossplane Composition Function in Go
[ ] CI: terraform validate + tflint + checkov on every PR
[ ] Crossplane health check: alert when reconciliation has been failing > 5 min
```

---

## 6. COMPARE: Pulumi or AWS CDK

Pick one language-based tool. Translate one forge module into it. Same topology, different abstraction.

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: state-file recovery, drift remediation, Crossplane stuck reconcile, terraform apply blocked by lock
- 2-3 ADRs (Terraform for cloud side; Crossplane for K8s side, or rationale for using both at different layers)
- Weekly log

---

## 8. CONTRIBUTE

- `terraform-provider-aws`: small fixes
- Crossplane providers
- `tflint` rules

---

## What ships from this phase

- **[`forge`](/projects/forge/plan/) v0.1**: public, first loud launch
- **basecamp's `terraform/` + `crossplane/` directories** populated
- **Blog post drafted** (publish when blog launches)
- **IaC runbooks**

---

## Validation criteria

```
[ ] forge v0.1 shipped publicly (GitHub + CI + ≥1 external user)
[ ] All 8 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 IaC runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - declarative-vs-imperative-infrastructure → **DEEP**
    - control-loops reinforced
    - gitops reinforced
    - immutable-infrastructure reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (120 min)
From empty `terraform/`: provision small VPC + IAM + RDS Postgres on fresh AWS using only declared modules from forge. Plan + apply. Then declare same in Crossplane on basecamp.

### Part 2: Articulate (60 min)
~1000 words: *"Compare TF's plan/apply vs Crossplane's continuous reconcile in the context of a 5-engineer team operating basecamp. Cover state management, drift, blast radius, debuggability, when each is right."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Storing TF state in Git | State contains secrets |
| `terraform apply` without `plan` | Skipping the safety check |
| Hand-clicking in the cloud console | This is drift; degrades trust in IaC |
| Cargo-culting multi-cloud | If you don't need optionality, don't pay for it |
| Treating Crossplane like Terraform with extra steps | They're different. Continuous reconcile is the *feature*. |

---

## Patterns touched this phase

- `declarative-vs-imperative-infrastructure`: **DEEP**
- `control-loops` reinforced
- `gitops` reinforced
- `immutable-infrastructure` reinforced

---

→ Next: [Phase 23: Cloud Foundation: AWS Deep](/program/arc-3/phase-23/)
