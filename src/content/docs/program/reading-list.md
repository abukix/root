---
title: "Reading List"
description: "Consolidated canonical references cited across /root: DDIA, the SRE book, the Iceberg paper, QLoRA, and the rest. Sorted by domain, with where each gets referenced in the curriculum and what to read first."
tags: [program, reading-list, bibliography, reference]
---

> The curriculum references ~30 canonical books and papers scattered across 50 phase docs. This page consolidates them so you can read deliberately rather than reactively.
> Resource-neutral by design: these are *durable references*, not paid platforms. Their content survives the curriculum.

## How to use this list

- **Don't read everything upfront.** Each entry names the phase that motivates it. Read when the phase activates.
- **Don't read alone.** The /root rhythm is *operate while reading*. The book without the phase is theory; the phase without the book is shallow.
- **Skim first, read second.** The /root approach: phase doc → skim the relevant book chapters → operate something → return to the book with operational context.
- **The books are not optional.** They're how patterns codify; tools come and go but DDIA hasn't aged in 9 years.

---

## Foundations: read across Arc 1 + revisit yearly

### "Designing Data-Intensive Applications" (DDIA)
**Martin Kleppmann, 2017.** O'Reilly.

The single most-referenced book in /root. Read Ch 1-4 in Arc 1 (foundations + storage); Ch 5-9 in Arc 3 Phase 21 (distributed systems theory); Ch 10-12 in Arc 4 (batch + streaming + future).

DDIA is what makes you fluent in the distributed-systems vocabulary senior engineers use. Replication, consistency models, partitioning, consensus, exactly-once-ish: all named here with rigor.

**Cited in:** [program/arc-3/phase-21](/program/arc-3/phase-21/), [patterns/storage-and-data/oltp-vs-olap](/patterns/storage-and-data/oltp-vs-olap/), [patterns/distributed-systems/](/patterns/distributed-systems/), and ~15 other docs.

### "The Linux Programming Interface" (TLPI)
**Michael Kerrisk, 2010.** No Starch Press.

The reference for Linux from a programmer's perspective. Read Ch 1-3, 24-27 in Arc 3 Phase 17 (OS internals); refer back whenever a kernel concept comes up.

Doorstop-thick (~1500 pages). Not meant to read end-to-end. The /root use: targeted chapters when phases need them.

**Cited in:** [program/arc-3/phase-17](/program/arc-3/phase-17/), [patterns/foundations/privilege-separation](/patterns/foundations/privilege-separation/), [patterns/foundations/virtualization](/patterns/foundations/virtualization/).

### "Site Reliability Engineering" (the SRE book)
**Edited by Beyer, Jones, Petoff, Murphy. Google, 2016.** O'Reilly. **Free online** at sre.google.

The Google SRE methodology. Read Ch 3-4 (SLOs, error budgets) at Arc 3 Phase 28; Ch 12-14 (operational practices) across Arc 3.

**Cited in:** [patterns/observability-and-ops/sli-slo-error-budget](/patterns/observability-and-ops/sli-slo-error-budget/), [patterns/observability-and-ops/reliability-engineering](/patterns/observability-and-ops/reliability-engineering/), [program/arc-3/phase-28](/program/arc-3/phase-28/), [program/arc-3/phase-30](/program/arc-3/phase-30/).

### "The Site Reliability Workbook"
**Google SRE, 2018.** O'Reilly. **Free online**.

The practical companion to the SRE book. Worked examples of SLOs, runbooks, incident response. Read alongside the SRE book at Arc 3 Phase 28 + Phase 30.

---

## Software Architecture: Arc 1 Phase 5

### "Domain-Driven Design"
**Eric Evans, 2003.** Addison-Wesley.

The book that introduced ubiquitous language, bounded contexts, aggregates. Dense; the "blue book." Skim Part I-II in Arc 1 Phase 5; revisit when designing Arc 2 services.

**Cited in:** [patterns/architecture/domain-driven-design](/patterns/architecture/domain-driven-design/).

