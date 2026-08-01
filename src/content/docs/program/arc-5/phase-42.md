---
title: "Vector Stores + Embeddings + RAG"
description: "Phase 42 of /root Arc 5: vector search at depth via pgvector (on CloudNativePG) and Milvus Operator. Embedding pipelines. RAG architecture: ingest + retrieve + generate. Hybrid search. `prism` prep on basecamp."
tags: [arc-5, ai, vector-search, embeddings, rag, milvus]
arc: 5
phase: 42
---

> Fourth phase of Arc 5. The retrieval layer of every AI system.

[Phase 36](/program/arc-4/phase-36/) introduced attention. This phase puts it to work: embeddings turn text/images/anything into vectors; vector stores serve similarity search at sub-100ms; RAG (Retrieve-Augmented Generation) is the dominant production architecture for LLM applications in 2026. By phase end basecamp has **pgvector** on CloudNativePG and **Milvus** via Milvus Operator running side-by-side; an embedding pipeline ingests `chronicle` and code into vectors; a RAG endpoint serves "what's in our docs about X?" queries.

The K8s-native deployment is consistent with the rest of basecamp: every vector store is a CRD-driven operator-managed component.

---

## Prerequisites

> - All Arc 4 + Arc 5 Phase 39-41 complete
> - GPU available for embedding generation (or fast CPU)

---

## Why this phase exists

LLMs alone are stateless: they don't know your data. RAG is the pattern that connects them: ingest your data → embed → store → retrieve relevant chunks at query time → feed to LLM. Every production LLM application bigger than a chatbot uses RAG. The retrieval layer (vector store) is the hard part operationally.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have data (`chronicle`, code, runbooks, weekly logs) and an LLM. You want users to ask questions and get answers grounded in your data. The LLM alone hallucinates. You need to: turn data into vectors (embeddings), store + index them (vector store), query by similarity (nearest neighbors), include results in the LLM prompt (RAG).

---

## 2. PRINCIPLES

### 2.1 Embeddings as vector representations

An embedding model converts text/images/audio into fixed-dimensional vectors. Semantically similar inputs map to nearby vectors.

→ Pattern: `embedding-store`: OUTLINE

**Investigate:**
- Walk how a sentence becomes a 768-dim vector via a transformer encoder.
- Why are embedding models often smaller than generation models?
- What's the relationship between embedding model and downstream LLM quality?

### 2.2 Vector search via ANN

Exact nearest-neighbor search is `O(n)`. Approximate Nearest Neighbor (ANN) algorithms (HNSW, IVF, ScaNN) trade recall for sub-100ms latency at million-vector scale.

→ Pattern: `vector-search`: **DEEP target this phase**

**Investigate:**
- Walk HNSW: layers, search start point, greedy descent.
- Why is exact NN impractical above ~1M vectors?
- When does pgvector beat Milvus (one machine, <10M vectors)? When does Milvus beat pgvector (distributed, >50M)?

### 2.3 RAG architecture

Ingest pipeline: data → chunk → embed → store. Query pipeline: query → embed → retrieve top-k → format prompt → LLM. Each step has trade-offs.

→ Pattern: `rag-as-pattern`: **DEEP target this phase**

**Investigate:**
- Walk a RAG end-to-end. What's at each step?
- What's chunking strategy, and why does it dominate retrieval quality?
- When does pure-vector retrieval fail (specific entity lookup, exact keyword matching)?

### 2.4 Hybrid search

Pure vector retrieval misses cases where exact keywords matter. Hybrid combines vector + BM25 (keyword) + metadata filters; rerankers blend results.

**Investigate:**
- What's reciprocal rank fusion, and why is it the workhorse of hybrid?
- When does a reranker model on top of retrieval results earn its weight?
- Why does Postgres-native (pgvector + tsvector) often beat dedicated vector stores at moderate scale?

### 2.5 K8s-native vector store deployment

pgvector: an extension on top of CloudNativePG (Arc 3 Phase 20). Milvus: deployed via Milvus Operator (`Milvus` CRD). Both fit basecamp's K8s-native ecosystem.

→ Pattern: `operator-pattern` reinforced

**Investigate:**
- Walk Milvus Operator: declare `Milvus` CRD → operator creates etcd + MinIO + Milvus components.
- How does pgvector compose with CloudNativePG (same operator, just enable extension)?
- When do you reach for Milvus over pgvector? (Hint: >50M vectors, distributed sharding, GPU indexing.)

### 2.6 Retrieval evaluation

Retrieval quality drives generation quality. Eval recall@k, MRR, NDCG on a held-out query set.

→ Pattern: reinforces `evals` from Phase 41

