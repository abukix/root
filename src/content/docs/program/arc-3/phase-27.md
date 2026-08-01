---
title: "Secrets Lifecycle + Defense in Depth"
description: "Phase 27 of /root Arc 3: secrets as a lifecycle, not just storage. Provisioning, distribution, rotation, revocation, audit. Vault + External Secrets Operator + sealed-secrets. Defense in depth at every layer.."
tags: [arc-3, infrastructure, security, secrets]
arc: 3
phase: 27
---

> Eleventh phase of Arc 3. Secrets as engineering, not afterthought.

Most teams handle secrets creation and distribution and ignore the rest. Production-grade platforms treat the whole lifecycle: provisioning, distribution, rotation, revocation, audit. By phase end basecamp has secrets stored in Vault (or equivalent), distributed via External Secrets Operator, rotated on schedule, audited continuously. The whole story is documented and runbook-supported.

This phase complements [Phase 25 (mesh + mTLS)](/program/arc-3/phase-25/) which handled service-to-service identity. Together they implement [zero-trust-networking](/patterns/networking/zero-trust-networking/) as a real architecture.

---

## Prerequisites

> - [Phase 26](/program/arc-3/phase-26/) complete; ascent operational

---

## Why this phase exists

A secret is one of: API key, database password, signing key, certificate, encryption key. Each has a lifecycle. Static secrets in `.env` files are how production gets compromised. The discipline is treating secrets as managed assets with rotation policies.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

Your services need secrets. They must be: stored encrypted, distributed only to authorized consumers, rotated regularly, revoked on compromise, audited continuously. Manual handling is error-prone; production-grade systems automate every step.

---

## 2. PRINCIPLES

### 2.1 The secret lifecycle

Provision → Distribute → Rotate → Revoke → Audit. Each stage needs deliberate engineering.

→ Pattern: `secrets-lifecycle`

**Investigate:**
- For an API key shared with a partner: walk the full lifecycle. Where does each handoff happen?
- What does "rotation" mean for a database password used by 10 services?
- What does revocation mean operationally when the secret is already distributed?

### 2.2 Defense in depth at every layer

No single layer is sufficient. Network policies, mTLS, secrets, IAM, audit logs: each catches what the others miss.

→ Pattern: `defense-in-depth`, **DEEP target this phase**

**Investigate:**
- For a typical request to basecamp, list every security layer it traverses.
- What's "swiss cheese model" of security?
- When does adding a layer cost more than it buys?

### 2.3 Zero-trust security

Trust nothing implicitly. Every interaction authenticated, authorized, encrypted, audited. Network position confers nothing.

→ Pattern: `zero-trust-security`

**Investigate:**
- How does zero-trust differ from "the perimeter is the firewall"?
- What's a workload identity, and how does it compose with secrets?
- When is full zero-trust overkill?

### 2.4 Vault-as-a-service

A central secrets backend (Vault, AWS Secrets Manager, Doppler) provides storage + rotation + audit. Services authenticate to it via workload identity and pull secrets at runtime.

**Investigate:**
- What does HashiCorp Vault give you that AWS Secrets Manager doesn't (and vice versa)?
- What's dynamic secrets (Vault generates DB credentials per-request)?
- When is the operational cost of running Vault worth it?

### 2.5 External Secrets Operator (ESO)

A K8s-native pattern: an Operator pulls secrets from Vault (or Secrets Manager, Doppler, etc.) and creates K8s Secret objects. The cluster surfaces secrets to pods normally; the source-of-truth lives in Vault.

**Investigate:**
- Why is ESO the practical pattern vs Vault Agent sidecar?
- What's the failure mode when ESO can't reach Vault?
- How do you rotate without service restart?

### 2.6 Policy-as-code with Kyverno

**Kyverno** is a K8s-native policy engine: every policy is a CRD (`ClusterPolicy`, `Policy`), reconciled by the Kyverno controller. Policies validate, mutate, or generate K8s resources. The natural complement to secrets management: you can enforce "every Pod that mounts a Secret must have specific labels," "no Secret can be created in this namespace," "every Workload CRD must reference a Vault-managed secret," etc.

→ Pattern: `policy-as-code`, first OUTLINE this phase

