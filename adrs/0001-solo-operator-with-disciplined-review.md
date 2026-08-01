---
adr_number: 0001
title: "Solo operator with disciplined review (no fake-team multi-account)"
status: accepted
deciders: [@jc]
date: 2026-06-30
supersedes: null
superseded_by: null
tags: [adr, workflow, github, solo-operator, year-0]
---

# ADR 0001: Solo operator with disciplined review (no fake-team multi-account)

## Status

**Accepted**, 2026-06-30.

## Context

The /root program is operated by one engineer (the author) across a multi-year arc. Early in program operation, the question came up: should the GitHub presence for Abukix simulate a team (multiple personal accounts, fake-team PR review, branch protection enforcing 1+ approval before merge) to practice multi-engineer workflows? Or should it remain genuinely solo with discipline imposed through other means?

Three forces shape the decision:

1. **Desire to practice real workflows.** Branch protection + CODEOWNERS + required reviewers are standard senior-IC patterns. Missing the practice has portfolio cost.
2. **Desire for honest evidence.** /root's central claim is *"I built and operated basecamp at homelab scale."* Faking a team in Git history undermines that claim's clarity.
3. **Platform hard limits.** GitHub's free Terms of Service allow one personal account per individual. GitHub blocks self-approvals on PRs even when the second approver is a different account you operate.

The decision must be made now (Year 0 / pre-Phase 1) rather than later because:

- Repo conventions get baked in early; changing the "team shape" mid-program rewrites Git history retroactively.
- The Pattern Paper at Arc 5 Capstone *(final-exam doc ports in v0.8.0)* makes claims that depend on this being made cleanly.

## Decision

**Operate as a single engineer. Encode review discipline via tooling, not via fake additional identities.**

The workflow:

```
1. Local branch off main.
2. Open a PR against main on GitHub.
3. CI runs required checks:
     - gitleaks (secret scan)
     - flux validate (basecamp only)
     - kustomize build (basecamp only)
     - kyverno test (basecamp only)
     - go test / go build (for Go-based OSS projects)
     - /pre-publish-check (skill — for anything about to flip public)
4. If CI passes: SIT ON THE PR OVERNIGHT before merging.
   The overnight wait is the cheapest "second pair of eyes" — past-you
   reviewing this morning's decision.
5. For consequential changes (new basecamp tier, new OSS project, public flip,
   ADR-worthy decisions): additionally
     - Use Claude Code's PR-review mode as an AI sanity check.
     - Require 1+ external human reviewer if one is available
       (mandatory for the Arc 5 Pattern Paper).
6. Self-merge after CI green + overnight wait + (for consequential cases)
   external review.
```

Encoded artifacts (authored alongside this ADR):

