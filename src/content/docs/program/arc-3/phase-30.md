---
title: "Reliability Engineering"
description: "Phase 30 of /root Arc 3: DR drills, chaos engineering, backup verification on schedule. The discipline that turns 'basecamp works' into 'basecamp survives.' Final phase of Arc 3.."
tags: [arc-3, infrastructure, reliability, sre, dr, chaos]
arc: 3
phase: 30
---

> Last phase of Arc 3. Reliability as practiced discipline.

This phase closes Arc 3 by installing the routines that separate "the platform works" from "the platform survives." DR drills (you've practiced recovery from any failure mode). Chaos engineering (you've deliberately broken parts and observed recovery). Backup verification (you've actually restored from backup, not just trusted that backups happen). Incident response (you've run a simulated incident and produced a real postmortem).

By phase end basecamp has these routines on a schedule. Quarterly DR drills. Weekly chaos experiments. Daily backup verification. Templated incident response. The Arc 3 Final Exam comes next.

---

## Prerequisites

> - [Phase 29](/program/arc-3/phase-29/) complete; FinOps in place
> - basecamp multi-cloud operational
> - You accept: **failure is the default. Reliability is what you practice deliberately to delay or contain it.**

---

## Why this phase exists

Most production outages have predictable shapes: backups never tested, DR never practiced, "we have monitoring" but nobody read it during the actual incident. Each shape has a known mitigation discipline. Senior engineers apply these disciplines *before* the outage.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

basecamp will fail. The question is whether you've practiced the failure mode before it happens in production. Reliability engineering is the discipline of practicing failures so the real ones are routine.

---

## 2. PRINCIPLES

### 2.1 Disaster recovery (DR)

DR is the practiced ability to recover from catastrophic failure. Region down, cluster destroyed, data center offline.

→ Pattern: `disaster-recovery`

**Investigate:**
- What's RTO (Recovery Time Objective) vs RPO (Recovery Point Objective)?
- For basecamp, what's a realistic RTO + RPO for each tier?
- What's the difference between hot/warm/cold standby?

### 2.2 Chaos engineering

Deliberately injecting failure to verify resilience. Netflix's Chaos Monkey is the canonical tool; modern equivalents include Litmus, Chaos Mesh.

→ Pattern: `reliability-engineering`

**Investigate:**
- What's the right cadence for chaos experiments (weekly, monthly)?
- Game-day vs continuous chaos: when does each apply?
- What's a "blast radius," and how do you contain it during chaos experiments?

### 2.3 Backup verification

A backup that hasn't been restored from is not a backup. Verification is restoring to a separate environment and verifying the data is intact.

**Investigate:**
- How often should backups be verified? (Hint: at least monthly.)
- What's the difference between point-in-time and snapshot backups?
- Why is "we backup nightly" not enough?

### 2.4 Incident response

When something breaks, the response is structured. Roles (incident commander, comms, scribe). Timelines (response stages). Postmortems (blameless, focused on systemic causes).

**Investigate:**
- What's an incident commander's job?
- Why are postmortems blameless?
- "Five whys": when does it work and when does it become theatre?

### 2.5 Resilience as a property of architecture

Reliability isn't a feature added at the end. It's a property of how the system is composed. Bulkheads, circuit breakers (Phase 16), retries with jitter (Phase 16), graceful degradation, redundancy at every tier.

**Investigate:**
- For basecamp, list every single point of failure. What's the recovery story for each?
- What does graceful degradation look like when Redis is down? Postgres? Vault?
- Which Arc 2 resilience patterns appear in your architecture?

### 2.6 Run the runbook (game days)

You don't actually know if a runbook works until someone follows it. Game days simulate incidents using only the runbook + the available telemetry.

**Investigate:**
- What's the right ratio of game days to real incidents?
- How do you run a game day in the homelab?
- What's the test of a good runbook? (Hint: a new engineer follows it without asking.)

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| DR strategy | Hot standby (continuous replica); Warm; Cold (backup restore); No DR | Hot: fast RTO, expensive. Warm: moderate. Cold: slow RTO, cheap. None: dangerous. |
| Chaos cadence | Continuous; weekly game days; monthly; ad-hoc; never | Continuous: best signal, complex. Weekly: pragmatic. Never: production-time discovery. |
| Backup frequency | Continuous (WAL streaming); hourly; daily; weekly | Continuous: lowest RPO, highest cost. Daily: standard. Weekly: only for low-value data. |

