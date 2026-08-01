<!--
PR template: GitHub renders this whenever a PR is opened.
Lives at: .github/pull_request_template.md
Last verified: 2026-06 against GitHub's PR template rendering.

Encodes ADR-0001: every PR's author answers these prompts so review (by future-self
overnight, by AI sanity check, by external reviewer when consequential) has structure.

Delete the comments before committing the PR if your style prefers. The prompts
themselves are what matters.
-->

## Summary

<!-- One sentence: what does this PR change, in plain language? -->

## Why

<!--
What problem does this solve? What pattern does it instantiate?

If this PR implements an ADR-worthy decision, link the ADR:
  - Implements ADR-<NNNN>

If this PR derives from a postmortem or runbook update, link it:
  - Resolves action item from postmortem 2026-MM-DD
  - Updates runbook recover-X-stuck

If this PR is just routine (typo, dependency bump, weekly housekeeping):
  - "Routine, no ADR/postmortem dependency."
-->

## What changed

<!-- Bullet list of concrete changes. Files touched. Behavior delta. -->

-
-
-

## Validation

<!--
What did you DO to verify this works? Be specific.

Examples:
  - [x] `flux validate` passes locally
  - [x] `kustomize build overlays/k3s` renders cleanly
  - [x] Deployed to homelab K3s; observed expected behavior for 1 hour
  - [x] Unit tests added: `pkg/foo/foo_test.go`
  - [x] Integration test runs against ephemeral cluster (kind)
  - [x] Tested rollback path: reverted, observed system returns to prior state

If validation is "I ran it and it didn't crash," say so. Honesty over false certainty.
-->

- [ ]
- [ ]

## Risk assessment

<!--
What's the blast radius if this is wrong?

Categories (pick one):
  - LOW: typo, comment-only, isolated test, dependency patch bump.
  - MEDIUM: config change, new feature flag-gated, single-service touch.
  - HIGH: multi-service change, security-relevant, schema change,
           anything in /infrastructure/security/ or production-traffic-affecting.
  - CRITICAL: change that, if wrong, costs data, customers, or compliance.

For MEDIUM and above, list the rollback plan.
-->

**Risk level:** LOW | MEDIUM | HIGH | CRITICAL

**Rollback plan** (if MEDIUM+):

## Public-safety check

<!--
Per ADR-0001 + the public-safety discipline, any PR that touches
public-intended content must pass:
  - [ ] `/pre-publish-check` skill run on changed files
  - [ ] No internal product names from prior-employer contexts introduced
  - [ ] Cross-references resolve
  - [ ] Voice anchors honored (no hedge-words, no emojis, no marketing language)

For private repos, this check is informational only.
-->

- [ ] N/A: change is purely internal/private
- [ ] `/pre-publish-check` run, clean
- [ ] Public-safety findings, if any, resolved

## Reviewer checklist (for the author-as-reviewer past-self)

<!--
ADR-0001's "sleep on it overnight" rhythm: open the PR, walk away, come back
tomorrow, re-read with fresh eyes, then check these boxes. Self-merge after.
-->

- [ ] CI is green
- [ ] I slept on this overnight before re-reading
- [ ] On re-read, the change still makes sense (no "what was I thinking" moments)
- [ ] For HIGH/CRITICAL risk: external human reviewer signed off, or `/root-tutor` flagged no concerns
- [ ] If this implements an ADR, the ADR follow-ups are checked off

## Links

<!-- Anything a reader (or future-you) might want adjacent to this PR -->

- Commit-history-style links:
- Related runbook(s):
- Postmortem(s) this addresses:
- ADR(s) this implements:
- Grafana dashboard / SLO showing the change's effect:
