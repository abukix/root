---
title: "Kubernetes + GitOps"
description: "Phase 20 of /root Arc 3: Kubernetes as declarative orchestration, Flux as GitOps reconciliation, operators for stateful workloads. basecamp substrate goes live: K3s + Flux + CloudNativePG + Redis Operator + Karpenter + Keda + Prometheus + Grafana. Ship beacon as first real service. — the longest phase of Arc 3."
tags: [arc-3, infrastructure, kubernetes, gitops, flux, projects]
arc: 3
phase: 20
---

> Fourth phase of Arc 3. Where everything composes. The longest phase of the year.

If Phases 17-19 installed the primitives, Phase 20 is where they compose into the K8s-native ecosystem that basecamp runs on. Linux processes (Phase 17) become pods. TCP/HTTP (Phase 18) becomes Services and Ingress. Containers (Phase 19) become the unit of scheduling. And on top of all of it, the [control-loop pattern](/patterns/foundations/control-loops/), the central insight every later year leans on.

This phase brings the basecamp substrate fully alive in the K8s-native pattern: **K3s + Flux + CloudNativePG + Redis Operator + Karpenter + Keda + Prometheus + Grafana**. Every stateful workload runs under an operator. Every config lives in Git, reconciled by Flux. Every cluster resource is a CRD. By phase end you can debug a Pod stuck in `Pending` from first principles, and you've shipped [`beacon`](/projects/beacon/plan/) as the first real service on basecamp.

It's the longest phase of Arc 3, and it earns every week.

---

## Prerequisites

> - All of Phases 17-19 complete; container from-scratch exercise done
> - Hardware upgraded: 32GB RAM + 1TB external SSD (before starting this phase)
> - You accept: **you are not learning Kubernetes. You are learning what declarative orchestration is, with K8s as the canonical implementation and control-loops as the operating principle. The K8s-native ecosystem is the convergent tool set; learn the patterns underneath.**

---

## Why this phase exists

Kubernetes is the substrate Years 4-5 build on, and the substrate every later employer's platform will probably also build on. It is also a giant, frequently-cargo-culted abstraction unless you understand the *pattern underneath*: control loops reconciling desired state in etcd against observed state in the cluster, forever.

This phase makes that pattern concrete via the *K8s-native ecosystem*: every component is a CRD-driven controller. Operators (CloudNativePG, Redis Operator) manage stateful workloads. Flux reconciles Git to cluster state. Karpenter reconciles node demand. Keda reconciles workload scaling against external signals. The pattern is consistent across every component you operate.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You have containers (Phase 19). You want to run them across a fleet of machines: self-healing, declaratively scaled, with service discovery, rolling deploys, resource isolation, network policy, all reproducibly described in version control.

That's the orchestration problem. Kubernetes is one solution. Nomad is another. ECS / Cloud Run are proprietary takes. The pattern is *declarative orchestration via control loops*; K8s is the tool that won the 2020s, and the *K8s-native ecosystem* (operators + CRDs + controllers everywhere) is the design language that emerged on top.

---

## 2. PRINCIPLES

### 2.1 Control loops

A control loop watches actual state, compares it to desired state, acts to converge. Every K8s controller, built-in or third-party, is some flavor of this loop.

→ Pattern: `control-loops`: **DEEP target this phase** (the central pattern of the program)

**Investigate:**
- Walk what happens when you `kubectl apply` a Deployment with 3 replicas. Which controllers wake up, in what order?
- What does "reconciliation" mean in the operator pattern (CloudNativePG, Strimzi, KubeRay all follow it)?
- Why is "eventual consistency" the K8s default, and when does it bite?

### 2.2 Declarative vs imperative

You say what you want; the tool figures out the diff. You don't say "create 3 pods, restart any that fail."

→ Pattern: `declarative-vs-imperative-infrastructure`

**Investigate:**
- Why does `kubectl create` exist if `kubectl apply` is the recommended path?
- What's the difference between `apply` and `replace` semantics?
- When does declarative break (real-world one-off operations)?

### 2.3 etcd as source of truth

All cluster state lives in etcd. Every K8s "knowledge" comes from there. Every action is a controller noticing an etcd change.

**Investigate:**
- Why is etcd the bottleneck of large clusters?
- What does the API server do that isn't just an etcd proxy?
- Why is etcd backup the most important operational practice?

