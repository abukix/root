---
title: "Testing Patterns"
description: "Phase 7 of /root Arc 1: unit, integration, property-based testing. Test pyramids, fakes vs mocks, test design that catches real bugs. Push sift and pulse to >80% coverage with meaningful tests."
tags: [arc-1, foundations, testing]
arc: 1
phase: 7
---

> Seventh phase of /root. Tests that catch real bugs.

There's a difference between *having tests* and *having tests that matter*. Most codebases have the first (any framework's `init` template adds a `test_example.py` or `example_test.go`). Senior engineers have the second: tests that catch real bugs, fail before production failures, and serve as living documentation of the code's contract. This phase teaches the difference.

By phase end, `sift` and `pulse` have proper test coverage (target >80%) with tests organized by the *test pyramid*: fast unit tests at the base, integration tests in the middle, end-to-end tests at the top. You've written property-based tests that catch edge cases hand-written tests miss. You know when to fake, when to mock, and when not to do either.

---

## Prerequisites

> - [Phase 6](/program/arc-1/phase-6/) complete; `sift` and `pulse` profiled
> - You accept: **tests aren't proof; they're evidence. The right tests give you confidence to change code without breaking it.**

---

## Why this phase exists

Most production failures fall into recognizable categories: edge cases the test suite didn't cover, integration boundaries where two systems disagreed, race conditions tests didn't exercise, regressions because there was no test for the original behavior. Each category has a *testing pattern* that addresses it, but most engineers don't reach for the right pattern until they've been burned by it.

This phase fronts that learning. You see the patterns before the production failures, and you build tests that catch real bugs in `sift` and `pulse`. The discipline transfers to every backend service you'll ever ship.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You wrote code. You think it works. How do you know? How does your reviewer know? How does production know? How does *future-you* know after you've changed something?

That's the testing problem. Tests are the mechanism by which code asserts its own correctness over time. Without them, every change is a gamble. With the right ones, changes are safe; bugs are caught early; the code documents its own contract.

---

## 2. PRINCIPLES

### 2.1 The test pyramid

Tests come in layers. The bottom layer (unit tests) is large, fast, narrow. The middle (integration tests) is moderate, slower, broader. The top (end-to-end tests) is small, slow, widest. The pyramid shape, many small fast tests, fewer large slow ones, is the practical optimum.

→ Pattern: `test-pyramid`

**Investigate:**
- Why does the pyramid shape (vs an inverted pyramid or a hexagon) work?
- What's wrong with relying mostly on E2E tests? (Slow, flaky, hard to localize failures.)
- What's wrong with relying *only* on unit tests? (Misses integration bugs, false confidence.)

### 2.2 Unit tests: testing single units in isolation

A unit test tests one function, method, or class in isolation from its dependencies. It should run in milliseconds, be deterministic, and pinpoint a failure to a specific location.

**Investigate:**
- What's a "unit"? Different schools answer differently (function-level vs class-level vs module-level).
- Why is "fast" a non-negotiable quality of unit tests? (Hint: developer feedback loop.)
- What makes a unit test brittle (testing implementation details) vs robust (testing behavior)?

### 2.3 Integration tests: testing real boundaries

Integration tests verify that two or more units work correctly together. They typically use real implementations (real database, real HTTP server) rather than fakes.

**Investigate:**
- When do you use a real Postgres in tests (testcontainers) vs an in-memory fake (SQLite)?
- Why is "test against the real thing" usually right for the database layer?
- What's the cost of integration tests, and when does the cost dominate?

### 2.4 End-to-end tests: testing the system as users see it

E2E tests exercise the full system through its real interfaces: HTTP API calls, CLI invocations, UI clicks. They're expensive but catch the bugs that only appear when all the layers interact.

**Investigate:**
- How many E2E tests is the right number? (Hint: small, single-digit-percent of total tests.)
- What's flakiness, and why are E2E tests prone to it?
- When does a failed E2E test point to a *test* problem vs an *integration* problem?

