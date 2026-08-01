---
title: "Performance, Profiling & Memory"
description: "Phase 6 of /root Arc 1: how code actually runs. Profilers, memory allocators, GC, cache effects, big-O in practice. Profile sift and pulse; identify and fix real hot paths."
tags: [arc-1, foundations, performance, profiling, memory]
arc: 1
phase: 6
---

> Sixth phase of /root. How code actually runs underneath.

Most engineers ship code that works. Senior engineers ship code that works *and* is fast enough. This phase installs the muscle that separates the two: profiling (finding the hot path), memory awareness (knowing what allocates and where), and the discipline of *measuring before optimizing*. By phase end you can profile a slow function in either Python or Go, identify the actual bottleneck, and articulate the fix in terms a reviewer can verify.

This phase doesn't ship new OSS. It *profiles* `sift` and `pulse` from earlier phases, identifies the actual bottlenecks, fixes them, and produces profiling reports as artifacts. The reports are themselves portfolio material: they're proof you can reason about performance from data, not from instinct.

---

## Prerequisites

> - [Phase 5](/program/arc-1/phase-5/) complete; `sift` and `pulse` refactored
> - Comfort reading flame graphs and basic profiler output
> - You accept: **performance intuition is mostly wrong. Measure first, optimize second, verify the optimization with measurement.**

---

## Why this phase exists