---

## 4. TOOLS (as of 2026-06)

- **Chaos Mesh**: chaos engineering on K8s
- **Litmus**: chaos engineering, CNCF
- **Velero**: K8s-native backup
- **`pg_dump` + `pgBackRest`**: Postgres backup
- **AWS Backup / GCP Backup**: managed
- **Incident.io** or **rootly**: incident management (mention; chronicle works at /root scale)

### Reading
- Google SRE Book: Postmortems, Incident Management chapters
- "Release It!" (Nygard): Stability Patterns
- Netflix Chaos Monkey origin paper
- "Chaos Engineering" (Casey Rosenthal + Nora Jones)

---

## 5. MASTERY: Reliability routines on basecamp

```
[ ] Quarterly DR drill scheduled and run at least once: destroy + recover one tier of basecamp
[ ] Velero backup of basecamp's K8s state; verified restore
[ ] Postgres point-in-time recovery practiced; documented runbook
[ ] Weekly chaos experiment (e.g., kill a random pod in a tier; observe self-healing)
[ ] Incident response template applied to at least one simulated incident
[ ] Blameless postmortem written for the simulated incident
[ ] List of every SPOF (single point of failure) in basecamp + recovery story for each
[ ] Graceful-degradation runbook for Redis-down, Postgres-down, Vault-down
[ ] Game day: new engineer (or future-you with amnesia) follows a runbook for a real failure mode; runbook improved based on gaps
[ ] All Arc 3 runbooks reviewed; flagged anything stale
```

---

## 6. COMPARE: Chaos Mesh vs Litmus

Install one chaos tool you haven't used. Run one experiment. Reflect on what each tool optimizes.

400-word reflection.

---

## 7. OPERATE

- 5-6 runbooks: DR drill template, chaos experiment template, postmortem template, restore-from-backup, incident commander script
- 2-3 ADRs (DR strategy per tier, backup retention policy, chaos cadence)
- Weekly log

---

## 8. CONTRIBUTE

- Chaos Mesh / Litmus docs
- Velero docs
- A blog post on a real chaos experiment that found something

---

## What ships from this phase

- **DR drills + chaos experiments on schedule**
- **Reliability runbooks**
- **At least one simulated postmortem**
- **Arc 3 portfolio complete**, ready for Arc 3 Final Exam

---

## Validation criteria

```
[ ] Quarterly DR drill ran successfully
[ ] Velero backup + verified restore
[ ] Weekly chaos experiment cadence established
[ ] One simulated incident with blameless postmortem
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 5-6 reliability runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - reliability-engineering → OUTLINE
    - disaster-recovery → OUTLINE
[ ] Exit Test passed
[ ] Arc 3 Final Exam prep can begin
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (75 min)
Run a chaos experiment of your design (with safe blast radius). Observe + recover. Write a runbook for the failure mode you exercised.

### Part 2: Articulate (75 min)
~1500 words: *"Walk basecamp's failure modes from most-likely to least-likely. For each: detection (which telemetry surfaces it), response (runbook), recovery (RTO), prevention (architectural change). Cite the resilience patterns from Arc 2 + Arc 3."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Backups never tested | Schrödinger's backup: maybe works, maybe doesn't |
| Runbooks written once never updated | Stale runbooks are worse than no runbooks |
| Chaos engineering only in non-prod | Real failures happen in prod. Test there too (carefully). |
| Postmortems that blame humans | The system let the human fail. Fix the system. |
| DR strategy on paper only | Theatre. Run the drill or assume it doesn't work. |

---

## Patterns touched this phase

- `reliability-engineering`: OUTLINE
- `disaster-recovery`: OUTLINE
- All Arc 2 resilience patterns reinforced

---

→ Next: [Arc 3 Final Exam](/program/arc-3/final-exam/)
