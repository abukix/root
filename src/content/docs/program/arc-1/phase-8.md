---
title: "Git, CI/CD Fundamentals & Release Engineering"
description: "Phase 8 of /root Arc 1: Git workflows, CI pipelines, semantic versioning, release engineering. Trunk-based vs gitflow, conventional commits, automated releases. Close Arc 1 by hardening sift and pulse release processes."
tags: [arc-1, foundations, git, cicd, release]
arc: 1
phase: 8
---

> Eighth and final phase of Arc 1. Where code becomes shippable.

This phase closes Arc 1 by installing the professional engineering hygiene that separates "I write code" from "I ship software." Git workflows, CI pipelines, semantic versioning, release engineering: these are the practices that turn the tests, profiles, and architecture from Phases 5-7 into a *deliverable*. By phase end, `sift` and `pulse` both have proper CI pipelines, semantic versioning, automated releases, and a Git workflow that another engineer would recognize as professional.

This is also the phase that prepares you for the Arc 1 Final Exam. By the time you sit it, your Arc 1 portfolio includes: two shipped CLIs with tests, profiles, architectural rationale, CI/CD, versioned releases, and proper Git history. That's the engineer the Junior Software Engineer exit ramp hires.

---

## Prerequisites

> - [Phase 7](/program/arc-1/phase-7/) complete; `sift` and `pulse` >80% test coverage
> - GitHub account with workflows enabled (or GitLab / equivalent)
> - You accept: **release engineering is unglamorous and load-bearing. The reproducibility you build here is what makes production stable for years.**

---

## Why this phase exists

Most junior engineers commit to `main` directly, use Git as a save button, manually tag releases when they remember, and have no CI. Most senior engineers branch deliberately, write commit messages that survive `git log` archeology, automate releases, and treat the CI pipeline as a contract that gates what merges. The difference compounds over years.

This phase installs the senior practices: trunk-based development (or thoughtful gitflow), conventional commits, semantic versioning that actually means something, CI workflows that test + lint + build + release on every push, and automated cross-platform binary releases for the Go CLI.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You have code. You have tests. You have working artifacts. How does the code get from your machine to a user's hands reliably, repeatedly, and verifiably? How does the next version replace the previous one safely? How does a user know what changed between v1.2.0 and v1.3.0? How does future-you find when a specific behavior was introduced?

That's the release engineering problem. Git solves version control; CI solves automated verification; semantic versioning solves communication of change; release automation solves the human-error problem. Together they form the shipping pipeline every professional software project needs.

---

## 2. PRINCIPLES

### 2.1 Trunk-based development vs gitflow

Two major Git workflow philosophies. *Trunk-based*: one long-lived branch (`main`); short feature branches that merge within hours or days; releases cut from `main`. *Gitflow*: long-lived `main` + `develop` branches; feature branches off `develop`; release branches off `develop` merging into `main`.

In 2026, trunk-based has won for most contexts (continuous deployment, small/medium teams), but gitflow still fits some workflows (heavy release cadence, regulated industries).

→ Pattern: `trunk-based-development`

**Investigate:**
- What's the cost of long-lived feature branches? (Hint: merge hell.)
- When does gitflow fit better than trunk-based? (Hint: scheduled releases, multiple supported versions.)
- How do feature flags + trunk-based replace what gitflow's release branches did?

### 2.2 Conventional commits and commit-message discipline

