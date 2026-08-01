---
title: "Service Mesh + Zero-Trust Networking"
description: "Phase 25 of /root Arc 3: service mesh as the universal mediation layer. Cilium mesh, mTLS between every pod, identity-aware NetworkPolicy, zero-trust networking.."
tags: [arc-3, infrastructure, mesh, security, networking]
arc: 3
phase: 25
---

> Ninth phase of Arc 3. Mediation as a platform service.

A service mesh adds mTLS, observability, traffic shaping, retry/timeout policies, and identity-aware NetworkPolicy to service-to-service traffic without application changes. By phase end every pod on basecamp talks to every other pod over mTLS; NetworkPolicies enforce zero-trust between services; the mesh dashboard shows L7 traffic flow without sidecar overhead.

This phase deepens [Phase 18 (Networking Deep)](/program/arc-3/phase-18/) and reinforces [Phase 17 (mediation)](/program/arc-3/phase-17/). Cilium's eBPF mesh layer is also what makes [Phase 28 (Observability at Platform Depth)](/program/arc-3/phase-28/) cheap and fast.

---

## Prerequisites

> - [Phase 24](/program/arc-3/phase-24/) complete; multi-cloud basecamp working

---

## Why this phase exists

Before a mesh, every service handles its own mTLS, retries, observability, traffic shaping. Each service does it slightly differently; the inconsistency is a security and operational hazard. The mesh moves these concerns to a uniform layer, freeing services to do business logic.

The pattern is **mediation**: interpose a control point between services so cross-cutting concerns become uniform. The same pattern Kubernetes Services implement at L4; the mesh extends it to L7.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

Service-to-service traffic on basecamp needs: encryption (mTLS), authentication (workload identity), authorization (who can call who), observability (latency, error rate, throughput per service pair), traffic shaping (retries, timeouts, circuit breakers), and routing (canary deploys, A/B).

Each service implementing these independently produces inconsistency + bugs. The mesh provides them uniformly.

---

## 2. PRINCIPLES

### 2.1 The mesh as universal mediation

A mesh interposes between every service-to-service call. Sidecar-based meshes (Istio classic, Linkerd) inject a proxy per pod. eBPF-based meshes (Cilium) use the kernel.

→ Pattern: `service-mesh`; reinforces `mediation`

**Investigate:**
- What does an Envoy sidecar add to each request hop in resource cost?
- How does Cilium's eBPF mesh achieve the same outcome without sidecars?
- When does the sidecar model win (rich L7 features, easier debugging)?

### 2.2 mTLS as the encryption + identity baseline

Mutual TLS authenticates both ends of every connection via certificates. The mesh issues short-lived certificates; rotation is automatic.

**Investigate:**
- What does the SPIFFE/SPIRE identity model give you?
- Why is "long-lived certificate" the wrong model for service-to-service?
- How does mTLS compose with NetworkPolicy?

### 2.3 Zero-trust networking

Never trust based on network location. Every connection authenticated; every authorization explicit; every flow auditable.

→ Pattern: `zero-trust-networking`

**Investigate:**
- Why is "the perimeter firewall" insufficient in containerized worlds?
- What does workload identity mean (SPIFFE/SPIRE, IRSA, GCP workload identity)?
- How does Cilium implement zero-trust via identity-aware NetworkPolicies?

### 2.4 L7 vs L4 mediation

The mesh can mediate at L4 (TCP) or L7 (HTTP/gRPC). L4 is cheaper; L7 enables retries, header-based routing, observability.

**Investigate:**
- When is L4-only enough? (Hint: opaque TCP services.)
- What does L7 routing buy that L4 doesn't?
- What's the latency cost of L7 mediation vs L4?

### 2.5 Traffic shaping (retries, timeouts, circuit breakers at the mesh)

Arc 2 Phase 16 added retries/timeouts/circuit breakers in app code. The mesh can do them uniformly without app changes.

**Investigate:**
- Why is mesh-level retry better than app-level? (Hint: consistency.)
- When does the mesh's retry conflict with app retries? (Both fire → amplification.)
- How do you reason about the combined retry budget?

### 2.6 Mesh observability

The mesh sees every service-to-service call. RED metrics per service pair come for free. Distributed tracing (Phase 28) hooks into the mesh.

