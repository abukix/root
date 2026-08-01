---
title: "Software Architecture Patterns"
description: "Phase 5 of /root Arc 1: DDD, clean architecture, hexagonal, repository pattern. The patterns that survive the framework churn. Refactor sift and pulse to apply at least one pattern deliberately."
tags: [arc-1, foundations, architecture]
arc: 1
phase: 5
---

> Fifth phase of /root. Where code stops being syntax and starts being decisions.

Phases 2-4 made you fluent in Python and Go. This phase makes you *thoughtful* about how to organize code in either language. The four patterns this phase teaches: Domain-Driven Design, Clean Architecture, Hexagonal Architecture (Ports and Adapters), and the Repository Pattern, are the load-bearing ideas that survive the JavaScript/Python/Java/Go framework churn. Every senior backend engineer can argue trade-offs across them; every modern framework either embraces them or fights them.

This phase doesn't ship new OSS. It *refactors* `sift` (Phase 2) and `pulse` (Phase 4) to apply at least one of the patterns deliberately. The act of refactoring code you've already written into a recognized pattern is the move that converts "I read the architecture books" into "I can apply the patterns." Without that conversion, the patterns stay decorative; with it, they become tools you reach for naturally.

---

## Prerequisites

> - [Phase 4](/program/arc-1/phase-4/) complete; both `sift` and `pulse` shipped
> - The four canonical books on hand or queued: Eric Evans' "Domain-Driven Design," Robert Martin's "Clean Architecture," Vaughn Vernon's "Implementing Domain-Driven Design," and Martin Fowler's "Patterns of Enterprise Application Architecture"
> - You accept: **you are not learning a tool called DDD. You are learning a category called "principles for organizing code at scale," with DDD/clean/hexagonal as four implementations.**

---

## Why this phase exists

Most engineers learn architecture by absorbing whichever pattern the framework they use enforces. Django teaches MVC + the active-record ORM pattern. FastAPI teaches dependency injection + Pydantic models. Spring teaches IoC containers. Each framework's defaults are a *snapshot* of one architectural pattern, often poorly explained, often missing the principles underneath.

Senior engineers reason about architecture *across* frameworks. They recognize when a framework is fighting them, when a pattern fits or doesn't, when a "this is just how Django does it" answer is hiding a real design choice. This phase installs that recognition by teaching the four patterns at the *principle* level, then applying them to real code (`sift` and `pulse`) you already wrote without the patterns in mind.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You're writing software that's bigger than one file. The code has multiple responsibilities: user input, business logic, persistence, external APIs, presentation. Without organization, those concerns tangle: a "user signup" function ends up calling the database, validating input, sending an email, and rendering a template, all in one place. The code is hard to test, hard to change, and hard to reason about.

That's the architecture problem. The patterns ask: *how do we organize a non-trivial codebase so that each piece does one thing, the dependencies flow in one direction, and the business logic is independent of the technical infrastructure?*

DDD, Clean Architecture, and Hexagonal all answer this question, slightly differently. The Repository pattern is a specific tactical technique used by all three. The four together form the *recognizable architectural vocabulary* of senior backend engineering.

---

## 2. PRINCIPLES

### 2.1 Domain-Driven Design (DDD)

Eric Evans' insight: the most important concepts in your codebase are the *domain concepts*, User, Order, Account, Subscription. The code should model the domain first; everything else (frameworks, databases, UI) is infrastructure around it. The *ubiquitous language* (the vocabulary your domain experts use) should appear directly in your code.

→ Pattern: `domain-driven-design`

**Investigate:**
- What's a "bounded context," and why is it the most important DDD concept?
- What's the difference between an entity and a value object?
- Why is "anemic domain model" considered an anti-pattern?

### 2.2 Clean Architecture

Robert Martin's insight: dependencies should flow inward. Business rules (the "use cases" or "interactors") sit at the center. Frameworks, databases, and UI sit at the edge. Source code dependencies point from edges *toward* the center. This makes the business rules testable in isolation and replaceable when the framework changes.

→ Pattern: `clean-architecture`

**Investigate:**
- Walk the four layers: Entities → Use Cases → Interface Adapters → Frameworks & Drivers. Why does each exist?
- What's the dependency rule, and what does it prevent?
- Why is "the database is a detail" Robert Martin's most-quoted line?

### 2.3 Hexagonal Architecture (Ports and Adapters)

Alistair Cockburn's insight: your application sits in the middle, surrounded by *ports* (the interfaces it needs) and *adapters* (the implementations of those interfaces). Your business logic talks to ports; adapters connect ports to the outside world. Swap the adapter, swap the database. Same idea as Clean Architecture, slightly different vocabulary, often interchangeable in practice.