### "Clean Architecture"
**Robert C. Martin, 2017.** Prentice Hall.

The dependency rule + the case for keeping the domain isolated. Read in Arc 1 Phase 5.

**Cited in:** [patterns/architecture/clean-architecture](/patterns/architecture/clean-architecture/).

### "Patterns of Enterprise Application Architecture" (PoEAA)
**Martin Fowler, 2002.** Addison-Wesley.

The Repository pattern, Unit of Work, Data Mapper: patterns that survive every ORM and framework. Refer to chapters 9, 11 in Arc 1 Phase 5 + Arc 2 Phase 9.

**Cited in:** [patterns/architecture/repository-pattern](/patterns/architecture/repository-pattern/).

### "Hexagonal Architecture" (article)
**Alistair Cockburn, 2005.** alistaircockburn.com.

The ports-and-adapters article. Short read. The architectural shape that makes tests trivial. Read in Arc 1 Phase 5.

**Cited in:** [patterns/architecture/hexagonal-and-ports-and-adapters](/patterns/architecture/hexagonal-and-ports-and-adapters/).

---

## Distributed Systems: Arc 3 Phase 21

### "In Search of an Understandable Consensus Algorithm" (Raft paper)
**Diego Ongaro, John Ousterhout, 2014.** USENIX ATC.

The Raft consensus algorithm: what etcd, Postgres HA tools, modern Kafka controller (KRaft) all use. Read in Arc 3 Phase 21, then implement Raft-in-Go as the phase's lab.

**Cited in:** [patterns/distributed-systems/consensus](/patterns/distributed-systems/consensus/).

### "Paxos Made Simple"
**Leslie Lamport, 2001.** Distributed Computing column, ACM.

The original Paxos paper, in (relatively) plain language. Read alongside Raft to understand the lineage.

### "Time, Clocks, and the Ordering of Events in a Distributed System"
**Leslie Lamport, 1978.** CACM.

Logical clocks. The foundational paper for distributed time. Read in Arc 3 Phase 21.

**Cited in:** [patterns/distributed-systems/distributed-time](/patterns/distributed-systems/distributed-time/).

### "CAP Theorem" / "PACELC"
**Brewer 2000 (CAP); Abadi 2012 (PACELC).** Papers.

The trade-off space. Read alongside DDIA Ch 9 in Arc 3 Phase 21.

**Cited in:** [patterns/distributed-systems/cap-and-pacelc](/patterns/distributed-systems/cap-and-pacelc/).

### "A Comprehensive Study of Convergent and Commutative Replicated Data Types" (CRDT paper)
**Shapiro, Preguiça, Baquero, Zawirski, 2011.** INRIA.

CRDTs from the canonical source. Read in Arc 3 Phase 21 (if you go DEEP on CRDTs).

**Cited in:** [patterns/distributed-systems/crdts](/patterns/distributed-systems/crdts/).

---

## Storage & Data: Arc 2 Phase 9 + Arc 4 Phase 31

### "The Iceberg Paper"
**Netflix, ~2017-2018.** apache.org/iceberg.

The Apache Iceberg paper: table format on object storage, snapshot-plus-delta, schema evolution, time-travel. Read in Arc 4 Phase 31.

**Cited in:** [patterns/storage-and-data/snapshot-plus-delta](/patterns/storage-and-data/snapshot-plus-delta/), [patterns/data-engineering/lakehouse](/patterns/data-engineering/lakehouse/), [program/arc-4/phase-31](/program/arc-4/phase-31/).

### "Designing Cloud Data Platforms"
**Pathirana, Bandara, et al., 2021.** Manning.

The lakehouse + multi-cloud data platform shape, end to end. Read in Arc 4 alongside Phase 31-33.

---

## Platform Engineering: Arc 3 Phase 26

### "Platform Engineering"
**Camille Massa, Ian Smith, 2024.** O'Reilly.

The discipline book. Platform-as-product, paved roads, internal developer platforms. Read alongside Arc 3 Phase 26 + capstone planning.

