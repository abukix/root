---
title: "Glossary"
description: "Canonical definitions of /root terminology: Workload CRD, basecamp modules, STUB/OUTLINE/DEEP, run-pray-build, the K8s-native ecosystem, and the other terms that recur across the curriculum. Sorted by category."
tags: [program, glossary, reference]
---

> The /root curriculum is dense with terminology, much of it specific to the program, some borrowed from the K8s + ML ecosystems. This page is the decoder. Read top-down once; refer back whenever a phase doc uses a term you can't place.

## Program structure

**/root**: The self-authored curriculum from Software Engineering Foundations to ML Platform / AI Infrastructure. Pattern-first, platform-driven, resource-neutral. Path-styled to evoke the "root principle" metaphor: every phase asks you to find the *root* of the problem before the tool. See [Master Plan](/program/overview/).

**Abukix**: The brand the curriculum produces. Named after the author's surname. Single-namespace identity: `abukix.dev` (domain), `abukix-root/` (workspace), `basecamp` (the platform), `vantage` (the unified UI module).

**basecamp**: The K8s-native, open-source unified data + ML + AI platform /root builds across Arc 3-Arc 5. Composed of **8 modules** (`ascent`, `crag`, `vantage`, `beacon`, `forge`, `prism`, `loom`, `warden`) running on a shared substrate (K8s + Flux + Cilium + Postgres + Prometheus/Grafana/Loki/Tempo + Vault). Runs on laptop (`kind`/`k3d`), homelab (K3s), or cloud (managed K8s). See [`abukix/basecamp`](https://github.com/abukix/basecamp).

**Module (basecamp)**: One of the 8 shipping artifacts that compose into basecamp. Each module has its own repo, release cadence, and blast radius: `ascent` (dev CLI + Workload operator), `crag` (data tier: Iceberg/Trino/MinIO/Spark), `vantage` (unified UI), `beacon` (on-call triage), `forge` (Terraform + Crossplane IaC), `prism` (LLM gateway), `loom` (MCP fabric), `warden` (AIOps operator). See [`basecamp/ARCHITECTURE.md`](https://github.com/abukix/basecamp/blob/main/ARCHITECTURE.md).

**Phase**: The unit of /root. ~50 phases total across the 5 arcs. Each phase is self-contained and follows the 8-step pattern-first scaffold (PROBLEM → PRINCIPLES → TRADE-OFFS → TOOLS → MASTERY → COMPARE → OPERATE → CONTRIBUTE). See any phase doc, e.g., [Arc 1 Phase 1](/program/arc-1/phase-1/).

**Year**: Thematic grouping of phases. Each year ends at a credible role exit ramp (Arc 1 → Junior SWE; Arc 2 → Mid-Backend; Arc 3 → Senior DevOps/SRE/Platform; Arc 4 → Senior Data/ML; Arc 5 → ML Platform / AI Infrastructure). Year boundaries are pace-flexible; the program is the 50 phases, the years are the theme.

**Senior IC**: Senior Individual Contributor. The /root program's exit-ramp target role (ML Platform / AI Infrastructure at a frontier lab). Distinct from a management track. See [overview](/program/overview/#the-5-arcs-at-a-glance).

**Final Exam**: Each year ends with a 6-hour scenario-based exam covering its phases. Arc 5's exam is paired with the **Capstone**: full basecamp (all 8 modules running end-to-end) + the Pattern Paper.

**Capstone**: The Arc 5 deliverables: `basecamp v1.0.0` launched publicly (all 8 modules integration-tested and running on the author's homelab) + the Pattern Paper (3,500-5,000 word synthesis essay). The artifacts that close the program. See [The Capstone](/program/capstone/).

**Pattern Paper**: The Arc 5 Capstone synthesis essay. The single highest-stakes doc the program produces. Audience: Staff/Principal-level hiring managers. Reviewed by 2+ external readers before publishing. See [pattern-paper outline](/meta/pattern-paper-outline/) *(ports in v0.5.0+)*.

---

## Pattern library mechanics

**Pattern**: The durable knowledge artifact /root produces. The timeless shape of a problem and the principled trade-offs any solution must make. *Tools change; patterns don't.* The library is what survives the 5 arcs and outlives the specific tools you'll have learned.

**Pattern Library**: The full corpus of pattern entries at `/patterns/`. ~75 entries across 10 categories at graduation. See [Pattern Library](/patterns/) *(ports in v0.3.0)*.

**STUB / OUTLINE / DEEP**: The pattern depth ladder.
- **STUB**: frontmatter + 1-paragraph summary + concrete real-world instances + canonical references. Default state. Created when first referenced.
- **OUTLINE**: promoted when a phase first touches the pattern. Adds PROBLEM · PRINCIPLES · TRADE-OFFS · TOOLS sections.
- **DEEP**: promoted after 6+ months of operating something that depends on the pattern. Adds MASTERY · COMPARE · OPERATE · CONTRIBUTE sections. Frontmatter has `deep_since:` date + `operating_evidence:` list.

The depth is a property of *operating evidence*, not a label on the entry. A DEEP claim without operating evidence is a lie to yourself. See [pattern template](/meta/pattern-template/) *(ports in v0.5.0+)*.

**8-step pattern-first scaffold**: The structure every phase doc follows: **PROBLEM** → **PRINCIPLES** → **TRADE-OFFS** → **TOOLS** → **MASTERY** → **COMPARE** → **OPERATE** → **CONTRIBUTE**. The COMPARE step (re-implement the same problem in a second tool) is the non-negotiable proof of pattern fluency. See [overview](/program/overview/#the-pattern-first-scaffold).

**Pattern-first**: The framing rule. Every concrete tool sits inside a named pattern; name the pattern before naming the tool. The opposite is *tool-first*, where engineers identify by their tools and re-learn their identity every 5 years.

**Investigation prompts**: Phase docs guide; they don't supply answers. An investigation prompt is a question the phase asks you to investigate yourself ("Walk a Crossplane-driven platform: XRDs reconciled by Compositions"). Claude (and the [root-tutor skill](https://github.com/abukix/root/blob/main/.claude/skills/root-tutor/SKILL.md)) refuses to answer these: guide, not spoon-feed.

---

## Artifacts you produce

**Weekly log**: Sunday entry. ~1-2 hours. Five sections (what I did / what I learned / what surprised / what's stuck / next week). The single most-load-bearing habit of /root. ~250 entries by graduation. See [weekly-log template](/meta/weekly-log-template/) *(ports in v0.5.0+)*.

**Runbook**: Recipe for a single operational task. Trigger → pre-reqs → numbered steps with expected outcomes → verification → rollback. ~140 runbooks by graduation. See [runbook template](/meta/runbook-template/) *(ports in v0.5.0+)*.

**Postmortem**: Blameless analysis after every real incident. Summary / impact / timeline / root cause / what went well / poorly / action items with owners + dates. ~25 by graduation. See [postmortem template](/meta/postmortem-template/) *(ports in v0.5.0+)*.

**ADR** (Architecture Decision Record): One-page artifact recording a single architecturally-consequential decision. Context / decision / consequences (positive, negative, neutral) / alternatives considered with why-rejected. ~15 by graduation across the family. See [adr template](/meta/adr-template/) *(ports in v0.5.0+)*.

**Blog post**: Monthly Arc 3+. ~800-2,000 words. Tied to a specific moment (incident, ship, pattern promotion). Pattern-first. Carries receipts (commits, runbooks, dashboards). ~36 by graduation. See [blog-post template](/meta/blog-post-template/) *(ports in v0.5.0+)*.

**Private operational corpus**: The private longitudinal record where weekly logs, runbooks, postmortems, and personal ADRs accumulate. Started Arc 1 Phase 1; runs through graduation. Arc 5 `warden` (AIOps) indexes it as its RAG corpus. **Always private.** Kept in a separate private repository; never linked from any public artifact.

**Pattern Library entry**: See *Pattern* above. Note the entry's depth (STUB/OUTLINE/DEEP) is the public claim about how much operating evidence backs it.

**Project README**: Each shipping artifact's front door. ~12 across the program (8 basecamp modules + `basecamp` umbrella + `sift` + `pulse` + `/root` itself). Standardized via the [project-readme template](/meta/project-readme-template/) *(ports in v0.5.0+)*.

---

## Operational discipline

**AI Learning Protocol**: The 7 rules that govern how the operator uses AI in /root. Most load-bearing: *guide-not-spoon-feed*, *patterns-before-tools*, *validate-then-write*, *push-back-on-shallow*, *never-write-the-exercise*. See [program/ai-learning-protocol](/program/ai-learning-protocol/).

**Validate-then-write**: Rule #3 of the AI Learning Protocol. Claude iterates the operator's draft. Claude does NOT write the operator's first draft, especially for weekly logs, pattern entries, postmortems, the Pattern Paper. The template is the contract; AI fills inside sections the operator has drafted.

**Run-pray-build**: The daily-rhythm triad. **Run** for the body. **Pray** for the spirit. **Build** for the craft. None alone is sustainable over 5 years; all three together is the only stable configuration. See [story.md: the rhythm](/program/story/#the-rhythm).

**Public-safety discipline**: The commitment that no internal product names from any prior-employer stack appear in any public artifact. Enforced by the `/pre-publish-check` skill before any publishing moment (a basecamp module going public for the first time, a blog post publishing, `vantage`'s Arc 5 launch, the curriculum site going live).

**Public-safety check**: Operational form of the discipline. Invoked via the `/pre-publish-check` skill. Sweeps the tree for corporate hostname patterns, employer-specific internal names, credential leaks, and broken cross-references.

**OSS-over-enterprise preference**: Default to OSS / community editions even when free enterprise tiers exist. Specific traps to flag: Proxmox subscription, Vault Enterprise, Grafana Cloud, Docker Desktop license, Terraform vs OpenTofu. See [homelab/index: Why OSS-only](https://github.com/abukix/homelab#why-oss-only).

**Solo operator with disciplined review**: The PR workflow encoded in [ADR-0001](/adrs/0001-solo-operator-with-disciplined-review/): branch → PR → CI → overnight wait → merge. No fake-team multi-account simulation. AI as sanity check + external review at consequential moments.

---

## Technology: K8s + cloud + ML

**CRD** (Custom Resource Definition): Kubernetes API extension that defines a new resource type. The K8s-native way to declare domain-specific abstractions.

**Operator**: Custom CRD + custom controller that watches CRD instances and reconciles them into underlying state. /root builds two custom operators in `basecamp`: `ascent` (Workload operator) at Arc 3 Phase 26; `warden` (AIOps operator) at Arc 5 Phase 50. See [operator-pattern](/patterns/infrastructure-and-platform/operator-pattern/) *(ports in v0.3.0)*.

**Control-loop**: The reconciliation pattern. Declared state → controller continuously drives actual state toward declared. The pattern under Kubernetes, GitOps, every K8s operator, thermostats, PID controllers. See [foundations/control-loops](/patterns/foundations/control-loops/) *(ports in v0.3.0)*.

**GitOps**: Git as the source of truth for desired state; a reconciler (Flux for basecamp) converges actual state to declared continuously. The control-loop pattern lifted up one layer to platform declaration. See [gitops](/patterns/infrastructure-and-platform/gitops/) *(ports in v0.3.0)*.

**Flux**: The K8s-native GitOps reconciler basecamp uses (versus ArgoCD). Composes naturally with Crossplane + Cilium + Strimzi + KubeRay + KServe in the K8s-native ecosystem. Bootstrapped at Arc 3 Phase 20; `forge` v0 (Arc 3 Phase 22) provisions the substrate that Flux reconciles.

**Kustomize**: K8s YAML overlay system. Per-cluster customization of a shared base. basecamp uses `base/ + overlays/{laptop,homelab,cloud}/` shape. See [k8s-templates/kustomize-overlay-pair](/meta/k8s-templates/).

**Helm**: K8s package manager. basecamp uses Helm via Flux `HelmRelease` CRDs; per-module Helm chart at each module's repo.

**Workload CRD**: `platform.basecamp.io/v1alpha1` Kind. basecamp's platform-contract API defined by `ascent`. Declares a service's language, owner, SLO, targets, dependencies. The `ascent` custom operator (Arc 3 Phase 26) reconciles it into the underlying state (Helm chart + Kustomize overlays + Flux HelmRelease + NetworkPolicy + SLO definition + runbook stub).

**K8s-native ecosystem**: The meta-pattern: every component is a CRD-driven controller composing through the K8s API. State in CRDs (not config files). Behavior in controllers. Composition through the K8s API. Uniform operational interface across every layer. See [platform-patterns](/program/platform-patterns/#the-k8s-native-ecosystem-as-a-meta-pattern).

**SLO / SLI / Error Budget**: The SRE-book contract trio. **SLI** measures reality (e.g., success rate, p95 latency). **SLO** is the target (e.g., 99.5% success / 30 days). **Error budget** is what's left to spend on planned risk. See [sli-slo-error-budget](/patterns/observability-and-ops/sli-slo-error-budget/) *(ports in v0.3.0)*.

**Substrate**: The K8s + supporting-services foundation every basecamp module runs on. Substrate components: Kubernetes (kind/k3d/K3s/managed), Flux, Cilium, Postgres + Redis, Prometheus + Grafana + Loki + Tempo, Vault + External Secrets Operator. Provisioned by `forge`; consumed by every other module.

---

## Industry framing

**Frontier-lab**: The generic framing for industry parallels (Anthropic, OpenAI, and the other organizations building frontier AI platforms). Substitutes for any specific company name when describing patterns. Load-bearing framing when a public parallel exists but naming a specific internal product would violate public-safety discipline.

**Platform-as-product**: The discipline that treats the internal platform as a product, developers as customers, developer experience as the unit of work. basecamp's [`ascent`](https://github.com/abukix/ascent) instantiates this at homelab-and-small-team scale. See [pattern](/patterns/infrastructure-and-platform/platform-as-product/).

**The build guide for basecamp**: /root's brand pillar. The one sentence that gates every /root artifact: if it doesn't visibly contribute to *the curriculum*, *building basecamp*, or *the public build-in-public discipline*, it doesn't belong under /root's namespace.

---

## Cross-references

- [Master Plan](/program/overview/): the structural overview
- [The Capstone](/program/capstone/): the integrated arc
- [The Story](/program/story/): narrative + rhythm
- [Reading list](/program/reading-list/): canonical references for the terms above
- [Pattern Library](/patterns/): where most of the operational terms originate *(ports in v0.3.0)*
- [brand/identity](https://github.com/abukix/brand/blob/main/identity.md): Abukix-specific terminology
- [`basecamp/ARCHITECTURE.md`](https://github.com/abukix/basecamp/blob/main/ARCHITECTURE.md): canonical module boundaries + composition contract