→ Pattern: `hexagonal-and-ports-and-adapters`

**Investigate:**
- What's a "driven port" vs a "driving port"?
- Why is hexagonal architecture especially compatible with testing (fake adapters in tests, real adapters in production)?
- When does hexagonal collapse into clean architecture, and where do they differ?

### 2.4 Repository Pattern

Martin Fowler's tactical pattern (from PoEAA): hide your persistence behind a `Repository` interface. The repository's job is to give you domain objects in and out; the *how* (SQL, REST, file system) is hidden. Your domain code talks to `OrderRepository.findById(id)`, not `db.execute("SELECT * FROM orders WHERE id = ?")`.

→ Pattern: `repository-pattern`

**Investigate:**
- What's the difference between a Repository and a DAO (Data Access Object)?
- When does the repository pattern hurt (over-abstraction, leaky generic interfaces)?
- How does the repository pattern compose with hexagonal architecture's ports?

### 2.5 The shared idea: dependency inversion

All four patterns rely on dependency inversion (the D in SOLID). High-level modules don't depend on low-level modules; both depend on abstractions. This is what makes business logic testable, framework-independent, and resistant to "we have to change our database next quarter" panic.

**Investigate:**
- What's the difference between dependency *inversion* (an architectural principle) and dependency *injection* (a technique)?
- How does dependency inversion show up in Go (interfaces + injection through function parameters) vs Python (Protocol classes + framework DI)?
- What's the cost of dependency inversion when overdone? (Hint: indirection, harder navigation.)

### 2.6 When NOT to apply these patterns

Architecture patterns are tools, not religion. Small scripts, tiny CLIs, one-off automations: applying clean architecture to a 200-line script is over-engineering. Senior engineers know when to *not* reach for these patterns.

**Investigate:**
- Where does `sift` (a 500-line regex CLI) benefit from architecture patterns vs where would applying them be ceremony?
- What's the "rule of three" in pattern application (apply when you've solved a problem three times)?
- Why do good architects start with the simplest organization and only add patterns as complexity demands?

---

## 3. TRADE-OFFS

| Pattern | When it shines | When it overkill |
|---|---|---|
| DDD | Large, complex domains (finance, healthcare, e-commerce) | Simple CRUD apps; the ubiquitous language is "users have items" |
| Clean Architecture | Long-lived projects where the framework will change | One-off scripts; throwaway code |
| Hexagonal | Anything that needs deep testability + framework independence | A 200-line CLI |
| Repository | When persistence might change (SQL → NoSQL → API) | When persistence is fixed and stable |
| All four | Backend services with non-trivial business logic | Glue scripts, simple data transforms, infrastructure tools |

---

## 4. TOOLS (as of 2026-06)

### Reading (the canonical books)
- "Domain-Driven Design" (Eric Evans, 2003): the original DDD book
- "Implementing Domain-Driven Design" (Vaughn Vernon): more practical companion to Evans
- "Clean Architecture" (Robert Martin, 2017): clean architecture canonical text
- "Patterns of Enterprise Application Architecture" (Martin Fowler): repository, unit-of-work, more
- "Hexagonal Architecture": Alistair Cockburn's original article (free online)
- "Get Your Hands Dirty on Clean Architecture" (Tom Hombergs): practical worked example

### Language-specific resources
- **Python**: structuring projects with these patterns, see "Architecture Patterns with Python" (Percival + Gregory, free online)
- **Go**: the Go community is allergic to over-architecting, which can either help (less ceremony) or hurt (less explicit structure). Read the source of well-organized Go projects like `kubernetes/kubernetes`, `containerd/containerd`, `coredns/coredns`.

---

## 5. MASTERY: Refactor sift and pulse

### 5.1 The deliverable

Refactor `sift` and `pulse` to apply **at least one architecture pattern deliberately**, with a written rationale in each repo's `ARCHITECTURE.md` document.

The refactor doesn't have to be heavy. The goal is to recognize where the pattern fits and where it doesn't, then apply it where it earns its weight.

Suggested directions:

**For `sift`** (Python regex CLI):
- Apply hexagonal: separate the regex-matching core (domain) from the I/O (stdin/stdout adapters)
- Add a `MatcherPort` interface; implement it for `re` (Python stdlib) and `regex` (third-party) so swapping engines is trivial
- Write fake adapters for tests; real adapters for production

**For `pulse`** (Go probe scanner):
- Apply clean architecture: separate probe definitions (entities) from probe execution (use cases) from output emission (adapters)
- Add a `MetricsEmitter` interface; implement for Prometheus, stdout, and a fake (for tests)
- Make the probe scheduler independently testable by injecting a clock interface

Each refactor should produce a meaningful `ARCHITECTURE.md` explaining the choice and trade-offs. That doc is itself a portfolio artifact.