**Investigate:**
- Walk recall@10: what does it measure?
- What's a "query / relevant doc" labeled set, and how do you curate one?
- Why is "RAG output looks good" not evidence retrieval is working?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Vector store | **pgvector** (small-mid scale); **Milvus Operator** (large scale); Qdrant; Weaviate | pgvector: simple, K8s-native via CloudNativePG. Milvus: scale, K8s-native operator. Qdrant/Weaviate: managed alternatives. |
| Embedding model | OpenAI text-embedding-3; Anthropic equivalents; open-weights (BGE, GTE, Nomic) | Closed: best quality, per-call cost. Open: free, runs on your GPU, quality varies. |
| ANN algorithm | HNSW; IVF; ScaNN | HNSW: modern default. IVF: smaller memory. ScaNN: Google-optimized. |
| Reranker | None (rely on retrieval); Cohere reranker; open-weights cross-encoder | None: cheapest. Cohere: best quality, paid. Cross-encoder: middle. |

---

## 4. TOOLS (as of 2026-06)

- **pgvector** (extension on CloudNativePG)
- **Milvus Operator** (`Milvus` CRD)
- **`sentence-transformers`**: embedding model library
- **BGE-M3**, **Nomic-Embed-v1.5**: open-weights embedding models in 2026

### Reading
- "Building LLM-Powered Applications" (Alammar et al.): RAG chapter
- The original HNSW paper (Malkov + Yashunin)
- pgvector docs + Milvus docs

---

## 5. MASTERY: Vector search + RAG on basecamp

```
[ ] pgvector enabled on a CloudNativePG cluster; create a vector table
[ ] Milvus Operator deployed via Flux; declare a Milvus CRD
[ ] Ingest chronicle into both stores; compare ANN performance
[ ] Build an embedding pipeline: read from Iceberg, embed with sentence-transformers, write to vector store
[ ] Implement HNSW indexing; benchmark recall@10 + latency
[ ] Add hybrid search (vector + Postgres tsvector); compare against vector-only
[ ] Add reciprocal rank fusion for hybrid scoring
[ ] Curate 50-query relevant-doc labeled set
[ ] Eval retrieval: recall@10, MRR, NDCG
[ ] Build a small RAG endpoint: query → retrieve → format → LLM call (use a small open model locally)
```

---

## 6. COMPARE: Qdrant or Weaviate

Deploy one as a parallel installation; cache the same vectors there. Compare ergonomics, query model, K8s integration.

400-word reflection.

---

## 7. OPERATE

- 3-4 runbooks: "Vector index rebuild", "Embedding model upgrade", "Retrieval quality regression", "Milvus disk pressure"
- 2 ADRs (pgvector for now, Milvus when >50M; embedding model choice; reranker choice)
- Weekly log

---

## 8. CONTRIBUTE

- pgvector: improvements
- Milvus (CNCF graduated): docs
- A retrieval eval set for `chronicle` (private; pattern is public)

---

## What ships from this phase

- **AI-tier entry on basecamp**: pgvector + Milvus + embedding pipelines + RAG endpoint
- **Vector store runbooks**

---

## Validation criteria

```
[ ] pgvector + Milvus both operational
[ ] Embedding pipeline ingesting chronicle
[ ] RAG endpoint serving queries
[ ] Hybrid search + reranker integrated
[ ] Retrieval eval set + metrics tracked
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 runbooks
[ ] 2 ADRs
[ ] Pattern entries:
    - vector-search → DEEP
    - embedding-store → OUTLINE
    - rag-as-pattern → DEEP
    - operator-pattern reinforced
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Add a new corpus (e.g., your weekly logs from the past year) to the vector store. Build an end-to-end RAG endpoint. Eval recall@10 on a 20-query labeled set.

### Part 2: Diagnose (60 min)
A retrieval scenario: recall@10 dropped from 0.85 to 0.40 after an embedding model upgrade. Possible: embedding dimensions changed; old embeddings still in store; reranker incompatible.

### Part 3: Articulate (30 min)
~600 words: *"Walk a RAG query end-to-end: user input → embedding → vector retrieval → reranking → LLM prompt construction → LLM call → response. Cite patterns at each step."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Pure-vector without hybrid | Misses exact entity lookups |
| Chunking that splits coherent ideas | Retrieval returns fragments; LLM hallucinates around them |
| No retrieval eval | "RAG output looks good" is not evidence |
| Using a massive embedding model when a smaller one suffices | Cost + latency for marginal quality |

---

## Patterns touched this phase

- `vector-search`: **DEEP**
- `embedding-store`: OUTLINE
- `rag-as-pattern`: **DEEP**
- `operator-pattern` reinforced

---

→ Next: [Phase 43: LLM Serving Deep](/program/arc-5/phase-43/)