"Premature optimization is the root of all evil" is the most-misquoted line in engineering (Knuth's actual point was different). What it should mean: *don't optimize without data*. What it often gets used to mean: *don't think about performance ever*. Both are wrong.

Senior engineers think about performance *all the time*, but they back their decisions with measurement. They know which operations are cheap (hash lookup), which are expensive (linear scan over a large collection), which are surprising (allocation in a tight loop, regex compilation on every call). They reach for profilers as routinely as they reach for debuggers. This phase builds those reflexes.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

Your code is slow, or your code is fast and you want to know why, or your service is using more memory than expected. You need to find the actual bottleneck, fix it, and verify the fix. Without tooling, you guess; with tooling, you measure.

That's the performance problem. Profilers solve "where is the time spent." Heap dumps solve "what's holding memory." Tracing tools solve "what does a single request actually do across processes." Each tool answers a specific question; reaching for the wrong tool wastes hours.

---

## 2. PRINCIPLES

### 2.1 Measure first, optimize second

The most reliable performance engineering rule: don't optimize what you haven't measured. Intuition is wrong 80% of the time about what the bottleneck is. Profile, find the actual hot path, optimize that, verify.

→ Pattern: `profiling-as-practice`

**Investigate:**
- Why is the bottleneck almost never where you think it is?
- What's the cost of optimizing the wrong thing? (Both wasted effort and obscuring the real issue.)
- How do you know when a function is fast enough? (Hint: it depends on the SLO + the workload.)

### 2.2 Memory hierarchy and cache effects

CPUs are fast; memory is slow. The cache hierarchy (L1, L2, L3, RAM) determines whether an operation takes 1 nanosecond or 100 nanoseconds. Sequential access (cache-friendly) is dramatically faster than random access for large data. This is invisible to most code but shapes the performance of everything that processes a lot of data.

→ Pattern: `memory-allocation`

**Investigate:**
- What are the rough latency numbers for L1, L2, L3, RAM, SSD, network? (Memorize these; senior engineers cite them automatically.)
- Why is iterating a 1M-element array sequentially much faster than randomly jumping through it?
- What does "cache line" mean, and how does false sharing kill performance in concurrent code?

### 2.3 Allocation and garbage collection

Every memory allocation has a cost, small in absolute terms but cumulative. GC'd languages (Python, Go, JVM) periodically pause to reclaim memory, and high allocation rates make those pauses larger or more frequent.

**Investigate:**
- What does Python's reference counting + cycle collector actually do?
- How does Go's tri-color mark-and-sweep GC work? What's the cost?
- When does avoiding allocation matter (tight loops, hot paths) and when is it premature optimization?

### 2.4 Hot paths and cold paths

Most code runs occasionally; some code runs constantly. Performance work targets the *hot paths*: the inner loops, the request handlers, the per-message processing. Optimizing cold paths is wasted effort.

→ Pattern: `hot-paths-cold-paths`

**Investigate:**
- For `pulse`, what's the hot path? (Hint: the per-probe execution loop.)
- For `sift`, what's the hot path? (Hint: the regex evaluation per input line.)
- How does flame-graph reading let you see hot vs cold paths visually?

### 2.5 I/O bound vs CPU bound vs memory bound

Workloads come in three flavors. CPU-bound work scales with cores. I/O-bound work scales with concurrency (async, threading). Memory-bound work scales with bandwidth, not cores. Knowing which flavor your workload is determines the right scaling strategy.

**Investigate:**
- How do you tell from a profile whether something is CPU-bound or I/O-bound?
- Why does adding more threads help I/O-bound work but not CPU-bound work in Python?
- What does "memory bandwidth" mean, and when does it become the bottleneck?

### 2.6 Big-O as a guide, but only a guide

Phase 3 taught Big-O. This phase teaches when Big-O matters and when constant factors dominate. `O(n)` with a 1000× constant beats `O(n log n)` for n < 1000. Big-O guides architectural decisions; profiling decides tactical fixes.

**Investigate:**
- When does an `O(n²)` algorithm beat an `O(n log n)` algorithm in practice?
- Why do high-performance libraries (numpy, sqlite) sometimes use "worse" algorithms intentionally?
- How do you know when to care about complexity vs constants?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Optimization timing | Optimize now; optimize when slow; never optimize | Now: premature, often wrong. When slow: pragmatic. Never: technical debt. |
| Memory vs CPU | Cache results (memory ↑, CPU ↓); recompute (memory ↓, CPU ↑) | Trade-off depends on access pattern and memory pressure |
| Concurrency model | Async / event loop; threads; processes | Async: I/O-bound. Threads: shared state, GIL-limited in Python. Processes: true parallelism, IPC cost |
| Allocation strategy | Pool reuse; allocate-per-call | Pool: reduces GC, complex. Per-call: simple, GC pressure |

---

## 4. TOOLS (as of 2026-06)

### Python profiling
- **`cProfile` + `pstats`**: stdlib CPU profiler
- **`py-spy`**: sampling profiler that runs against a live process
- **`memray`**: memory profiler
- **`scalene`**: combined CPU + memory + GPU profiler
- **`line_profiler`**: line-by-line CPU profiling
- **`tracemalloc`**: built-in allocation tracking

### Go profiling
- **`pprof`**: built-in CPU, heap, goroutine, mutex profiling
- **`go test -bench`**: benchmarks
- **`benchstat`**: compare benchmark results
- **`flamegraph.pl`** or **speedscope**: flame graph visualization

### Reading
- "Systems Performance" (Brendan Gregg): the canonical reference
- "High-Performance Python" (Gorelick + Ozsvald)
- Brendan Gregg's blog and the FlameGraph repo
- The Go pprof docs

---

## 5. MASTERY: Profile and fix sift + pulse

### 5.1 The deliverable

Two profile reports, one for `sift`, one for `pulse`, plus the *fixes* that came from the profiling work. Each report should include:

- The workload that was profiled (a realistic input, not a microbenchmark)
- The profiler used and the flame graph
- The hot path identified
- The fix applied
- Before/after benchmarks proving the fix worked
- A short reflection on what was surprising

Volume: ~20-40 hours of profiling + fixing + writing. The result is portfolio material: these reports demonstrate you can do real performance engineering, not just talk about it.

### 5.2 Operational depth checklist

```
[ ] Profile sift with cProfile + py-spy on a realistic input
[ ] Generate a flame graph for sift; identify the top 3 functions by time
[ ] Profile pulse with go pprof on a realistic workload
[ ] Generate a flame graph for pulse; identify the top 3 functions by time
[ ] Fix at least one identified hot path in each project
[ ] Write before/after benchmarks proving the fix worked
[ ] Use memray (Python) to find an allocation hotspot in sift
[ ] Use go pprof -alloc_space to find an allocation hotspot in pulse
[ ] Read flame graph traces of a famous OSS project (e.g., the Go runtime) once; just to see scale
[ ] Memorize approximate latency numbers: L1 (~1ns), L2 (~3ns), L3 (~10ns), RAM (~100ns), SSD random (~50µs), datacenter network (~500µs), disk seek (~10ms)
```

---

## 6. COMPARE: Python vs Go on the same problem

Pick one of `sift`'s functions and reimplement in Go (or pick a `pulse` function and reimplement in Python). Benchmark both on the same input. What's the speed difference? More importantly: where does the difference come from? Allocation? Interpreter overhead? Concurrency model?

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks: "Diagnose a slow service with a profiler," "Find a memory leak in Python," "Find a goroutine leak in Go"
- 1+ ADR (e.g., "Why we tolerate sift's allocation rate" or "Why we switched pulse's metric backend after profiling showed X")
- Weekly log

---

## 8. CONTRIBUTE

- A profile-driven fix to any OSS project you use, bonus for one where the maintainer accepts it
- A documentation improvement to py-spy, memray, scalene, or pprof
- A clear benchmark + analysis post on your blog (Arc 2+) about a real performance fix

---

## What ships from this phase

- **`sift` profile report** + `sift` v0.3 with at least one performance fix
- **`pulse` profile report** + `pulse` v0.3 with at least one performance fix
- **Performance runbooks** in `chronicle`
- **Approximate latency numbers** memorized (you'll cite these for the rest of your career)

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (measure first, memory hierarchy)
           Profile sift with cProfile; first flame graph

Week 2     PRINCIPLES 2.3-2.4 (allocation, hot paths)
           Profile pulse with pprof; first flame graph

Week 3     Identify hot paths in both projects; design fixes

Week 4     Implement fixes; benchmark before/after

Week 5     PRINCIPLES 2.5-2.6 (workload types, complexity in practice)
           Write profile reports for sift + pulse

Week 6     COMPARE: cross-language reimplementation
           OPERATE + CONTRIBUTE

Week 7     Exit Test + buffer
```

---

## Validation criteria

```
[ ] sift profile report written + at least one fix applied + before/after benchmarks
[ ] pulse profile report written + at least one fix applied + before/after benchmarks
[ ] All 10 operational depth checks
[ ] Cross-language compare reflection (400 words)
[ ] 2-3 runbooks
[ ] 1+ ADR
[ ] Pattern entries deepened STUB → OUTLINE:
    - profiling-as-practice
    - memory-allocation
    - hot-paths-cold-paths
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Profile + Fix (120 min)
Given a small slow program (provided), profile it, identify the bottleneck, apply a fix, prove the fix works with before/after measurements. The program will have an obvious-but-not-easy bottleneck.

### Part 2: Articulate (60 min)
~1000 words: *"You're told the production service is slow. Walk through your investigation plan from receiving the report to identifying the bottleneck to recommending a fix. Cite the tools you'd use at each step and the data they'd produce."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Optimizing without measuring | The bottleneck is almost never where you think it is |
| Reading flame graphs without learning the conventions | You'll miss what's there. Spend 30 min learning the visualization. |
| Caching everything because "memory is cheap" | Cache invalidation is one of the two hard problems |
| Ignoring allocation in tight loops | A million tiny allocations IS the bottleneck sometimes |
| Treating "fast enough" as "fastest possible" | Senior engineers know when to stop optimizing |

---

## Patterns touched this phase

- `profiling-as-practice`: first OUTLINE
- `memory-allocation`: first OUTLINE
- `hot-paths-cold-paths`: first OUTLINE

---

→ Next: [Phase 7: Testing Patterns](/program/arc-1/phase-7/)
