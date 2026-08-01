---
title: "AIOps: warden"
description: "Phase 50 of /root Arc 5: agents that operate the platform. AIOps on the chronicle corpus. pgvector indexing of postmortems. Incident beacon via agents through MCP. `warden` (AIOps) comes alive. The final phase before the Arc 5 capstone.."
tags: [arc-5, ai, warden, agents, operator]
arc: 5
phase: 50
---

> Twelfth phase of Arc 5. Agents that operate the platform.

This is the AI tier's closing move: agents that **operate basecamp** using the corpus you've built across 5 years. The `chronicle` is now ~250 weekly logs, ~25 postmortems, ~140 runbooks, ~15 ADRs: a real corpus. Phase 50 builds agents that index it (pgvector embeddings), reason over it (RAG to retrieve relevant past incidents), and propose actions through MCP (Phase 48).

By phase end basecamp.s AIOps module `warden` is alive. Incidents are triaged by agents that read past postmortems, identify similar patterns, and propose runbook execution. Humans approve destructive actions; agents handle the rest. The platform-engineering + AIOps pattern at homelab scale.

This is also the substrate for the [Arc 5 Capstone](/program/arc-5/final-exam/): vantage's AIOps panel renders agent activity to the user.

---

## Prerequisites

> - All Arc 5 Phase 39-49 complete; `prism` + `loom` + AI security operational
> - `chronicle` has substantial corpus (~5 years of weekly logs at this point)

---

## Why this phase exists

AIOps is the practical face of AI applied to platform operations. Agents that read your runbooks + postmortems + telemetry, identify similar past incidents, propose beacon steps. Frontier-lab platform teams all build internal variants. The pattern works because **you have a rich, structured, time-series corpus**: your `chronicle` is exactly that.

This phase also closes the operator-pattern arc. Phase 26 you built `ascent + custom kubebuilder operator`. Phase 50 builds another custom operator: `warden` watches alerts, dispatches agents to beacon, surfaces results through the same K8s API.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

basecamp runs 5+ years of operations. The `chronicle` holds the institutional knowledge. New incidents recur: variations of past ones. Without AIOps: every incident is investigated cold; experienced engineers' time is consumed in pattern-matching. With AIOps: agents do the pattern-match; humans handle judgment + destructive actions.

---

## 2. PRINCIPLES

### 2.1 The AIOps loop

Alert fires → agent retrieves similar past postmortems via vector search → reasons over them → proposes beacon steps → human approves destructive actions → agent executes through `ascent` (Phase 26) MCP.

→ Pattern: `warden`: OUTLINE this phase

**Investigate:**
- Walk an AIOps loop: alert from Prometheus → trigger agent → retrieve postmortems → propose → approve → execute.
- What's the "first three beacon questions" pattern, encoded as a Kyverno policy or agent system prompt?
- When does human-in-the-loop slow down acceptable response?

### 2.2 chronicle as the corpus

5 years of `chronicle` is a substantial RAG corpus. ~250 weekly logs + ~25 postmortems + ~140 runbooks + ~15 ADRs. Embed it all into pgvector; serve via Phase 42's RAG endpoint.

→ Pattern: `rag-as-pattern` reinforced

**Investigate:**
- For your `chronicle`: what's the right chunking strategy?
- How do you keep the corpus fresh (continuous embedding pipeline)?
- What's the value of structured metadata (incident_type, severity, service_affected) alongside the embeddings?

### 2.3 Trajectory bounding

Agents must not loop forever. Max iterations, max cost, max time. Trajectory eval ensures agents converge.

→ Pattern: `agent-loop` reinforced

**Investigate:**
- What's the right max-iteration budget for a beacon agent? (Hint: 5-10, not 100.)
- How do you detect a stuck agent vs a slow agent?
- When does the agent give up and escalate to human?

### 2.4 Approval gates for destructive actions

Reading is free. Writing is dangerous. Approval gates partition agent actions: read-only allowed; restart/scale/delete requires human OK.

**Investigate:**
- Walk approval gate UX: agent proposes → Slack/email/vantage → human approves → execution.
- What's the right approval SLA?
- When does pre-approved automation make sense (within blast radius limits)?

### 2.5 AIOps as another custom operator