**Cited in:** [patterns/infrastructure-and-platform/platform-as-product](/patterns/infrastructure-and-platform/platform-as-product/), [program/arc-3/phase-26](/program/arc-3/phase-26/).

### "Team Topologies"
**Matthew Skelton, Manuel Pais, 2019.** IT Revolution.

How platform teams compose with stream-aligned, enabling, complicated-subsystem, and platform team types. Useful context even as a solo operator: you'll work in environments shaped by this taxonomy.

**Cited in:** [program/arc-3/phase-26](/program/arc-3/phase-26/).

### "Programming Kubernetes: Developing Cloud-Native Applications"
**Michael Hausenblas, Stefan Schimanski, 2019.** O'Reilly.

The canonical K8s controller-development book. Read in Arc 3 Phase 26 before building the ascent operator. Followed by the kubebuilder book (free online).

**Cited in:** [program/arc-3/phase-26](/program/arc-3/phase-26/), [patterns/infrastructure-and-platform/operator-pattern](/patterns/infrastructure-and-platform/operator-pattern/).

### "Kubernetes Operators: Automating the Container Orchestration Platform"
**Jason Dobies, Joshua Wood, 2020.** O'Reilly.

Operator patterns at depth. Companion to *Programming Kubernetes* for Arc 3 Phase 26 + Arc 5 Phase 50.

---

## Networking & Security: Arc 3 Phase 18 + Phase 25 + Phase 27

### "Computer Networking: A Top-Down Approach"
**James Kurose, Keith Ross, 8th ed., 2020.** Pearson.

The undergraduate networking textbook that doesn't get outdated. Read in Arc 3 Phase 18.

### "BPF Performance Tools"
**Brendan Gregg, 2019.** Addison-Wesley.

eBPF at depth: for understanding what Cilium does under the hood, and for general systems observability. Read in Arc 3 Phase 28 (observability).

### "Threat Modeling: Designing for Security"
**Adam Shostack, 2014.** Wiley.

STRIDE + attack trees. Read in Arc 2 Phase 12 (auth) + Arc 3 Phase 27.

**Cited in:** [patterns/security-and-policy/threat-modeling](/patterns/security-and-policy/threat-modeling/).

### NIST SP 800-207: Zero Trust Architecture
**NIST, 2020.** Free PDF.

The canonical Zero Trust reference. Short read. Foundational for Arc 3 Phase 25 + Phase 27.

**Cited in:** [patterns/networking/zero-trust-networking](/patterns/networking/zero-trust-networking/).

---

## ML Systems: Arc 4 + Arc 5

### "Designing Machine Learning Systems"
**Chip Huyen, 2022.** O'Reilly.

The "DDIA for ML." Feature stores, training-serving skew, online vs batch features, drift detection, the full lifecycle. Read in Arc 4 Phase 34-38 + Arc 5 Phase 39-41.

**Cited in:** [program/arc-5/phase-39](/program/arc-5/phase-39/), [patterns/ml-systems/](/patterns/ml-systems/), and ~10 other Arc 5 docs.

### "AI Engineering: Building Applications with Foundation Models"
**Chip Huyen, 2024.** O'Reilly.

The newer companion to *Designing ML Systems*, focused on LLM applications. Evaluations, agents, RAG, LLM gateways. Read across Arc 5.

**Cited in:** [program/arc-5/phase-46](/program/arc-5/phase-46/), [patterns/ml-systems/evals](/patterns/ml-systems/evals/).

### "Efficient Memory Management for Large Language Model Serving with PagedAttention" (vLLM paper)
**Kwon, Li, Zhuang, et al., 2023.** SOSP.

The paper that introduced PagedAttention: the KV-cache management strategy under vLLM. Read in Arc 5 Phase 43 + 44.

**Cited in:** [patterns/ml-systems/llm-serving](/patterns/ml-systems/llm-serving/), [program/arc-5/phase-43](/program/arc-5/phase-43/).

