---
title: "Arc 1 Final Exam"
description: "The graduation gate for Arc 1 of /root. Scenario-based. Three parts: Build, Debug, Articulate. Tests foundational software engineering competence — Linux, Python, Go, DSA, architecture, performance, testing, Git/CI/CD. Prove you can ship as a junior software engineer."
tags: [arc-1, final-exam, graduation]
arc: 1
---

> The graduation gate for Arc 1.
> Scenario-based. Three parts.
> Take it ~2 weeks after Phase 8 ends. Not before.

The Arc 1 Final Exam is not a memory test. It's a competence test. By the time you sit it, you've spent ~12 months operating Linux, shipping two CLIs, refactoring them with deliberate architecture, profiling them, hardening them with tests, and release-engineering them to v1.0.0. The exam asks whether you can *use* all of that under pressure on a scenario you haven't seen.

The bar for passing is the bar for the **Junior Software Engineer** exit ramp: ship a working CLI end-to-end with the hygiene of a professional engineering team, debug any layer of your own stack from first principles, and articulate the design decisions in clear technical prose.

---

## Ship gates (verify before sitting the exam)

You don't sit the exam until all ship gates are met. Passing the exam means nothing if the artifacts behind it don't exist.

```
[ ] sift v1.0.0 released on PyPI with automated pipeline
[ ] pulse v1.0.0 released with GoReleaser binaries
[ ] Both projects: >80% test coverage; CI green; pre-commit operational
[ ] Both projects: ARCHITECTURE.md written + Profile report written
[ ] Hardened Linux dev environment (dotfiles repo public)
[ ] DS&A practice repo with 20-30 solved problems
[ ] First merged upstream PR (any project, anywhere)
[ ] chronicle with ~25-30 runbooks across Linux/Python/Go/architecture/perf/testing/release
[ ] All 8 phase Exit Tests passed
[ ] ~18-20 Pattern Library entries at OUTLINE
```

If any ship gate is missing, finish it before sitting the exam. The work is the point, not the date on the calendar.

---

## Exam shape

**Total time:** 6 hours, taken in one sitting.
**Mode:** self-administered, or AI-administered if you have an exam-runner workflow set up.
**Workspace:** your dev environment. Both languages installed. GitHub access. PyPI account.
**Resources allowed:** man pages, official docs (Python, Go, your tools), your chronicle, your project READMEs, your weekly logs. Not allowed: web search beyond official docs, AI coding assistance for the Build section, asking another engineer.

Three parts:

| Part | Time | Focus |
|---|---|---|
| **Build** | 150 min | Ship a small new CLI end-to-end |
| **Debug** | 150 min | Three parallel scenarios from Phase exam catalogs |
| **Articulate** | 60 min | ~1500 words: deep walkthrough |

Take a 30-minute break between parts. Eat. Walk. Don't compress.

---

## Part 1: Build (150 min)

**The task:** ship a new small CLI from scratch with the hygiene of `sift` or `pulse`.

**The spec** (pick Python *or* Go, your strongest language):

> Build a CLI called `jq-lite` that:
> - Reads JSON-Lines on stdin
> - Filters records by a simple expression (e.g., `field == "value"`, `field > 5`, `field in [a, b]`)
> - Optionally extracts specific fields (`-o name,age`)
> - Emits JSON-Lines (or pretty JSON with `-p`) on stdout
> - Handles errors gracefully (malformed input → error to stderr, continue with next line)

**What you must produce:**

- Public GitHub repo with README, LICENSE
- Tests with >70% coverage including at least one property-based test
- Type-checked (mypy for Python, `go vet` + golangci-lint for Go)
- Pre-commit hooks operational
- CI workflow on push: lint + test + build
- Semantic versioning + conventional commits
- Release-please (or GoReleaser) configured; cut v0.1.0 by end of the part
- Clean ARCHITECTURE.md explaining the structure
- Profile + benchmark showing rough performance characteristics

**Pass bar:**
- After 150 minutes, `jq-lite v0.1.0` is publicly released
- CI is green
- A reviewer can clone, install, and use the tool by following the README
- Tests catch a deliberately introduced bug (the exam administrator inserts one; you verify your tests catch it)

**Anti-pattern checks (auto-fail if observed):**
- Used AI to write the code
- No tests, or tests that don't actually test the code
- No CI configured
- Committed directly to main without PR

---

## Part 2: Debug (150 min)

Three scenarios run in parallel. Each samples from a phase's catalog.

For each scenario: identify the root cause, write a runbook entry covering the diagnosis path, apply the fix if safe.

### Catalog seeds (illustrative; actual exam scenarios are picked at exam time)

**Phase 2 (Python) examples:**
- *"This Python script hangs on a list of 10,000 URLs."* (Possible: serial requests without async; misconfigured `httpx.Timeout`; deadlock in async code.)
- *"This pytest suite passes locally but fails in CI."* (Possible: time-dependent test; depends on local env var; race condition in fixtures.)
- *"This Python service uses 500MB of RAM for a 10MB input."* (Possible: accidentally reading whole file; unbounded list growth; cyclic reference holding objects.)