### 2.5 Property-based testing

Hand-written tests cover the cases you thought of. Property-based tests generate *random* inputs and verify that *properties* (invariants) hold. They find edge cases human testers miss: null inputs, empty strings, maximum integers, deeply nested structures.

→ Pattern: `property-based-testing`

**Investigate:**
- For `sift`'s regex matcher, what's an invariant that should hold for any input?
- What's "shrinking" in property-based testing, and why does it matter?
- When is property-based testing the wrong approach (when properties are hard to state)?

### 2.6 Fakes vs mocks vs stubs

Three confused-but-different testing primitives:
- **Fake**: a working but simplified implementation (e.g., in-memory database)
- **Mock**: an object that records calls and lets you assert on them
- **Stub**: a hardcoded response

Senior engineers prefer fakes when possible (they exercise the real interface) and reach for mocks only when verifying interaction is the point.

→ Pattern: `fakes-vs-mocks`

**Investigate:**
- Why are mocks often the wrong answer? (Hint: they couple tests to implementation.)
- When is a fake worth the implementation cost?
- What's "mock hell," and how does it happen?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Test framework | `pytest` (Python); `go test` (Go); language-specific defaults | All work; pytest is friendlier for complex fixtures; go test is more spartan |
| Property-based testing | `hypothesis` (Python); `gopter` or `rapid` (Go) | hypothesis: mature, shrinking, common. Go's options: less established but workable |
| Integration test database | Real DB via testcontainers; in-memory fake; fixtures | Real: highest confidence, slowest. Fake: fast, divergence risk. Fixtures: legacy, brittle |
| E2E test runner | None (skip); minimal CLI-based; full Selenium/Playwright | Skip: gambles on integration. CLI: works for CLI apps. Browser: full but flaky |
| Coverage target | Don't measure; >60%; >80%; 100% | Don't: blind. >60%: minimum. >80%: meaningful. 100%: diminishing returns + false confidence |

---

## 4. TOOLS (as of 2026-06)

### Python testing
- **`pytest`**: the standard
- **`hypothesis`**: property-based testing
- **`coverage.py`** + `pytest-cov`: coverage measurement
- **`pytest-asyncio`**: async test support
- **`testcontainers`**: spin up real Postgres/Redis in tests
- **`freezegun`**: time mocking

### Go testing
- **`go test`**: built-in
- **`testify`**: assertions + mocks (popular)
- **`gopter` or `rapid`**: property-based testing
- **`testcontainers-go`**: same idea as Python
- **`gomock` or `mockery`**: mock generation (use sparingly)

### Reading
- "Test-Driven Development" (Kent Beck): the foundational text
- "Working Effectively with Legacy Code" (Michael Feathers): testing untestable code
- "Property-Based Testing with PropEr, Erlang, and Elixir" (Hébert): the property-based bible (concepts transfer to Python/Go)
- "Growing Object-Oriented Software, Guided by Tests" (Freeman + Pryce): outside-in TDD

---

## 5. MASTERY: sift + pulse with proper test coverage

### 5.1 The deliverable

`sift` and `pulse` both with **>80% test coverage** organized along the pyramid:

- Many unit tests covering core logic
- Integration tests for the external boundaries (`sift` reads stdin; `pulse` makes HTTP calls)
- A small set of E2E tests exercising the full CLI behavior
- **At least one property-based test per project**, with a documented invariant

Each project's `tests/` directory should be well-organized: unit/, integration/, e2e/ (or equivalent). Coverage badge in the README.

### 5.2 Operational depth checklist

