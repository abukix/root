---
title: "Programming Foundations I — Python"
description: "Phase 2 of /root Arc 1: Python fluency through real projects. Basics, OOP, FP, async, packaging, type hints. Ship sift v0.1 publicly as the fluency artifact."
tags: [arc-1, foundations, python, projects]
arc: 1
phase: 2
---

> Second phase of /root. Python fluency, shipping a real CLI.

This is the phase where you go from *can't write a Python program* to *can ship a small CLI in a weekend*. Fluency is the goal, not mastery: you'll come back to Python in Arc 2 (backend services), Arc 4 (the data tier + ML stack), and Arc 5 (the AI infrastructure) at much greater depth.

The phase is anchored by a real shipping deliverable: [`sift`](/projects/sift/plan/), a regex CLI you write, test, document, and ship publicly to GitHub + PyPI. Building a real artifact is what converts "I read the Python docs" into "I can write Python." Reading the docs is necessary but insufficient; the typing + shipping completes the loop.

---

## Prerequisites

> - [Phase 1](/program/arc-1/phase-1/) complete; Linux dev environment hardened
> - Python 3.12+ installed via your version manager
> - `uv` installed (the modern Python package manager) or comfort with `poetry` / `pip` as alternative
> - GitHub account active; SSH keys configured
> - You accept: **you are not learning Python the language. You are learning a tool category called "high-level scripting + ML lingua franca," with Python as one implementation.**

---

## Why this phase exists

Python is everywhere in the world /root targets: ML/AI infrastructure, data pipelines, agent runtimes, glue between services, CLI tools. Whether or not you eventually love it, you'll *read* a lot of Python for the rest of the program. Fluency means: I can read any tool's source, write a useful CLI in an afternoon, ship a small service in a weekend, and stop fearing the language layer.

This phase also delivers your **first public OSS artifact**: `sift`. Shipping a real thing (with tests, CI, a release) is the difference between "I learned Python" and "I can ship Python." The artifact also seeds the portfolio. Senior IC interviews care about what you've shipped; `sift` is the first thing on that list.

---

## The pattern-first frame