**Investigate:**
- Walk a Kyverno ClusterPolicy: declare → admission controller validates incoming resources → reject/mutate/generate.
- Why is Kyverno more idiomatic for the K8s-native ecosystem than OPA Gatekeeper? (Hint: Kyverno's policies are YAML CRDs; OPA's are Rego — separate language.)
- When does a Kyverno policy belong in basecamp's platform layer vs in the application layer?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Secrets backend | Vault; AWS Secrets Manager; Doppler; cloud-native | Vault: self-hosted, rich. SM/Doppler: managed, vendor-bound. |
| Distribution | ESO; Vault Agent sidecar; init container | ESO: K8s-native. Sidecar: more granular, more sprawl. Init: simplest, less dynamic. |
| Git-friendly | Sealed Secrets; SOPS; nothing (Vault-only) | Sealed: cluster-bound key. SOPS: multi-key, more complex. Nothing: Vault-required for every read. |
| Rotation cadence | 30 days; 90 days; on-event-only | Short: rotation tax. Long: more exposure. On-event: missed routine rotations. |

---

## 4. TOOLS (as of 2026-06)

- **HashiCorp Vault** (Open Source)
- **External Secrets Operator (ESO)**
- **Sealed Secrets** (Bitnami)
- **SOPS** (Mozilla)
- **`vault` CLI**
- **`gitleaks` / `trufflehog`**: secret scanning

### Reading
- "Securing DevOps" (Vehent)
- Vault docs: Auth Methods and Dynamic Secrets sections
- External Secrets Operator docs

---

## 5. MASTERY: Secrets pipeline on basecamp

```
[ ] Vault deployed on basecamp (or use AWS Secrets Manager)
[ ] External Secrets Operator installed; pulls from Vault
[ ] At least 5 service secrets managed via ESO
[ ] Rotation schedule: 90 days for static secrets; 1 hour for dynamic
[ ] Sealed Secrets for at least one in-Git config (e.g., basecamp's bootstrap)
[ ] SOPS for one alternative use case (multi-environment secrets in Git)
[ ] Vault audit logs collected + shipped to Loki / equivalent
[ ] Workload identity (IRSA on EKS, Workload Identity on GKE) integrated with Vault
[ ] Secret scanning in CI: gitleaks runs on every PR
[ ] Practice rotation: rotate Postgres password without downtime
```

---

## 6. COMPARE: AWS Secrets Manager

Replicate one secret pipeline using AWS Secrets Manager + ESO instead of Vault. Compare.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: secret rotation broke deployment; Vault unsealed; compromised secret; ESO sync failing; auditing access
- 2-3 ADRs (Vault over SM; ESO over Vault sidecar; rotation cadence)
- Weekly log

---

## 8. CONTRIBUTE

- ESO providers (community-maintained)
- Vault docs
- SOPS, Sealed Secrets

---

## What ships from this phase

- **Secrets infrastructure on basecamp**: Vault + ESO + Sealed Secrets + SOPS
- **Rotation automation** for at least one production secret
- **Secrets runbooks**

---

## Validation criteria

```
[ ] Vault + ESO operational; 5+ service secrets managed
[ ] Rotation practiced without downtime
[ ] Sealed Secrets + SOPS used for Git-friendly cases
[ ] CI secret scanning catches a deliberate test secret
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 secrets runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - secrets-lifecycle → OUTLINE
    - defense-in-depth → DEEP
    - zero-trust-security → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (75 min)
Migrate one service's secrets from environment variables to ESO + Vault. Verify the service still works. Rotate the secret without restart.

### Part 2: Diagnose (45 min)
ESO is failing to sync one secret. Possible: Vault token expired, ESO RBAC missing, secret path wrong, network policy blocking.

### Part 3: Articulate (30 min)
~600 words: *"Walk what happens when basecamp rotates the Postgres root password. Cover Vault rotation, ESO update, K8s Secret object change, pod restart vs hot-reload, audit log entries."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Static secrets without rotation | Slow leak; never gets noticed until breach |
| Secrets in environment variables visible in `ps` | Process listings show env vars to local users |
| Secrets in Docker layers | Layers are forever; secret is in the image hash |
| No audit trail | When something happens, you can't reconstruct |
| Manual rotation by humans | Will not happen consistently |

---

## Patterns touched this phase

- `secrets-lifecycle`: OUTLINE
- `defense-in-depth`: **DEEP**
- `zero-trust-security`: OUTLINE

---

→ Next: [Phase 28: Observability at Platform Depth](/program/arc-3/phase-28/)