```
[ ] Configure pytest + coverage for sift; achieve >80% line coverage
[ ] Configure go test + coverage for pulse; achieve >80% coverage
[ ] Write at least one property-based test for sift using hypothesis
[ ] Write at least one property-based test for pulse using gopter or rapid
[ ] Use testcontainers (or equivalent) to spin up a real Postgres / Redis in one integration test (use this for Arc 2; this phase, taste it)
[ ] Write a deliberate fake for one external dependency in sift or pulse
[ ] Identify ONE test in sift or pulse that uses a mock; replace it with a fake; reflect on the difference
[ ] Set up CI to run tests + coverage on every push
[ ] Add a coverage badge to each README
[ ] Audit the existing tests for ones that test implementation details rather than behavior; refactor 2-3 of them
```

---

## 6. COMPARE: pytest vs go test

Write the same small test (e.g., "this function returns true for valid inputs and false for invalid") in both Python and Go. Reflect on the differences:
- Boilerplate
- Fixture patterns (pytest fixtures vs Go's `t.TempDir()`, table-driven tests)
- Assertion styles (pytest `assert` vs `t.Errorf`)
- Property-based testing in each ecosystem

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks: "Test the unhappy path," "Diagnose a flaky test," "When to mock vs fake"
- 1+ ADR (e.g., "Why we don't use mocks in /root projects" or "Why we use testcontainers for DB integration tests")
- Weekly log

---

## 8. CONTRIBUTE

- A property-based test added to an OSS project that lacks them
- A documentation improvement to a testing library
- A pull request that increases coverage in a project you use

---

## What ships from this phase

- **`sift` v0.4** with >80% test coverage and at least one property-based test
- **`pulse` v0.4** with >80% test coverage and at least one property-based test
- **Test runbooks** in `chronicle`
- **CI workflows** running tests + coverage on every push

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (pyramid, unit tests)
           Configure pytest for sift; write missing unit tests

Week 2     PRINCIPLES 2.3-2.4 (integration, E2E)
           Configure go test for pulse; write integration tests

Week 3     PRINCIPLES 2.5 (property-based)
           Write first property-based test for each project

Week 4     PRINCIPLES 2.6 (fakes vs mocks)
           Audit + refactor existing tests; >80% coverage target

Week 5     CI configuration; coverage badges
           chronicle runbooks

Week 6     COMPARE: pytest vs go test
           OPERATE + CONTRIBUTE

Week 7     Exit Test + buffer
```

---

## Validation criteria

```
[ ] sift + pulse both >80% test coverage
[ ] At least one property-based test per project
[ ] CI runs tests on every push; coverage badges in READMEs
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 runbooks
[ ] 1+ ADR
[ ] Pattern entries deepened STUB → OUTLINE:
    - test-pyramid
    - property-based-testing
    - fakes-vs-mocks
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Given a small library (provided), write a test suite covering it. Must include: unit tests for each function, integration tests for the public interface, at least one property-based test. Coverage target: >85%.

### Part 2: Diagnose (60 min)
Given a flaky test (provided, it fails ~20% of the time), identify the flakiness source and fix it. Possible sources: timing, ordering, shared state, network dependency.

### Part 3: Articulate (30 min)
~600 words: *"When would you reach for a property-based test vs a hand-written test? Walk through one example from sift where property-based testing caught an issue hand-written tests missed."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Targeting 100% coverage | Diminishing returns + false confidence. 80% with thoughtful tests > 100% with shallow ones. |
| Mocking everything | Tests get coupled to implementation. Prefer fakes; use mocks only when verifying interactions IS the test. |
| Skipping integration tests "because they're slow" | Integration bugs are the ones that bite hardest in production. |
| Letting flaky tests stay flaky | Either fix or delete. Flaky tests train you to ignore failures. |
| Writing tests after the code "to check the box" | Writing tests after often misses cases that writing tests before would catch. |

---

## Patterns touched this phase

- `test-pyramid`: first OUTLINE
- `property-based-testing`: first OUTLINE
- `fakes-vs-mocks`: first OUTLINE

---

→ Next: [Phase 8: Git, CI/CD Fundamentals & Release Engineering](/program/arc-1/phase-8/)