### 5.2 Operational depth checklist

```
[ ] Read DDD Ch 1-4, Clean Architecture Ch 15-22, Cockburn's Hexagonal article
[ ] For sift: draw the current architecture (current code organization); draw the target architecture
[ ] Refactor sift's hexagonal slice; ensure tests pass
[ ] Add a fake adapter in sift's tests; verify the test of the core logic doesn't depend on real regex implementation choices
[ ] For pulse: same exercise: diagram current + target, refactor, fake adapter for tests
[ ] Write sift/ARCHITECTURE.md explaining the design choices
[ ] Write pulse/ARCHITECTURE.md explaining the design choices
[ ] Identify ONE place where applying a pattern would be over-engineering; document the choice not to apply it
```

---

## 6. COMPARE: Read a well-architected OSS project

Pick a backend project known for clean architecture (e.g., `nestjs/typescript-starter`, `cosmtrek/air` in Go, or a serious Python project like `tiangolo/full-stack-fastapi-template`). Read its source for a couple of evenings. How does it organize itself?

400-word reflection on what's clearer in the well-architected codebase vs what feels like ceremony.

---

## 7. OPERATE

- 1-2 architecture decision records (ADRs) for `sift` and `pulse`; these are the inflection points where you made a trade-off
- 1 runbook: "How to add a new adapter to sift" (or pulse)
- Weekly log

---

## 8. CONTRIBUTE

- A clarifying example to an architecture-pattern docs corpus (e.g., the Architecture Patterns with Python book's examples repo)
- An issue or small PR to an OSS project where you identified an architecture issue

---

## What ships from this phase

- **`sift` v0.2** with hexagonal architecture + `ARCHITECTURE.md`
- **`pulse` v0.2** with clean architecture + `ARCHITECTURE.md`
- **`chronicle`** with architecture ADRs
- **Architectural vocabulary**: DDD, clean, hexagonal, repository, at the OUTLINE pattern depth

---

## Learning loop cadence

```
Week 1-2   PROBLEM + PRINCIPLES 2.1 (DDD)
           Read Evans Ch 1-4

Week 3     PRINCIPLES 2.2-2.3 (clean + hexagonal)
           Read Martin Ch 15-22; Cockburn's article

Week 4     PRINCIPLES 2.4-2.5 (repository + dependency inversion)
           Read Fowler PoEAA: Repository, Unit of Work

Week 5-6   Refactor sift + pulse; write ARCHITECTURE.md for each

Week 7     PRINCIPLES 2.6 (when NOT to apply)
           Compare reflection; OPERATE + CONTRIBUTE

Week 8     Exit Test + buffer
```

---

## Validation criteria

```
[ ] sift v0.2 refactored with deliberate architecture; ARCHITECTURE.md written
[ ] pulse v0.2 refactored with deliberate architecture; ARCHITECTURE.md written
[ ] All 8 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2 ADRs (one per project)
[ ] 1 runbook
[ ] Pattern entries deepened STUB → OUTLINE:
    - domain-driven-design
    - clean-architecture
    - hexagonal-and-ports-and-adapters
    - repository-pattern
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Design (90 min)
Given a small spec ("a CLI that fetches data from N HTTP APIs in parallel, aggregates results, and writes to one of: stdout, a file, a Postgres table"), produce a one-page architecture diagram showing which pattern you'd apply and why. Bonus: write the package layout for Go *or* the directory layout for Python.

### Part 2: Articulate (90 min)
~1200 words: *"You join a team using FastAPI for backend services. The codebase has no architectural pattern applied: endpoints call ORM models directly, business logic is in the views. You're asked to propose an architectural refactor. Walk through which pattern you'd advocate, why, and the migration path. Cite the trade-offs you're accepting."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Applying clean architecture to a 200-line script | Ceremony without payoff. The patterns exist for non-trivial codebases. |
| Confusing pattern names without learning the principles | "We use clean architecture" without dependency inversion is theater. |
| Treating the four patterns as competing | They overlap heavily. Pick the vocabulary that fits your team and codebase. |
| Forcing DDD on simple CRUD | DDD's value is at the *domain modeling* layer. If your domain is "users have items," DDD is overkill. |
| Skipping the refactor "because sift is fine" | The point isn't the refactor's outcome; it's recognizing the patterns in code you wrote. |

---

## Patterns touched this phase

- `domain-driven-design`: first OUTLINE
- `clean-architecture`: first OUTLINE
- `hexagonal-and-ports-and-adapters`: first OUTLINE
- `repository-pattern`: first OUTLINE

---

→ Next: [Phase 6: Performance, Profiling & Memory](/program/arc-1/phase-6/)