Commit messages are documentation. A good message answers "why" and "what changed at the level of the change," not just "what files were touched." Conventional commits is one structured format (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`, `test:`) that enables tooling (automated changelogs, semantic version bumps).

**Investigate:**
- What's in a "good" commit message? (Hint: 50/72 rule, imperative mood, body explaining why.)
- How does the conventional commits format enable `release-please` or `semantic-release` to bump versions automatically?
- Why do squash-merge workflows benefit from clean PR titles?

### 2.3 Semantic versioning

The contract: `MAJOR.MINOR.PATCH`. MAJOR for breaking changes, MINOR for new features (backward-compatible), PATCH for bug fixes. The version number is a *promise* to consumers about what's safe to upgrade to.

→ Pattern: `semantic-versioning`

**Investigate:**
- What's a "breaking change," formally, not by feel?
- How do pre-release versions (`v1.0.0-rc.1`) and build metadata (`v1.0.0+sha.abcdef`) work?
- When is `v0.x` semantics different from `v1+` semantics? (Hint: pre-1.0, anything goes.)

### 2.4 CI as a contract

The CI pipeline is the gate. Every push runs: linter, tests, build, security scans. Anything that fails blocks the merge. The CI workflow is *part of the codebase*: version-controlled, reviewable, evolving with the project.

**Investigate:**
- What should a CI run on every push for a Python project? For a Go project?
- Why is caching dependencies a non-trivial CI design decision?
- How do you test the CI workflow itself when changes are needed?

### 2.5 Release automation

Manual releases are error-prone. Automated release pipelines bump the version, generate the changelog from commits, build artifacts (wheels, binaries), publish to registries (PyPI, GoReleaser → GitHub releases), and tag the repo, all triggered by a merge to `main` or a release-trigger event.

→ Pattern: `release-engineering`

**Investigate:**
- What's the difference between `release-please` (Google's tool) and `semantic-release` (Node ecosystem)?
- How does GoReleaser produce cross-platform binaries from one configuration?
- What's a release attestation, and why do supply-chain-conscious projects produce them (Sigstore, SLSA)?

### 2.6 Pre-commit hooks and local quality gates

The earlier the feedback, the cheaper. Pre-commit hooks run linters and formatters before a commit lands locally. They catch the trivial issues (formatting, missing imports, secrets) before CI does.

**Investigate:**
- What's `pre-commit` (the framework), and how does it manage hooks across multiple languages?
- Why is `gitleaks` or `trufflehog` worth adding as a pre-commit hook? (Hint: prevents secrets in Git history.)
- When do pre-commit hooks become annoying, and how do you balance strictness with developer velocity?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Git workflow | Trunk-based; gitflow; GitHub Flow; release branches | Trunk: simpler, requires feature flags. Gitflow: heavy, fits scheduled releases. |
| Commit messages | Conventional commits; free-form; "fixup" + squash on merge | Conventional: enables automation. Free-form: simpler, less tooling. |
| CI platform | GitHub Actions; GitLab CI; CircleCI; Buildkite; Drone | GitHub Actions: ubiquitous, free for public repos. GitLab: integrated. Others: niche. |
| Release tooling (Python) | `release-please`; `bumpver`; manual + GitHub Release UI | release-please: full automation. bumpver: middle ground. Manual: simplest, error-prone. |
| Release tooling (Go) | `goreleaser`; manual `go build` + GitHub Release | goreleaser: standard, multi-platform. Manual: less common in OSS Go. |
| Pre-commit | `pre-commit` framework; project-specific hooks; none | pre-commit: cross-language, mature. None: catch issues in CI instead. |

---

## 4. TOOLS (as of 2026-06)

### Git
- `git` itself (latest stable)
- `gh` (GitHub CLI) or `glab` (GitLab CLI): convenient command-line workflow
- `lazygit`: TUI for Git (optional, polarizing)

### Quality gates
- **`pre-commit`**: multi-language hook framework
- **`gitleaks` / `trufflehog`**: secret scanning
- **`commitlint`**: enforce conventional commit format

### CI platforms
- **GitHub Actions**: ubiquitous; free for public repos
- **GitLab CI**: integrated with GitLab

### Release automation
- **`release-please`** (Google): automated changelog + version bumping based on conventional commits (Python, Go, multi-language)
- **`semantic-release`**: older, Node-ecosystem-flavored
- **`goreleaser`**: Go-specific cross-platform binary releases
- **PyPI publishing**: via GitHub Actions + `pypa/gh-action-pypi-publish`

### Reading
- "Pro Git" (Chacon + Straub, 2nd ed., free online): the canonical Git book
- "Continuous Delivery" (Humble + Farley): the foundational CI/CD book
- "Trunk Based Development" (Hammant, free online site)
- Sigstore + SLSA documentation for the supply-chain-security angle

---

## 5. MASTERY: Harden sift and pulse release pipelines

### 5.1 The deliverable

`sift` and `pulse` both with:

- **Trunk-based Git workflow** (one long-lived `main`; PRs from short feature branches; squash-merge)
- **Conventional commit format** enforced via commitlint or PR title checks
- **Pre-commit hooks** running linters, formatters, secret scans
- **CI workflow** on every push: lint + test + coverage + build
- **Automated release pipeline**: merge to `main` → release-please proposes a release PR → merging the release PR triggers the actual publish (PyPI for sift, GoReleaser for pulse)
- **`CHANGELOG.md`** auto-generated from conventional commits
- **Semantic versioning** applied correctly; first stable release tagged `v1.0.0`

By phase end both projects should have **`v1.0.0` released** publicly with a clean release pipeline.

### 5.2 Operational depth checklist

```
[ ] Configure trunk-based workflow on sift and pulse; squash-merge enabled
[ ] Set up pre-commit with: language-specific formatters, gitleaks, commitlint
[ ] CI workflow for sift: ruff + mypy + pytest + coverage upload
[ ] CI workflow for pulse: golangci-lint + go test -race + coverage upload
[ ] Set up release-please for both projects
[ ] Set up PyPI publishing for sift (with trusted publishing if using GitHub Actions)
[ ] Set up GoReleaser for pulse: produce binaries for Linux/macOS/Windows × amd64/arm64
[ ] Cut v1.0.0 for both projects
[ ] Generate first auto-generated CHANGELOG.md
[ ] Test the release pipeline end-to-end: make a small commit, watch release-please propose, merge, observe release
[ ] Document the release process in each repo's CONTRIBUTING.md
```

---

## 6. COMPARE: gitflow as an alternative

Take ONE small experimental fork of `sift` or `pulse`. Set it up with gitflow conventions (`main` + `develop` + `release/*` + `hotfix/*` branches). Spend a week using it. Reflect on what changed vs trunk-based.

400-word reflection on when each workflow fits.

---

## 7. OPERATE

- 3-4 runbooks: "Cut a release manually if automation fails," "Revert a bad release," "Fix a broken CI on main," "Recover from a force-pushed branch"
- 2 ADRs: trunk-based vs gitflow choice; release-please vs alternatives
- Weekly log

---

## 8. CONTRIBUTE

- A CI improvement to an OSS project you use
- A release-process documentation improvement
- A first merged PR (if you haven't yet); Arc 1's first-merged-PR deadline is end of this phase

---

## What ships from this phase

- **`sift` v1.0.0**: public, fully release-engineered, PyPI-published
- **`pulse` v1.0.0**: public, fully release-engineered, GoReleaser binaries
- **First merged upstream PR** (anywhere: docs, examples, small fix)
- **`chronicle`** with release engineering runbooks
- **Arc 1 portfolio complete**: ready for the Arc 1 Final Exam

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (trunk-based, commits)
           Set up trunk-based workflow + commitlint

Week 2     PRINCIPLES 2.3 (semver)
           Set up pre-commit hooks

Week 3     PRINCIPLES 2.4 (CI as contract)
           Build CI workflows for sift + pulse

Week 4     PRINCIPLES 2.5 (release automation)
           Set up release-please + PyPI publish (sift)

Week 5     PRINCIPLES 2.6 (pre-commit)
           Set up GoReleaser for pulse; cut v1.0.0 for both

Week 6     COMPARE: gitflow experiment
           chronicle runbooks

Week 7     OPERATE + CONTRIBUTE
           Exit Test + Arc 1 Final Exam prep
```

---

## Validation criteria

```
[ ] sift v1.0.0 released on PyPI with automated pipeline
[ ] pulse v1.0.0 released with GoReleaser binaries
[ ] CI green on every push for both projects; coverage tracked
[ ] Pre-commit hooks operational
[ ] release-please proposing release PRs automatically
[ ] First merged upstream PR
[ ] All 11 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 runbooks
[ ] 2 ADRs
[ ] Pattern entries deepened STUB → OUTLINE:
    - trunk-based-development
    - semantic-versioning
    - release-engineering
[ ] Exit Test passed
[ ] Arc 1 Final Exam prep can begin
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Given a fresh Python project skeleton (provided): set up trunk-based workflow + pre-commit + CI + release-please + PyPI publish. Verify by making a small commit and watching the release pipeline propose a v0.1.0 release.

### Part 2: Diagnose (60 min)
A broken release scenario (provided). Identify and fix. Possible scenarios: failed PyPI auth, GoReleaser config drift, release-please refusing to bump, CI cache poisoning.

### Part 3: Articulate (30 min)
~600 words: *"You join a team that uses gitflow with manual releases and free-form commit messages. Propose a migration to trunk-based + conventional commits + automated releases. Cover the steps, the resistance you'd expect, and the wins."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Committing directly to main | Defeats CI, defeats review, makes rollback harder |
| Long-lived feature branches | Merge conflicts compound; the work gets stale relative to main |
| Free-form commit messages | "Fix stuff" tells future-you nothing |
| Skipping CI "just this once" | This is how main ends up broken on a Friday afternoon |
| Hand-bumping versions | Error-prone; humans miss version bumps for breaking changes constantly |
| Treating the changelog as optional | Users depend on the changelog; missing one is a contract break |

---

## Patterns touched this phase

- `trunk-based-development`: first OUTLINE
- `semantic-versioning`: first OUTLINE
- `release-engineering`: first OUTLINE

---

→ Next: [Arc 1 Final Exam](/program/arc-1/final-exam/)
