---
title: "Programming Foundations II — Go"
description: "Phase 4 of /root Arc 1: Go fluency and concurrency. Basics, structs, interfaces, errors-as-values, goroutines, channels, context. Ship pulse v0.1 publicly as the fluency artifact."
tags: [arc-1, foundations, go, projects, concurrency]
arc: 1
phase: 4
---

> Fourth phase of /root. Go fluency and the concurrency model that runs cloud-native infra.

If Python is the lingua franca of ML and glue, Go is the lingua franca of cloud-native infrastructure. Kubernetes, Prometheus, etcd, containerd, ArgoCD, Terraform: all Go. Every later phase of /root reads Go source at some point. This phase makes that reading natural.

The bar is the same as Phase 2: *fluency, not mastery.* You won't be writing production-grade distributed systems in Go after eight weeks. You will be able to read any cloud-native tool's source, write a useful CLI or small service, and reason about goroutines + channels under load. That's enough to operate Years 2-5 with confidence. And you'll ship [`pulse`](/projects/pulse/plan/) publicly: your second OSS CLI.

---

## Prerequisites

> - [Phase 3](/program/arc-1/phase-3/) complete; DS&A practice in place
> - Go 1.22+ installed via your version manager
> - GitHub workflow comfortable from Phase 2's `sift` ship
> - You accept: **you are not learning Go the language. You are learning a tool category called "compiled, statically-typed systems language with first-class concurrency," with Go as one implementation.**

---

## Why this phase exists

Go's concurrency model, goroutines + channels, is its signature contribution. It also happens to be the *exact same conceptual model* (CSP, communicating sequential processes) that Erlang uses, that Rust's `tokio` adapts, and that any modern systems language has to wrestle with. Understanding goroutines + channels here pays interest in every later concurrent system you operate.

Go's other contributions matter too: small standard library, no runtime exceptions (errors as values), interfaces by structural typing, a brutally opinionated formatter. These are deliberate trade-offs that reduce the surface area you have to manage and make codebases unusually readable.

