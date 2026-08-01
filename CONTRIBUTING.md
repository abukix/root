# Contributing to /root

Thanks for considering a contribution. `/root` is a self-authored curriculum maintained by a single engineer; the scope is intentionally bounded. This guide covers what's welcome, how to submit, and the voice / safety rules that apply.

## The family, in one paragraph

`/root` is the build guide. [`basecamp`](https://github.com/abukix/basecamp) is the platform it produces (8 modules: `ascent`, `crag`, `vantage`, `beacon`, `forge`, `prism`, `loom`, `warden`). Standalone Arc 1 tools ship as `sift` and `pulse`. Each repo has its own CONTRIBUTING; this one covers only `/root` (the curriculum + site).

## What's welcome

| Contribution | Welcome? |
|---|---|
| Typo / grammar fixes | **Yes, always**: open a PR directly |
| Broken-link repairs | **Yes**: cross-refs shift as content ports in |
| Factual corrections (a tool changed; a paper title was wrong) | **Yes** |
| Site / code fixes (component bugs, CSS, accessibility in `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`) | **Yes**: treat like prose PRs (small, focused, tested locally) |
| Translations into other languages | **Coordinate first**: open an issue |
| Suggestions for additional patterns to add to the Pattern Library | **Open an issue first**, don't draft an entry pre-discussion |
| New phases, new years, scope additions | **Out of scope**: `/root`'s structure is the author's design |
| Promoting STUB patterns to OUTLINE / DEEP | **Out of scope for external contributors**: DEEP requires operating evidence the author accumulates on `basecamp` |
| Feature requests for `basecamp` modules | **Wrong repo**: open in the module's own repo (e.g. `github.com/abukix/prism/issues`) |

When in doubt: open an issue describing the proposed change before opening a PR.

## How to contribute

1. **Fork** to your GitHub account.
2. **Branch** off `main`: `git checkout -b fix/typo-in-readme`.
3. **Make the change.** One concern per PR.
4. **Commit with a signed commit** (SSH signing preferred).
5. **Open the PR** against `main`. Fill the template: summary, why, validation, public-safety check.
6. **Pass CI.** Required checks: yaml-lint, gitleaks.
7. **Be patient.** Single maintainer.

## Voice anchors: honor these

If you're editing prose:

- **Direct, opinionated, no fluff.** No hedge-words ("might", "perhaps", "you may want to").
- **Pattern-first.** Tools sit inside named patterns; name the pattern before the tool.
- **No marketing language.** No "revolutionary", "game-changing", "AI-powered", "cutting-edge".
- **No emojis** in authored prose.
- **Trade-offs explicit.** Tables when more than two options; prose for two.
- **Time-stamp the volatile bits.** Tool sections get a date comment; pattern sections don't.

A PR that reads in a different voice will get review comments asking for alignment. We'd rather merge with a quick voice fix than reject, so expect the iteration.

## Public-safety constraint

`/root`, `basecamp`, and every module repo are public-safe by discipline. **No internal product names from any specific employer's stack appear in any public artifact.** Industry parallels use publicly-documented references (Netflix Metaflow, Spotify Backstage, Uber Michelangelo, Airbnb Bighead, Databricks Unity Catalog, LiteLLM, vLLM, etc.) or generic "frontier-lab" framing.

If you're contributing factual corrections or adding industry parallels, verify the source is **publicly documented**:

- Conference talks (KubeCon, re:Invent, SREcon, QCon)
- Engineering blog posts published by the company
- Open-source code with the author's affiliation
- Published papers

Sources from internal handbooks, internal Slack, or internal docs portals are out of scope, regardless of how broadly applicable the pattern is.

Enforcement is manual: a `pre-publish-check` skill sweeps the corpus before each release. CI runs yaml-lint and gitleaks; public-safety review is a separate gate at merge time.

## AI-assisted contributions

Per `/root`'s [AI Learning Protocol][alp] (canonical version ports in with v0.2.0): AI assistants may help you *iterate* a draft you wrote. They may NOT generate the first draft of substantive content.

What this means:

- **Typo fixes via AI**: fine.
- **AI-suggested wording improvements on text you wrote**: fine.
- **AI-generated whole sections of prose**: not accepted. The voice anchors fail; reviewers detect it.
- **AI-generated code in templates**: must be verified by you against current tool versions. The `# Last verified:` comment must reflect the date you personally tested it.

[alp]: src/content/docs/program/ai-learning-protocol.md

## Issues

For bug reports, broken links, factual errors, or larger discussion threads, open a GitHub issue. Tag with:

- `bug`: broken cross-reference, broken example, factual error
- `documentation`: clarity improvement, missing context
- `discussion`: propose a curriculum change (evaluated against `/root` scope)
- `pattern`: suggest adding a pattern entry (discussion first, not a PR)

## Code of Conduct

Be a good citizen. Disagree on technical substance, not personalities. Operate as if every interaction is public (because it is). Assume good faith, name specific examples when critiquing, avoid generalizations, no ad hominem, no harassment.

## Recognition

Contributors are noted in the repo's commit history and (for substantive contributions) in the [CHANGELOG](CHANGELOG.md). There's no contributor leaderboard; the framing is one engineer's program. Your specific contributions are auditable in the Git history and credited where they land.

## License

By contributing to `/root`, you agree your contributions are licensed under the same [Apache 2.0](LICENSE) that covers the rest of the project.

## Questions

- Workflow / process: open an issue tagged `discussion`
- Security-relevant: see [SECURITY.md](SECURITY.md) for the private path
- General: `me@abukix.dev` or open a GitHub Discussion

Even a typo fix is a meaningful contribution to a curriculum. Thanks.