Same eight steps as every phase. See [The Master Plan](/program/overview/#the-pattern-first-scaffold).

---

## 1. PROBLEM

You need a high-level language to glue systems together. To write a CLI that operates on data, to call an HTTP API, to parse logs and produce metrics, to define a data pipeline, to build an agent that calls tools. The language should have batteries-included libraries, fast iteration, and an enormous ecosystem.

Python solves that problem. So does Ruby, JavaScript, Go (in some shape), and Bash for the smallest cases. Python's particular wins are *ecosystem* (NumPy, Pandas, PyTorch, FastAPI, LangChain) and *readability*. Its particular costs are *runtime speed* and the *GIL*.

---

## 2. PRINCIPLES

### 2.1 Interpreted, not compiled (mostly)

Python is interpreted bytecode running on CPython (the canonical implementation). PyPy is a JIT alternative. The interpreter is the substrate.

→ Pattern: `interpreted-runtime`

**Investigate:**
- What does `dis.dis(some_function)` show you?
- What is CPython, and what do PyPy and MicroPython differ on?
- When does the interpreter overhead matter, and when does it disappear (NumPy hot loops)?

### 2.2 The GIL and concurrency model

The Global Interpreter Lock serializes Python bytecode execution. CPU-bound multithreading doesn't actually parallelize. IO-bound work scales via async or multiprocessing.

**Investigate:**
- Why does `asyncio` help where `threading` doesn't, for IO-bound work?
- Why does `multiprocessing` work for CPU-bound work?
- What's the post-GIL roadmap (PEP 703) and when might it matter?

### 2.3 Type hints

Python is dynamically typed. Type hints (PEP 484+) layer optional static checking via `mypy` or `pyright`. They're documentation that gets checked.

**Investigate:**
- What's a `Protocol` and why is it more flexible than inheritance?
- What does `mypy --strict` actually require?
- When do type hints lie? (Untyped third-party libraries, `Any` escape hatches.)

### 2.4 Packaging and environments

Python's packaging story has improved dramatically with `uv`. Virtual environments isolate dependencies per project. Lock files (`uv.lock`, `poetry.lock`) reproduce builds. PyPI is the central registry.

→ Pattern: `packaging-and-dependency-management`

**Investigate:**
- What does `uv venv` actually create?
- Why is the *system Python* not the Python you should use?
- What's the difference between `pip install` and `uv pip install`, and why is `uv` 10× faster?

### 2.5 Object-oriented and functional patterns in Python

Python supports both OOP and FP styles. Classes for state + behavior; functions for transformations. Senior Python avoids the "everything is a class" trap of early Java and the "no abstractions" trap of pure scripting.

**Investigate:**
- When does a function beat a class? (Hint: stateless transformations.)
- What's a dataclass, and when is it the right shape vs a plain class?
- Why are list comprehensions sometimes faster and clearer than `for` loops + `append`?

### 2.6 Synchrony, concurrency, parallelism

Three different concepts. Synchrony: one thing at a time. Concurrency: structuring code so it *can* run interleaved. Parallelism: actually running on multiple cores.

**Investigate:**
- Why is `asyncio` concurrency, not parallelism?
- When does `concurrent.futures.ProcessPoolExecutor` give you real parallelism?
- What's structured concurrency, and how does `asyncio.TaskGroup` differ from manual `asyncio.gather`?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Package manager | `uv` (current); `poetry`; `pip` + `requirements.txt` | `uv`: fast, modern. `poetry`: mature, slow. `pip`: lowest common denominator. |
| Type checker | `mypy`; `pyright`; none | `mypy`: lenient. `pyright`: fast, strict. None: legacy. |
| CLI framework | `click`; `typer`; `argparse` | `click`: composable, ecosystem. `typer`: type-driven. `argparse`: stdlib, verbose. |
| Testing | `pytest`; `unittest` (stdlib); `hypothesis` for property-based | `pytest`: standard. `unittest`: stdlib, verbose. `hypothesis`: layer on `pytest`. |
| Linter + formatter | `ruff` (current); `black` + `flake8` + `isort` | `ruff`: fast, integrated. The older stack: slower, more configs. |

---

## 4. TOOLS (as of 2026-06)

### Environment
- **`uv`**: package manager + installer
- **`ruff`**: linting + formatting
- **`mypy` or `pyright`**: type checking
- **`pytest`**: testing

### Frameworks (for `sift`)
- **`click`** or **`typer`**: CLI
- **`rich`**: terminal output formatting

### Reading
- "Fluent Python" (Ramalho, 3rd ed.): the canonical deep-Python book
- "Python Concurrency with asyncio" (Fowler)
- The CPython source: it's readable; skim the `bytecode_compiler` and `ceval.c` sections at some point this year
- PEP 8 (style), PEP 257 (docstrings), PEP 484 (type hints), PEP 703 (post-GIL roadmap)

---

## 5. MASTERY: Ship `sift`

### 5.1 What sift is

[`sift`](/projects/sift/plan/) is a regex CLI in Python. The project plan documents the spec; the shipping bar is:

- Public GitHub repo with README, LICENSE, CI (GitHub Actions or equivalent)
- Tests with `pytest`, coverage > 70% (you'll push higher in Phase 7)
- Type-checked with `mypy --strict` (or `pyright` strict mode)
- Released to TestPyPI (real PyPI optional this phase; will be required after Phase 8)
- 1+ external user (a colleague or friend tries it; you fix what they hit)

Volume: ~300-600 lines of Python. Time: ~30-50 hours spread across weeks 4-10 of the phase. The other ~50-90 hours are pattern depth + the Python sequence below.

### 5.2 The Python sequence

The pattern-first work for Python flows in this order. Each section is a 1-2 week beat, applied while building `sift`:

1. **Basics**: variables, control flow, functions, modules, imports
2. **Data structures**: lists, dicts, tuples, sets; comprehensions
3. **OOP**: classes, inheritance, dunder methods, dataclasses, `Protocol`
4. **FP**: first-class functions, closures, decorators, `functools.partial`
5. **Errors & exceptions**: exception hierarchy, `try/except/else/finally`, custom exceptions
6. **I/O**: files, contexts (`with`), reading/writing structured data
7. **Async**: `asyncio` basics, `async def`, `await`, `TaskGroup`
8. **Packaging**: `pyproject.toml`, building wheels, publishing to PyPI

### 5.3 Operational depth checklist

```
[ ] Set up `uv` + `ruff` + `mypy` for a new project end to end
[ ] Write a CLI with `click` or `typer` that wraps a subprocess and emits structured output
[ ] Write a small HTTP client with `httpx`; handle timeouts and retries
[ ] Profile a slow Python loop with `cProfile` + `py-spy`; identify the hot path
[ ] Use `asyncio` to make 100 concurrent HTTP requests; reason about why it's faster than threading here
[ ] Write a property-based test with `hypothesis` for one of `sift`'s pure functions
[ ] Package sift for PyPI: `pyproject.toml`, classifiers, README rendering
[ ] Read `sift`'s source as if you were a senior reviewer; flag 3 things you'd change
```

---

## 6. COMPARE: Go or Rust mini-CLI

After shipping `sift`, translate a small slice (e.g., the regex-match-on-stdin loop) to Go or Rust. Same problem, different language. The point isn't to ship; it's to feel the trade-offs. Go's `regexp` is RE2-based and won't backtrack; Python's `re` will. Rust's `regex` crate is also RE2.

400-word reflection in `chronicle/`: what's idiomatic in each? What's painful?

---

## 7. OPERATE

- 2-3 runbooks in `chronicle/runbooks/python/` (deploy issues, dep upgrades, packaging gotchas)
- 1+ ADR (e.g., "Why `uv` over `poetry` for /root's Python projects")
- Weekly log every Sunday

---

## 8. CONTRIBUTE

- `click` or `typer`: docs, small fixes
- `httpx`: docs, examples
- `uv`: bug reports, edge cases (the Astral team is responsive)
- `ruff`: rule suggestions, docs

---

## What ships from this phase

- **[`sift`](/projects/sift/plan/) v0.1**: public on GitHub + TestPyPI. The first OSS artifact of /root.
- **`chronicle`** updated with Python runbooks.
- **Python fluency** at the *can-ship-a-real-CLI-in-a-weekend* level.

---

## Learning loop cadence

```
Weeks 1-2     PROBLEM + PRINCIPLES 2.1-2.2 (runtime, GIL)
              Python sequence: basics + data structures
              sift design sketch

Weeks 3-4     PRINCIPLES 2.3-2.4 (type hints, packaging)
              Python sequence: OOP + FP
              sift first commit; tests stub

Weeks 5-7     PRINCIPLES 2.5-2.6 (OOP/FP, async)
              Python sequence: errors + I/O + async + packaging
              sift core working; CI green

Weeks 8-10    Ship sift v0.1 (TestPyPI, README, external user)
              chronicle runbooks

Weeks 11-12   COMPARE: Go or Rust mini-CLI
              OPERATE + CONTRIBUTE
              Exit Test
```

---

## Validation criteria

```
[ ] sift v0.1 shipped (GitHub + TestPyPI + ≥1 external user)
[ ] All 8 operational depth checks
[ ] Compare reflection written (400 words)
[ ] 2-3 Python runbooks in chronicle
[ ] 1+ ADR
[ ] Pattern entries deepened STUB → OUTLINE:
    - interpreted-runtime
    - packaging-and-dependency-management
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Build a new small CLI from scratch: takes JSON-Lines on stdin, filters by a simple expression (e.g., `field == "value"`), emits to stdout. Tests, type checking, README, packaging-ready `pyproject.toml`.

### Part 2: Articulate (90 min)
~1200 words: *"Walk a Python HTTP request from `httpx.get(url)` to the bytes on the wire. Cover the TCP socket, the SSL handshake (where does it happen in Python?), the HTTP framing, the response parsing, and what happens to memory through the whole flow. Then explain why `async with httpx.AsyncClient()` is different and when it pays."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Letting AI write exercises or large chunks of sift | The forced typing is the work. Skipping it means you've learned to read code that you can't write. |
| Shipping sift without tests "to move faster" | The tests are the only evidence it works. Without them, the README is fiction. |
| Adding async everywhere "because async is faster" | Async is faster for IO-bound code. CPU-bound code in async is just slower with more complexity. |
| Treating mypy errors as noise | Type errors caught at static-check time are 100× cheaper than at runtime. Listen to them. |
| Skipping the Go/Rust compare | Without it, you'll think Python is the only way to write a CLI. It isn't. |

---

## Patterns touched this phase

- `interpreted-runtime`: first OUTLINE
- `packaging-and-dependency-management`: first OUTLINE

---

→ Next: [Phase 3: Data Structures & Algorithms](/program/arc-1/phase-3/)