By phase end you can ship a real Go CLI, reason about a goroutine leak, and read the Kubernetes source without flinching.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You want a language that:
- Compiles to a single static binary (no runtime, no dep hell at deploy time)
- Has first-class concurrency (you don't reach for an event loop library)
- Is fast enough that you don't care about it (within 2× of C for most workloads)
- Has a standard library that covers HTTP, JSON, crypto, file I/O without third-party deps
- Forces enough consistency that any Go codebase is recognizable to any Go reader

That's the niche Go fills. Rust fills it differently (no GC, more safety, steeper curve). Zig fills it differently (no hidden control flow, manual memory). Java fills it differently (JVM, ecosystem, weight). Go is the *operator's language*, designed to be cheap to write, fast to ship, easy to read in five years.

---

## 2. PRINCIPLES

### 2.1 Goroutines

A goroutine is a function that runs concurrently with other goroutines on a small set of OS threads multiplexed by the Go runtime. They're cheap (KB of stack, not MB). You spawn thousands without thinking.

→ Pattern: `csp-concurrency`

**Investigate:**
- What does the Go runtime scheduler do that the OS scheduler doesn't?
- How does a goroutine's stack grow?
- When do you have a goroutine leak, and how do you find it (`pprof`)?

### 2.2 Channels

A channel is a typed, synchronization-bearing queue between goroutines. Buffered channels add capacity; unbuffered channels are rendezvous points.

**Investigate:**
- Why does sending on a nil channel block forever? Why does closing a channel matter for receivers?
- What's the difference between `select` with a `default` case (non-blocking) and without?
- When are channels the wrong primitive, and a `sync.Mutex` is right?

### 2.3 Context propagation

The `context.Context` carries cancellation, deadlines, and request-scoped values across goroutine boundaries. Every goroutine that does meaningful work should respect a Context.

**Investigate:**
- What's the difference between `context.WithCancel`, `context.WithTimeout`, `context.WithDeadline`?
- Why is "first parameter is `ctx context.Context`" a near-universal Go convention?
- What happens when you don't propagate Context? What does a leaked goroutine look like?

### 2.4 Errors as values

No exceptions. Errors are return values, checked explicitly. `errors.Is` and `errors.As` give you typed checking.

→ Pattern: `errors-as-values`

**Investigate:**
- What's the difference between wrapping with `fmt.Errorf("... %w", err)` and creating a new error?
- When is `errors.Join` the right call?
- Why does Go avoid panic for normal control flow, and when is panic actually right?

### 2.5 Interfaces by structural typing

A type satisfies an interface if it has the methods. No explicit declaration. This is the opposite of Java/C# nominal interfaces.

→ Pattern: `structural-typing`

**Investigate:**
- Why does `io.Reader` having one method (`Read([]byte) (int, error)`) compose so well?
- When do you accept an interface vs a concrete type?
- What's the standard library's design pattern around interfaces (smallest possible surface)?

### 2.6 The Go memory model and concurrent safety

Go has a defined memory model (revised 2022). Race detection is built in (`go test -race`). Goroutines communicating only through channels are safe by construction; shared mutable state needs explicit synchronization.

**Investigate:**
- What does the race detector actually catch?
- When is a `sync.Mutex` the right choice over a channel?
- What's `sync.Once`, and where does it fit (lazy initialization, singletons)?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Concurrency primitive | Channels; `sync.Mutex`; `sync/atomic` | Channels: clear, slower. Mutex: fast, easier to misuse. Atomic: fastest, hardest to reason. |
| HTTP framework | stdlib `net/http`; `chi`; `gin`; `echo` | stdlib: enough for most things. chi: minimal extras. gin/echo: middleware-rich. |
| CLI framework | `cobra`; `urfave/cli`; stdlib `flag` | cobra: ubiquitous, generates docs. urfave/cli: simpler. flag: minimal. |
| Logging | `slog` (stdlib 1.21+); `zap`; `zerolog` | slog: stdlib, structured, current default. zap: faster. zerolog: opinionated. |
| Build/release | `go build`; `goreleaser`; `ko` | go build: simple. goreleaser: cross-platform binaries, standard for OSS Go projects. ko: container-native. |

---

## 4. TOOLS (as of 2026-06)

### Standard
- **`go test`, `go vet`, `go build`**: built in
- **`golangci-lint`**: meta-linter
- **`gopls`**: language server

### Frameworks (for `pulse`)
- **`cobra`**: CLI (the standard for cloud-native tools)
- **`slog`**: structured logging
- **`prometheus/client_golang`**: metrics for `pulse`
- **`goreleaser`**: cross-platform binary releases

### Reading
- "100 Go Mistakes and How to Avoid Them" (Harsanyi): operational pitfalls
- "Concurrency in Go" (Cox-Buday): channels + patterns
- The Go standard library source: it's readable, and reading it is its own education
- Go memory model spec (short, precise)

---

## 5. MASTERY: Ship `pulse`

### 5.1 What pulse is

[`pulse`](/projects/pulse/plan/) is a probe scanner that periodically pings TCP / HTTP / DNS endpoints and emits Prometheus metrics. The shipping bar:

- Public GitHub repo with README, LICENSE, CI
- Tests with `go test`, coverage > 60% (you'll push higher in Phase 7)
- Lint-clean with `golangci-lint`
- Cross-platform binaries via `goreleaser`
- Prometheus metrics exposed on `/metrics`
- A small Grafana dashboard JSON in the repo (used in Arc 3 when basecamp's Prometheus scrapes pulse)

Volume: ~500-1000 lines of Go. Time: ~30-45 hours, weeks 4-8 of the phase.

### 5.2 The Go sequence

1. **Basics**: types, structs, slices, maps, control flow, packages
2. **Functions & methods**: value vs pointer receivers, multiple return values
3. **Interfaces**: structural typing, common patterns (`io.Reader`, `Stringer`)
4. **Errors**: error values, wrapping, `errors.Is/As`
5. **Goroutines & channels**: spawn, select, buffered vs unbuffered
6. **Context**: propagation, cancellation, timeouts
7. **Standard library**: `net/http`, `encoding/json`, `os`, `time`
8. **Tooling**: `go test`, `go vet`, race detector, pprof

### 5.3 Operational depth checklist

```
[ ] Profile a goroutine leak with pprof; identify and fix
[ ] Write a small program that sends to an unbuffered channel without a receiver; observe deadlock
[ ] Implement a worker pool with bounded concurrency using channels
[ ] Implement the same pool with errgroup.Group; compare
[ ] Add Prometheus metrics to pulse: counter, gauge, histogram
[ ] Use context.WithTimeout to bound HTTP calls; observe what happens when timeout fires
[ ] Implement a basic circuit breaker in 50 lines
[ ] Use `slog` for structured logging end to end; emit JSON, parse with jq
[ ] Run `go test -race` and fix any data races found
```

---

## 6. COMPARE: Translate sift's regex slice to Go

Take a small slice of `sift` (e.g., the regex-match-on-stdin loop) and reimplement it in Go. Same behavior, different language. What's idiomatic in Go that wasn't in Python? What's clumsy in Go that was elegant in Python? Where does Go's generics (post-1.18) bite?

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks in `chronicle/runbooks/go/` (binary deploy, version upgrade, goroutine leak diagnosis)
- 1+ ADR (e.g., "Why `slog` over `zap` for /root's services")
- Weekly log

---

## 8. CONTRIBUTE

- `cobra`: typo fixes, small features, examples
- `prometheus/client_golang`: docs
- `slog` examples in the Go blog corpus
- A small bug fix to any Go OSS tool you use

---

## What ships from this phase

- **[`pulse`](/projects/pulse/plan/) v0.1**: public on GitHub with GoReleaser binaries
- **`chronicle`** seeded with Go runbooks
- **Go fluency** at the *can-ship-a-real-CLI-with-cross-platform-binaries* level

---

## Learning loop cadence

```
Weeks 1-2     PROBLEM + PRINCIPLES 2.1-2.2 (goroutines, channels)
              Go sequence: basics + functions + methods

Weeks 3-4     PRINCIPLES 2.3-2.4 (context, errors-as-values)
              Go sequence: interfaces + errors + goroutines
              pulse design + first commit

Weeks 5-6     PRINCIPLES 2.5-2.6 (structural typing, memory model)
              Go sequence: context + stdlib + tooling
              pulse working; Prometheus metrics emitted

Weeks 7-8     Ship pulse v0.1 (GitHub + GoReleaser + ≥1 external user)
              chronicle runbooks
              COMPARE: sift regex slice in Go
              Exit Test
```

---

## Validation criteria

```
[ ] pulse v0.1 shipped (GitHub + GoReleaser binaries + Prometheus metrics + ≥1 external user)
[ ] All 9 operational depth checks
[ ] Compare reflection written (400 words)
[ ] 2-3 Go runbooks in chronicle
[ ] 1+ ADR
[ ] Pattern entries deepened STUB → OUTLINE:
    - csp-concurrency
    - errors-as-values
    - structural-typing
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Write a small Go service that consumes a list of URLs on stdin, fetches each with bounded concurrency (configurable, default 10), and emits structured JSON results on stdout. Must handle timeouts, propagate context, and not leak goroutines under any input.

### Part 2: Articulate (90 min)
~1200 words: *"Walk through what happens when 1000 goroutines all try to send on a buffered channel of capacity 10 while a single consumer reads slowly. Cover the runtime scheduler, blocking semantics, garbage collection of blocked goroutines, and how `context.WithTimeout` would change the picture."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Spawning goroutines without a way to wait or cancel | This is how you leak. Every goroutine needs a stop condition. |
| Reaching for channels when a mutex would be 5 lines | "Don't communicate by sharing memory; share memory by communicating" is a *guideline*, not a law. |
| Ignoring errors with `_` | Errors are the primary failure signaling. Read them. Wrap them. Surface them. |
| Trying to make Go's type system do Java things | It can't, and shouldn't. Embrace structural interfaces. |
| Skipping `go test -race` | Race conditions are invisible until production. The race detector is free. Run it. |

---

## Patterns touched this phase

- `csp-concurrency`: first OUTLINE
- `errors-as-values`: first OUTLINE
- `structural-typing`: first OUTLINE

---

→ Next: [Phase 5: Software Architecture Patterns](/program/arc-1/phase-5/)