### 2.4 The operator pattern

An operator is a controller (or set of controllers) that manages a complex stateful workload through a custom CRD. CloudNativePG's `Cluster` CRD reconciles Postgres clusters. Redis Operator's `RedisCluster` CRD reconciles Redis clusters. Same shape, different domain.

→ This is the meta-pattern of the K8s-native ecosystem. Every basecamp module (substrate through the AI tier) follows it.

**Investigate:**
- Walk the CloudNativePG `Cluster` CRD lifecycle: declare → controller creates StatefulSet + Services + Secrets → reconciles forever.
- Why is "operator for everything stateful" the convergent answer? (Hint: humans bad at multi-step recovery; controllers don't get tired.)
- When does *building your own* operator make sense (Phase 26 teaches this)?

### 2.5 Service as mediator + Network Policy

A Service is a stable name + IP for a set of Pods. kube-proxy + iptables/IPVS/eBPF make traffic flow. NetworkPolicy constrains who-can-call-who at L4 (and L7 with Cilium).

→ Patterns: `mediation` reinforced; `service-discovery`, `load-balancing`, `network-policy`

**Investigate:**
- ClusterIP vs NodePort vs LoadBalancer vs Headless: when each?
- How does kube-proxy implement ClusterIP → Pod IP?
- Why is CoreDNS the resolution layer above Services?

### 2.6 GitOps via Flux

Desired state lives in Git. A controller (Flux) reconciles cluster against Git. `git push` is the deploy mechanism. Flux uses composable CRDs: `GitRepository` (source), `Kustomization` (apply), `HelmRelease` (chart with values), `ImageRepository` (image-based reconciliation).

→ Pattern: `gitops`

**Investigate:**
- Why does Flux fit the K8s-native ecosystem better than ArgoCD? (Hint: every Flux object is itself a CRD; ArgoCD's Application is a CRD too but the controller model is more monolithic.)
- What's drift, and how does Flux detect + remediate?
- When is ArgoCD's UI worth giving up Flux's compositional CRDs?

### 2.7 Node + workload autoscaling

**Karpenter** is a Kubernetes-native node autoscaler. It watches Pending pods, decides what nodes to launch, provisions them through cloud APIs (or local ones in homelab variants), reconciles continuously.

**Keda** is Kubernetes-Event-Driven Autoscaling. It scales workloads based on external signals, queue depth (Kafka, RabbitMQ), database metrics, custom Prometheus queries, not just CPU/memory.

Both follow the same CRD-driven controller pattern as the rest of the ecosystem.

**Investigate:**
- How does Karpenter differ from the older cluster-autoscaler?
- When does Keda earn its weight over HPA?
- What's the trade-off of "event-driven scaling" vs "metric-driven scaling"?

### 2.8 Helm + Kustomize as unified packaging

**Helm** renders parameterized Kubernetes manifests from charts. **Kustomize** applies overlays (env-specific patches) on top of base manifests. Big-tech platform teams use *both together*: Helm for the chart (parameterized template), Kustomize for environment overlays (dev/staging/prod). Flux's `HelmRelease` + `Kustomization` CRDs compose them naturally.

**Investigate:**
- When should you reach for a Helm chart vs raw Kustomize?
- What goes in the Helm chart's `values.yaml` vs a Kustomize overlay's patch?
- Why is "Helm renders; Kustomize composes" the practical pattern at scale?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Distribution | K3s; kubeadm; managed (EKS/GKE) | K3s: tiny, homelab. kubeadm: full vanilla. Managed: easy, opaque |
| GitOps tool | **Flux**; ArgoCD; Argo Workflows | Flux: K8s-native, compositional CRDs (recommended). ArgoCD: rich UI, more monolithic. |
| Stateful workload mgmt | Operator (CloudNativePG, Redis Operator, etc.); raw StatefulSet | **Operator**: reconciliation built in, recovery automated (recommended). Raw: more control, more ops burden. |
| Package mgmt | **Helm + Kustomize together**; Helm alone; Kustomize alone; raw manifests | Helm + Kustomize: charts + overlays (recommended). Helm alone: parameterized but no env composition. Kustomize alone: composition but no templating. |
| Node autoscaling | **Karpenter**; cluster-autoscaler; manual | Karpenter: K8s-native, CRD-driven (recommended). cluster-autoscaler: legacy, config-driven. |
| Workload autoscaling | HPA; **Keda** (event-driven) | HPA: CPU/mem based. Keda: any external metric (recommended for queue/data workloads). |
| Ingress | Cilium Gateway; Traefik; NGINX | Cilium Gateway: eBPF-native, composes with mesh. Traefik: K8s-native. NGINX: ubiquitous. |
| Secrets | Sealed-secrets; **External Secrets Operator** (Phase 27); SOPS | ESO: K8s-native, Vault-friendly (recommended; Phase 27 deepens) |

---

## 4. TOOLS (as of 2026-06)

### Core
- **K3s**: homelab distribution
- **`kubectl`**, **`helm`**, **`kustomize`**, **`k9s`**, **`stern`**
- **`flux` CLI**: GitOps controller
- **`kubebuilder`**: for the custom operator you'll build in Phase 26

### Operators for stateful workloads
- **CloudNativePG**: Postgres-on-K8s, the modern default
- **Redis Operator** (Spotahome or OT Redis Operator)
- **Cert-manager**: TLS certificates as CRDs
- **External Secrets Operator**: secrets distribution (Phase 27)

### Autoscaling
- **Karpenter**: node autoscaling (K8s-native, CRD-driven)
- **Keda**: event-driven workload autoscaling

### Networking + storage
- **Cilium Gateway** (or Traefik for compare): ingress
- **MetalLB**: bare-metal load balancing
- **Longhorn**: persistent volumes on homelab

### Reading
- "Kubernetes: Up and Running" (Burns et al.) Ch. 1-12
- "Production Kubernetes" (Dotson + Burnson)
- "GitOps and Kubernetes" (Yuen et al.)
- Kubernetes docs, *Concepts* section end-to-end
- CloudNativePG documentation
- Flux GitOps Toolkit documentation

---

## 5. MASTERY: The basecamp substrate, K8s-native

### 5.1 What lives in basecamp by end of Phase 20

```
substrate  K3s              (running on the mini-PC)
         Flux             (bootstrapped via GitOps; reconciles basecamp repo)
         CloudNativePG    (operator-managed Postgres cluster)
         Redis Operator   (operator-managed Redis)
         Cert-manager     (TLS certs)
         Karpenter        (node autoscaling, mock provider in homelab)
         Keda             (event-driven workload autoscaling)
         Prometheus       (scraping pulse + node-exporter + kube-state-metrics)
         Grafana          (dashboards for pulse, Postgres, K8s)
module    beacon           (deployed via Flux HelmRelease + Kustomize overlay)
```

Helm charts + Kustomize overlays for env (dev/prod) are the standard packaging shape.

### 5.2 Operational depth checklist

```
[ ] Install K3s on a homelab VM (single-node initially)
[ ] Install Flux via Flux CLI; bootstrap GitOps reconciliation against basecamp repo
[ ] Deploy CloudNativePG operator; declare a Postgres `Cluster` CRD; verify HA + backups
[ ] Deploy Redis Operator; declare a Redis CRD; verify
[ ] Deploy cert-manager; issue a self-signed cert via Certificate CRD
[ ] Install Karpenter; verify it reconciles Pending pods to node provisioning
[ ] Install Keda; configure ScaledObject CRD for one workload based on queue depth or Prometheus metric
[ ] Deploy kube-prometheus-stack via Flux HelmRelease; verify metrics flow
[ ] Deploy pulse; verify Prometheus scrapes /metrics
[ ] Deploy Grafana dashboard for pulse
[ ] Implement NetworkPolicy: only beacon talks to Postgres Cluster
[ ] Ship beacon v0.1 to basecamp via Flux + Helm + Kustomize overlay; verify drift detection
[ ] Force Pod Pending; diagnose (resources? affinity? PVC?)
[ ] Force Deployment rollout failure; observe `kubectl rollout status`
[ ] Trigger etcd backup; restore from it
[ ] Practice operator-managed Postgres failover (CloudNativePG promotes a replica)
```

---

## 6. COMPARE: ArgoCD or Nomad

Pick one:

- **ArgoCD**: the more popular GitOps tool. Install on basecamp alongside Flux; deploy one Application. Reflect on Application vs Flux's compositional CRDs.
- **Nomad**: non-K8s orchestrator. Smaller, simpler. Deploy a tiny workload there.

400-word reflection: what does each get right? Why did the K8s-native ecosystem converge?

---

## 7. OPERATE

- 8-10 runbooks: Pod stuck Pending, CrashLoopBackOff, Service no endpoints, Ingress cert renewal, Flux source stuck, etcd disk full, PV stuck, NetworkPolicy blocking expected, CloudNativePG failover, Karpenter NodePool stuck
- 2-3 ADRs: K3s over kubeadm; Flux over ArgoCD; CloudNativePG over raw StatefulSet; Karpenter over cluster-autoscaler
- Weekly log

---

## 8. CONTRIBUTE

- Kubernetes docs
- Flux GitOps Toolkit (CNCF)
- CloudNativePG (CNCF Incubating)
- Karpenter (CNCF)
- Keda (CNCF Graduated)

**Arc 3 first merged PR deadline: this phase.** A docs PR counts.

---

## What ships from this phase

- **basecamp substrate + beacon live, K8s-native**: K3s + Flux + CloudNativePG + Redis Operator + Karpenter + Keda + cert-manager + Prometheus + Grafana + `beacon`
- **`beacon` v0.1 shipped publicly** (code on GitHub; runtime data private)
- **`basecamp` repo initialized** (still private; goes public in [Phase 24](/program/arc-3/phase-24/))
- **First merged upstream PR**
- **8-10 K8s runbooks**

---

## Validation criteria

```
[ ] K3s + Flux operational; basecamp repo reconciled
[ ] CloudNativePG + Redis Operator managing stateful workloads
[ ] Karpenter + Keda operational
[ ] beacon v0.1 deployed via Flux HelmRelease + Kustomize overlay
[ ] All 15 operational depth checks
[ ] Compare reflection (400 words)
[ ] 8-10 K8s runbooks
[ ] 2-3 ADRs
[ ] First merged upstream PR
[ ] Pattern entries deepened:
    - control-loops → DEEP target
    - declarative-vs-imperative-infrastructure → OUTLINE
    - gitops → OUTLINE
    - load-balancing → OUTLINE
    - network-policy → OUTLINE
    - service-discovery → OUTLINE
    - mediation reinforced toward DEEP
[ ] Exit Test passed
```

---

## Exit Test

**Time: 4 hours.**

### Part 1: Build (120 min)
Fresh K3s cluster. Bootstrap Flux. Deploy a new small service via Flux HelmRelease + Kustomize overlay with: NetworkPolicy, Ingress with TLS (cert-manager), ServiceMonitor for Prometheus, Grafana dashboard. Stateful dependency via CloudNativePG `Cluster`. All declarative.

### Part 2: Diagnose (90 min)
Three scenarios (Pod Pending, Ingress 502, Flux Kustomization stuck). Root-cause each + write runbooks.

### Part 3: Articulate (60 min)
~1000 words: *"`kubectl apply -f flux-bootstrap.yaml` on a fresh cluster. Walk what happens end-to-end. Every controller that wakes up. Every CRD that gets reconciled. Every networking primitive that gets touched. Cite patterns at each layer. Then explain why CloudNativePG's operator pattern beats a hand-rolled StatefulSet for production Postgres."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Raw StatefulSets for production stateful workloads | Operator handles failover, backups, rolling upgrades; hand-rolled = pager calls |
| Helm without Kustomize for multi-env | You end up with three forks of the same chart |
| ArgoCD because tutorials are easier | Pick based on architecture fit, not tutorial count |
| Skipping NetworkPolicy "because homelab" | Habits transfer to production |
| Memorizing kubectl instead of understanding the API | kubectl is a CLI over the API server; read API objects |

---

## Patterns touched this phase

- [control-loops](/patterns/foundations/control-loops/): **DEEP target**
- `declarative-vs-imperative-infrastructure`: OUTLINE
- `gitops`: OUTLINE (via Flux specifically)
- `mediation` reinforced toward DEEP
- `load-balancing`: OUTLINE
- `network-policy`: OUTLINE
- `service-discovery`: OUTLINE
- `operator-pattern`: first OUTLINE (deepens through Phase 26 custom operator + later years' KubeRay/Strimzi/KServe operators)

---

→ Next: [Phase 21: Distributed Systems Theory](/program/arc-3/phase-21/)