- **CODEOWNERS** template at `meta/git-templates/CODEOWNERS` *(ports in v0.5.0+)*.
- **Branch protection rules** documented at `meta/git-templates/branch-protection-rules.md` *(ports in v0.5.0+)*.
- **PR template** at [`.github/pull_request_template.md`](../.github/pull_request_template.md): prompts the author for summary, why, validation, risk, public-safety check.
- **CI workflow** at [`.github/workflows/ci-check.yml`](../.github/workflows/ci-check.yml).
- **Solo PR workflow section** in the [`homelab`](https://github.com/abukix/homelab) repo ([`dev-machine.md`](https://github.com/abukix/homelab/blob/main/dev-machine.md)), documenting the operator side of the rhythm.

## Consequences

**Positive:**

- **Honest Git history.** Every commit attributable to the actual operator. The Pattern Paper claim reads cleanly: "one engineer, five years, this is what came out."
- **TOS compliance.** No multi-account violation risk. The catastrophic single-point-of-failure scenario (GitHub bans accounts → repos go with them) is avoided.
- **Real review value preserved.** AI sanity check + overnight wait + external-when-consequential catches real mistakes. Fake-team approvals wouldn't.
- **Future-proof.** If/when actual contributors join (OSS community, hiring, mentorship), the workflow scales without restructure.
- **Single source of credibility.** The portfolio's "I built this" claim doesn't get diluted by performative team simulation.

**Negative:**

- **No daily practice of multi-engineer code review.** The reflex of "I'm reviewing someone else's diff" doesn't get exercised inside Abukix. Must come from OSS contribution or paired work outside this workspace.
- **The external-review safety net is mostly voluntary.** Only the Arc 5 Pattern Paper enforces it strictly. Discipline at other consequential moments depends on the operator's honesty about consequentiality.
- **Branch-protection rules that *require* approvers are partly theater.** The CI gate carries the real safety load; the required-reviewer UI is mostly cosmetic for a solo operator.

**Neutral:**

- **Single-operator throughput is what it is.** Team-velocity comparisons don't apply.
- **The decision is reversible.** If a co-maintainer joins basecamp in Arc 3+, this ADR may be superseded.

## Alternatives considered

### 1. Five GitHub accounts simulating a team (admin + service teams)

**Why considered:** practices the multi-engineer PR/review workflow; exercises branch protection rules; mimics large-tech-company team boundaries.

**Why rejected:**
- (a) GitHub TOS limits free personal accounts to one per individual.
- (b) GitHub blocks self-approvals on PRs regardless of how many accounts you operate: the technical mechanism that makes the practice valuable doesn't actually trigger.
- (c) The "review" is one person reading their own code under multiple hats. No second pair of eyes; no real bug-catching value.
- (d) Git history becomes dishonest, undermining the program's central credibility claim.

### 2. One personal account + bot accounts inside a GitHub Organization (officially supported)

**Why considered:** GitHub explicitly permits machine/bot users for automation in an Org context. A static-analysis bot could satisfy branch-protection's "approver required" rule.

**Why partially adopted:** A CI bot that runs static analysis is genuinely useful and is part of this decision (see the encoded CI workflow). But spinning up multiple bot identities specifically to *simulate human review* brings back the theater problem: one CI workflow doing real work is the answer, while multiple bot personas pretending to be reviewers is not.

### 3. Pair with one external buddy for routine review

**Why considered:** real second eyes; sustainable; mutually beneficial if they're also working on a multi-year project.

**Why deferred (not rejected):** open as a future option. No buddy currently identified. Finding one is a Arc 2-Arc 3 task. If/when it happens, this ADR may be superseded by ADR-NN.

### 4. OSS contribution as proxy for team-review experience

**Why considered:** authentic; teaches real review reflexes from senior maintainers.

**Why complementary (not exclusive):** /root's [Master Plan](../src/content/docs/program/overview.md) already calls for OSS contributions through the **Contribute** step of each phase's 8-step scaffold. This is happening in parallel; doesn't change the within-Abukix workflow.

## Follow-ups

- [x] Add the CODEOWNERS template to `meta/git-templates/`.
- [x] Add the pull-request template to `meta/git-templates/`.
- [x] Add the GitHub Actions CI workflow to `meta/git-templates/`.
- [x] Document branch-protection rule recommendations in `meta/git-templates/branch-protection-rules.md`.
- [x] Update [`homelab/dev-machine.md`](https://github.com/abukix/homelab/blob/main/dev-machine.md) with the "Solo PR workflow" section.
- [ ] Revisit annually: if a co-maintainer joins, supersede this ADR.

## References

- **`meta/adr-template`** *(ports in v0.5.0+)*: the template this ADR follows [TODO: link]
- **`meta/git-templates/`** *(ports in v0.5.0+)*: the artifacts this ADR mandates [TODO: link]
- **[`homelab/dev-machine`](https://github.com/abukix/homelab/blob/main/dev-machine.md)**: the operator workflow described
- [`program/ai-learning-protocol`](../src/content/docs/program/ai-learning-protocol.md) — the protocol Claude Code's PR-review mode enforces ("validate-then-write" extends to PR review: AI iterates the operator's draft; doesn't replace the operator's judgment)
- **`program/arc-5/final-exam`** *(ports in v0.8.0)* — Pattern Paper external-reviewer requirement (2+ readers) [TODO: link]
- GitHub Terms of Service: single-account rule for free tier