**Phase 4 (Go) examples:**
- *"This Go service has 10,000 goroutines and growing; CPU is fine but RAM is increasing."* (Possible: goroutine leak from missing Context propagation or unclosed channel.)
- *"This `go test -race` is reporting a data race in a passing test."* (Possible: shared map without mutex; closure capturing loop variable.)
- *"This Go binary is 80MB; the source is 800 lines."* (Possible: debug symbols; no `-ldflags="-s -w"`; vendored dependencies.)

**Phase 6 (Performance) examples:**
- *"This Python function takes 5 seconds on 100K inputs; the profile shows 90% time in `re.match`."* (Possible: regex compiled inside the hot loop; non-anchored regex causing backtracking.)
- *"This Go HTTP handler allocates 1MB per request."* (Possible: JSON unmarshaling into a struct that should be streamed; slice creation in hot path.)
- *"This program runs fine on 1M rows but OOMs on 10M."* (Possible: O(n²) algorithm; loading entire dataset into memory.)

**Phase 8 (Release) examples:**
- *"This GitHub Actions release pipeline failed; PyPI says 403 Forbidden."* (Possible: trusted-publishing config drift; OIDC scope wrong.)
- *"GoReleaser is publishing v0.1.0 instead of v0.2.0 despite the commit being a `feat:` change."* (Possible: release-please not running first; tag conflict; conventional-commit parsing issue.)
- *"CI is green on main but the latest release binary segfaults."* (Possible: CI tests don't exercise the released binary; release build differs from test build.)

**Pass bar per scenario:**
- Correct root cause identified (or correct narrowing if root cause is genuinely ambiguous)
- Runbook entry written and added to chronicle
- Patterns cited (profiling, goroutine-leaks, release-engineering, etc.)

---

## Part 3: Articulate (60 min)

The articulation part is the proof that the pattern layer landed. It is graded most strictly.

**Prompt:** *"Walk a Python HTTP request from `httpx.get(url)` to the bytes on the wire. Start from the moment the user calls the function; end with the bytes being sent on the network socket. Cover the HTTP framing, the TCP socket creation, the SSL handshake (where does it happen in Python?), the DNS resolution, and the memory/allocation cost throughout. Then explain how `async with httpx.AsyncClient() as client` changes the picture and when the async version pays. ~1500 words."*

**What a strong answer covers (in any order, with pattern citations):**

- The Python function call stack into httpx → urllib3 → socket
- DNS resolution: `gethostbyname` or async-equivalent; happens once per hostname unless cached
- TCP three-way handshake at the socket level
- TLS handshake (cert chain, key exchange, ALPN negotiation)
- HTTP framing (HTTP/1.1 vs HTTP/2 if relevant)
- Connection pooling: when does httpx reuse a connection?
- Memory: where allocations happen (response body buffering, header parsing)
- The async story: what `async with` actually does; how the event loop coordinates concurrent requests; when async wins vs threading vs multiprocessing

**Pass bar:**
- ~1500 words, organized prose, no bullet-list dodging
- At least 5 patterns cited correctly and connected to the step they apply at (interpreted-runtime, packaging, csp-concurrency or async, hot-paths-cold-paths, memory-allocation, etc.)
- No factual errors at the protocol/syscall level: claims like "TCP does X" must be verifiable
- Reads like an engineer explaining to a peer, not a textbook chapter

---

## Scoring

Each part is graded Pass / Pass-with-notes / Fail.

| Outcome | Meaning |
|---|---|
| **3 Pass** | Full graduation. Move to Arc 2. |
| **2 Pass + 1 Pass-with-notes** | Graduation with action item. Address notes during the first 4 weeks of Arc 2. |
| **2 Pass + 1 Fail** | Conditional graduation. Re-take the failed part within 4 weeks. Arc 2 can begin in parallel. |
| **≤ 1 Pass** | Not yet. Identify the gap, work through the relevant phase exit test catalog, retake the full exam after 4-6 weeks. |

**The "not yet" outcome is not a moral failing.** It means the work compounded unevenly, and a few more weeks of focused investigation will close the gap. The point is to enter Arc 2 from a position of real competence, not nominal completion.

---

## After passing

```
You can:
- Operate Linux as a daily substrate without notes
- Read and write Python idiomatically; ship a real CLI
- Read and write Go idiomatically including concurrency; ship a real CLI
- Reason about algorithmic complexity in real code
- Apply software architecture patterns deliberately
- Profile a slow function and articulate the fix
- Write tests that catch real bugs
- Ship code with trunk-based Git, CI, semver, automated releases
- Defend technical decisions in clear technical prose

Exit ramp: Junior Software Engineer
Confidence: real, with two shipped CLIs at v1.0.0 and ~18-20 OUTLINE patterns
```

→ Continue to [Arc 2: Backend Engineering](/program/arc-2/).

---

## Anti-patterns when sitting the exam

| Anti-pattern | Why |
|---|---|
| Treating the exam as a memory test | It's a competence test. Use your runbooks. |
| Compressing breaks to "finish faster" | Cognitive fatigue produces wrong answers. Take the 30-min breaks. |
| Asking AI to write the Build manifests or code | Auto-fail. The Build section is your hands. |
| Writing the Articulate part as bullet lists | Prose is the test. If you can't write it as prose, you don't understand it. |
| Re-taking on a tight schedule "to catch up" | If the first attempt revealed real gaps, give yourself 4-6 weeks. Arc 2 isn't a race. |