**Investigate:**
- What does the Cilium Hubble UI show that's hard to get without a mesh?
- How does mesh observability compose with OTel (Phase 28)?
- When does mesh observability replace app-level instrumentation? (It usually augments.)

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Mesh | Cilium Mesh (eBPF); Istio; Linkerd; Consul Connect | Cilium: eBPF, fast, K8s-native. Istio: feature-rich, heavy. Linkerd: lightweight, Rust. Consul: HashiCorp ecosystem |
| Architecture | Sidecar-per-pod; ambient (sidecarless); host-proxy | Sidecar: rich, resource cost. Ambient: lower overhead. Host-proxy: simplest, less granular |
| Identity | SPIFFE/SPIRE; cloud-native (IRSA, etc.); cert-manager | SPIFFE: standard, portable. Cloud-native: integrated, locked-in. cert-manager: K8s-native |

---

## 4. TOOLS (as of 2026-06)

- **Cilium 1.16+** with Mesh + Hubble enabled
- **`cilium` CLI**
- **Linkerd** as the simpler compare
- **Istio Ambient mode** as the sidecar-light option

### Reading
- Cilium docs: *Service Mesh* and *NetworkPolicy*
- "Istio in Action" (Posta + Maloku)
- "Mastering Service Mesh" (Pugazhenthi)
- The Envoy proxy docs (background; even for non-Envoy meshes)

---

## 5. MASTERY: Cilium Mesh on basecamp

```
[ ] Install Cilium with Mesh enabled on basecamp K3s
[ ] Verify mTLS between two services automatically
[ ] Install Hubble; observe service map
[ ] Add identity-aware NetworkPolicy: only beacon talks to Postgres
[ ] Trigger an mTLS handshake failure deliberately; observe + diagnose
[ ] Configure L7 traffic shaping: 3 retries with backoff for one HTTP service
[ ] Configure canary deploy: 90% to v1, 10% to v2; observe Hubble L7 metrics
[ ] Extend mesh to EKS + GKE clusters (cluster mesh / federation)
[ ] Verify cross-cluster mTLS works
[ ] Add custom CiliumNetworkPolicy with L7 rules (HTTP method-based)
```

---

## 6. COMPARE: Linkerd or Istio

Pick one as the parallel installation. Replicate one slice of basecamp's traffic. Reflect on what each gets right.

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: mTLS handshake failing, NetworkPolicy blocking expected traffic, Hubble not showing traffic, cluster-mesh broken
- 1-2 ADRs (Cilium over Istio, sidecar vs ambient)
- Weekly log

---

## 8. CONTRIBUTE

- Cilium docs
- Linkerd docs
- A blog post on a real mesh debugging session

---

## What ships from this phase

- **Cilium Mesh on basecamp** with mTLS + NetworkPolicy + Hubble
- **Cross-cluster mesh** across K3s + EKS + GKE
- **Mesh runbooks**

---

## Validation criteria

```
[ ] Cilium Mesh installed; mTLS verified between two services
[ ] Identity-aware NetworkPolicies enforced
[ ] Hubble service map visible
[ ] Cross-cluster mesh working (or documented why deferred)
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 mesh runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - service-mesh → OUTLINE
    - zero-trust-networking → OUTLINE
    - mediation → DEEP
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (75 min)
Add a new service to basecamp. Apply identity-aware NetworkPolicy: only this service can talk to Postgres. Verify with curl from authorized vs unauthorized pod.

### Part 2: Diagnose (45 min)
Cilium mTLS handshake failing between two services that should talk. Possible: identity mismatch, NetworkPolicy denying, certificate not propagated.

### Part 3: Articulate (30 min)
~600 words: *"Defend Cilium Mesh's eBPF approach over Istio's sidecar approach for basecamp. Cite resource cost, debugging, L7 feature differences."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Mesh without a clear threat model | mTLS adds operational complexity. Justify with the threat model. |
| Mesh-level retry + app-level retry | Amplification. Pick one layer. |
| Default-allow NetworkPolicy "for now" | Habits transfer to production |
| Sidecar mesh on every namespace including system ones | Resource explosion + breakage |

---

## Patterns touched this phase

- `service-mesh`: OUTLINE
- `zero-trust-networking`: OUTLINE
- `mediation`: **DEEP**

---

→ Next: [Phase 26: Platform Engineering, ship ascent](/program/arc-3/phase-26/)
