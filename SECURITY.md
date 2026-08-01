# Security Policy

`/root` is a curriculum repo: primarily Markdown content plus YAML templates and small Claude Code skills. Its attack surface is limited compared to an application, but a few real concerns warrant a clear reporting path.

## Reporting a vulnerability

**Do not open a public issue** for security-relevant problems. Two private paths:

1. **GitHub Private Vulnerability Reporting** *(preferred)*: go to the [Security tab](https://github.com/abukix/root/security) → **Report a vulnerability**. GitHub creates a private advisory thread only maintainers can see.
2. **Email**: `me@abukix.dev`. PGP / age encryption available on request.

Include:

- A clear description of the issue and its potential impact
- Steps to reproduce (or the file / line that's affected)
- Suggested fix, if you have one
- Whether you've disclosed elsewhere

## In scope

- **Repository configuration**: branch-protection bypass paths, accidentally-public state, leaked secrets in git history.
- **CI workflow safety**: `.github/workflows/*.yml` issues where a CI run could be made to do something it shouldn't (arbitrary code via untrusted PR, secret exfiltration, etc.).
- **Curriculum content leaks**: any internal product name from any prior-employer stack that should have been scrubbed by the public-safety discipline but slipped through. The forbidden-terms list is maintained privately outside this repo and never published.
- **Template defects with security impact**: e.g., a YAML template that, if copied into a real cluster, would create a privilege-escalation hole.
- **Claude skill misbehavior**: the skills in `.claude/skills/` are project-scoped, but a malicious instruction injected into a curriculum doc could in theory mislead Claude. Reports welcome.

## Out of scope

- **Issues in third-party tools the curriculum references**: report upstream (Astro, Kubernetes, etc.).
- **Vulnerabilities in `basecamp` or its modules**: those live in their own repos ([basecamp](https://github.com/abukix/basecamp), [ascent](https://github.com/abukix/ascent), etc.). Each has its own SECURITY.md; report there.
- **Theoretical concerns about referenced patterns**: academic discussion belongs in GitHub Discussions, not Security Advisories.
- **Cosmetic issues**: typos, broken links, formatting. Open a regular issue or PR.
- **Subjective curriculum disagreements**: Discussions topic, not security.

## Response time

Solo maintainer; best-effort response within **72 hours** of report. Acknowledgment typically within 24 hours. Fix timelines depend on severity:

- **Critical** (active leak, exposed credential, malicious template): fix within 7 days; advisory published once fix is verified.
- **High** (path to privilege escalation, significant content leak): fix within 14 days.
- **Medium / Low**: fix on the next routine update cycle; advisory published with the fix.

## Disclosure

`/root` preserves an **honest-evidence** principle. Security advisories are part of that:

- All accepted advisories publish in the repo's [Security Advisories](https://github.com/abukix/root/security/advisories) section after the fix lands.
- Credit given to the reporter unless anonymity requested.
- The CHANGELOG notes the fix under a `### Security` subsection of the relevant release.

## Scope of the maintainer's commitment

This is a personal program operated by one engineer over five years. The security posture reflects that:

- Best-effort response, not enterprise-grade SLAs
- No paid bug bounty
- No 24/7 on-call

In return: a clear reporting channel, real responses, and visible action on legitimate reports.

## Cross-references

- [`CONTRIBUTING.md`](CONTRIBUTING.md): the workflow that gates how fixes land (PR + CI + review + merge)
- `.github/workflows/ci-check.yml`: the CI gate that runs gitleaks on every PR, catching secret leaks before they land
- `pre-publish-check` skill: the safety guard invoked at every public-flip moment (project-scoped skill; not published in this repo)

---

*This file is part of `/root`. License: [Apache-2.0](LICENSE).*