`warden` is a custom kubebuilder operator (like Phase 26's platform operator). It watches `IncidentReport` CRDs that fire from Prometheus alerts, reconciles them into agent runs.

→ Pattern: `operator-pattern` reinforced toward DEEP

**Investigate:**
- Walk the `IncidentReport` CRD: alert fires → CRD created → AIOps operator notices → agent runs.
- How does the operator handle agent failure (retry, escalate)?
- Why is "AIOps as operator" the right K8s-native shape?

### 2.6 The full program's patterns compose here

Phase 50 is where everything composes: Phase 17 OS internals (debugging), Phase 20 K8s + GitOps (state), Phase 22 IaC (provisioning fix), Phase 26 custom operator (the AIOps operator itself), Phase 28 observability (the alert source), Phase 38 KServe (the LLM inference), Phase 42 RAG (the corpus retrieval), Phase 46 prism (the model access), Phase 48 agent runtime + MCP (the tool execution), Phase 49 AI security (the safety layer).

**Investigate:**
- For one synthetic incident, walk every prior pattern that participates in the AIOps response.
- Which patterns are load-bearing? Which are nice-to-have?
- What would break the loop, and which prior phases would you call first?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| AIOps deployment | **Custom kubebuilder operator**; standalone service; agent without operator | Custom operator: K8s-native (recommended). Standalone: simpler. |
| Action scope | Read-only; read + approve writes; full automation | Read + approve (recommended); full automation only for low-risk + pre-approved. |
| Trigger source | Prometheus alerts; PagerDuty integration; Slack mentions | Prometheus (recommended; native); others as additions. |

---

## 4. TOOLS (as of 2026-06)

- **kubebuilder**: for the AIOps operator
- **LangGraph**: agent runtime (from Phase 48)
- **pgvector**: corpus retrieval (from Phase 42)
- **`prism`**: LLM access (from Phase 46)
- **MCP servers**: tool surface (from Phase 48)
- **Prometheus AlertManager**: alert source
- **Slack/Discord webhook**: approval UX

### Reading
- "AIOps in Practice": various engineering blogs (New Relic, Datadog)
- Anthropic on agent design: current best practices
- Public KubeCon / SREcon talks on agents-in-production

---

## 5. MASTERY: `warden` alive on basecamp

```
[ ] Custom AIOps kubebuilder operator deployed via Flux
[ ] IncidentReport CRD defined; reconciler triggers agent runs
[ ] pgvector indexed `chronicle` corpus (continuous update via Argo CronWorkflow)
[ ] Agent retrieves top-5 similar past incidents for a new alert
[ ] Agent proposes beacon steps + cites postmortem references
[ ] Approval gate for destructive actions (Slack webhook or vantage UI)
[ ] Read-only actions (curl health endpoint, run `kubectl describe`) automated
[ ] Trajectory eval: agents converge within 10 iterations on benchmark scenarios
[ ] Mean time to beacon: measure baseline (human-only) vs AIOps-assisted
[ ] AIOps OTel traces visible in Grafana
```

---

## 6. COMPARE: PagerDuty AIOps or Datadog Watchdog

Read about one managed AIOps offering. Reflect on what's gained vs what's lost via your own implementation.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: agent loop stuck, false-positive beacon, corpus index stale, approval gate broken, hallucinated postmortem reference
- 2-3 ADRs (custom operator over standalone; approval scope; corpus update cadence)
- Weekly log

---

## 8. CONTRIBUTE

- LangGraph agent patterns
- A public AIOps blog post: what worked, what didn't

---

## What ships from this phase

- **`warden` alive on basecamp**: custom operator + agent + corpus indexing
- **AIOps runbooks**
- **Full Arc 5 portfolio complete**: ready for Arc 5 Capstone + Final Exam

---

## Validation criteria

```
[ ] AIOps custom operator deployed
[ ] IncidentReport CRD + agent reconciliation working
[ ] chronicle corpus indexed and queryable
[ ] Approval gates functional
[ ] At least one real or simulated incident triaged by AIOps successfully
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - warden → OUTLINE
    - agent-loop reinforced
    - rag-as-pattern reinforced
    - operator-pattern reinforced toward DEEP
[ ] Exit Test passed
[ ] Arc 5 Capstone prep can begin
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Define a new IncidentReport scenario in a YAML CRD. Verify the AIOps operator picks it up, dispatches an agent, retrieves similar postmortems, proposes beacon. Approve a safe action; verify execution.

### Part 2: Diagnose (60 min)
An AIOps scenario (e.g., "AIOps proposed wrong runbook for an incident; investigate"). Possible: corpus drift; retrieval failure; agent hallucination.

### Part 3: Articulate (30 min)
~800 words: *"Walk an alert through basecamp's full AIOps pipeline. Cite every prior /root phase that contributes. Show how 5 years of patterns compose into one operational capability."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Full automation of destructive actions from day one | One agent error = production outage |
| Stale corpus | Agent retrieves obsolete postmortems |
| No trajectory bounds | Agent loops forever; cost explodes |
| Trusting agent output without citation | "Agent said X" is not evidence; cite the postmortem |

---

## Patterns touched this phase

- `warden`: OUTLINE
- `agent-loop` reinforced
- `rag-as-pattern` reinforced
- `operator-pattern` reinforced toward DEEP

---

→ Next: [Arc 5 Capstone + Final Exam: vantage MVP + Pattern Paper](/program/arc-5/final-exam/)