### "QLoRA: Efficient Finetuning of Quantized LLMs"
**Dettmers, Pagnoni, Holtzman, Zettlemoyer, 2023.** NeurIPS.

QLoRA: 4-bit quantization + LoRA finetuning. Read in Arc 5 Phase 45.

**Cited in:** [patterns/ml-systems/fine-tuning-strategies](/patterns/ml-systems/fine-tuning-strategies/), [program/arc-5/phase-45](/program/arc-5/phase-45/).

### "LoRA: Low-Rank Adaptation of Large Language Models"
**Hu, Shen, Wallis, Allen-Zhu, et al., 2021.** ICLR 2022.

The original LoRA paper. Foundation for QLoRA. Read alongside QLoRA.

### "Fast Inference from Transformers via Speculative Decoding"
**Leviathan, Kalman, Matias, 2023.** ICML.

The speculative decoding technique. Read in Arc 5 Phase 44.

**Cited in:** [patterns/ml-systems/inference-optimization](/patterns/ml-systems/inference-optimization/), [program/arc-5/phase-44](/program/arc-5/phase-44/).

### Anthropic engineering blog
**ongoing.** anthropic.com/engineering.

The most rigorous public writing on agents-in-production, tool use, prompt engineering, and AI evaluations as of 2026. Skim every quarter; read posts on agent design + tool use in Arc 5 Phases 47-50.

### Model Context Protocol (MCP) specification
**Anthropic, ongoing.** modelcontextprotocol.io.

The open protocol for exposing tools to LLM agents. Read in Arc 5 Phase 48 before building the MCP servers.

**Cited in:** [patterns/ml-systems/mcp-protocol](/patterns/ml-systems/mcp-protocol/), [program/arc-5/phase-48](/program/arc-5/phase-48/).

---

## Industry case studies: read alongside platform-patterns

These are public engineering blog posts and conference talks, not books. The [platform-patterns doc](/program/platform-patterns/) cites them in context. Worth periodic skimming.

- **Netflix Tech Blog**: Iceberg origin, Chaos Monkey, data platform evolution.
- **Uber Engineering Blog**: Michelangelo (ML platform), Hudi (streaming-native lakehouse).
- **Spotify Engineering**: Backstage, Hendrix (ML platform), service ownership at scale.
- **Airbnb Engineering**: Bighead (ML platform), Airflow origins.
- **Stripe Engineering**: API design, idempotency, financial-scale reliability.
- **LinkedIn Engineering**: Kafka, the data-infrastructure team's archive.
- **Cloudflare Engineering**: eBPF, Workers, global-edge platform.
- **Anthropic Engineering**: see above; the canonical 2024-2026 source for AI platform writing.

---

## How to acquire

Most books on this list are physical / paid (~$30-50 each). Some are free online (the SRE books, papers, blogs).

**Budget guidance:** ~$300-500 for the full canonical set across the 5 arcs. Buy when the phase activates; don't acquire everything upfront. The library will outlast the program; these books stay relevant.

**Alternative:** O'Reilly online learning subscription gives access to most of the books on this list. Worth the ~$50/month if you're consuming heavily.

## What's intentionally NOT on this list

- **Specific certification books**: AWS / GCP / CKAD prep guides. Out of scope for /root's pattern-first approach. Pick up if you specifically need a cert for a job.
- **Framework-specific tutorial books**: "Mastering React" / "FastAPI in Action" / etc. The framework docs + practice are sufficient; books on volatile frameworks rot fast.
- **Career / job-search books**: out of /root scope.
- **Pop-tech books** (the *Brief History of...* genre): fine if you enjoy them, not load-bearing for the program.

---

## Cross-references

- [Master Plan](/program/overview/): where the curriculum cites each book
- [Pattern Library](/patterns/): pattern entries link to specific chapters
- [Glossary](/program/glossary/): terminology the books introduce
- [AI Learning Protocol: push-back-on-shallow](/program/ai-learning-protocol/): the rule that books support: when AI gives a shallow answer, the book has the depth
