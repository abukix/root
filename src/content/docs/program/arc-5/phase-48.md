---
title: "Agent Runtime + MCP"
description: "Phase 48 of /root Arc 5: agents that use tools through the Model Context Protocol. Agent loops, structured outputs, evals at scale, MCP servers exposing basecamp's surface. `loom` MCP fabric complete — agents call `ascent`, `crag`, and `chronicle` via MCP.."
tags: [arc-5, ai, agents, mcp, tool-use]
arc: 5
phase: 48
---

> Tenth phase of Arc 5. Agents that actually use the platform.

[Phase 46](/program/arc-5/phase-46/) built the gateway LLMs talk through. This phase builds the layer where LLMs *take action*: an agent runtime that loops over reasoning and tool calls, with the **Model Context Protocol (MCP)** as the tool interface. By phase end basecamp has agents that can read its runbooks, query the data tier, and trigger paved-road deploys through `ascent`, all via MCP servers you author.

This is where Arc 3's `ascent` (Phase 26) + Arc 4's data tier + Arc 5's LLM serving + the operator pattern all compose. Agents talk through MCP servers that expose basecamp's surface as typed tools. The senior-IC signal.

---

## Prerequisites

> - [Phase 47](/program/arc-5/phase-47/) complete; prompts as infrastructure
> - Anthropic API access (Claude has strongest tool-use surface in 2026)
> - Phase 4 Python fluency + Arc 3 K8s + Arc 5 LLM serving

---

## Why this phase exists

Agents that use tools are the practical face of LLM applications in 2026. Code-writing agents (Cursor, Claude Code), customer-support agents, research agents, agentic coding at frontier labs: all use the same pattern: model + structured tool calls + a loop. MCP standardizes the tool interface. This phase makes it production-shape on basecamp.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have an LLM (via `prism`). You want it to take action: query a database, read a file, call an API, deploy a service, search a corpus. The LLM doesn't have those abilities itself; it generates text. The bridge is *tool use*: the model generates a structured request to call a function; your runtime executes; the result goes back; the loop continues.

---

## 2. PRINCIPLES

### 2.1 The agent loop

The canonical loop: (1) model reasons over context, (2) model emits either an answer or a tool call, (3) if tool call, runtime executes and appends the result, (4) loop. Terminates on answer, max iterations, or error.

→ Pattern: `agent-loop`: **DEEP target this phase**

**Investigate:**
- What's the difference between a *workflow* (DAG, predetermined path) and an *agent* (model decides each step)?
- What termination conditions does a well-shaped agent loop need?
- When is a workflow the right answer instead of an agent? (Hint: most of the time.)

### 2.2 Tool use

Tools are typed function signatures the model can request. The runtime executes; the result goes back.

→ Pattern: `tool-use`: **DEEP target this phase**

**Investigate:**
- What makes a good tool surface? (Narrow, well-typed, fail loudly.)
- Why is "give the LLM database access" almost always wrong, vs "give the LLM a specific query tool with parameters"?
- JSON Schema role in tool definitions; how do Claude / GPT differ?

### 2.3 The Model Context Protocol (MCP)

MCP is an open protocol (Anthropic-stewarded) for exposing tools to LLM clients. An MCP *server* exposes tools, resources, prompts. An MCP *client* (the agent runtime) discovers and uses them.

→ Pattern: `mcp-protocol`

**Investigate:**
- What's the structure of an MCP server (tools / resources / prompts as the three primitives)?
- Why is MCP transport-agnostic (stdio, HTTP)?
- When is MCP overkill (single-tool integration) vs essential (many tools, many agents)?

### 2.4 Structured outputs at agent scale

When the model produces data the runtime parses, structured outputs (Phase 47) become essential. Tool calls themselves are structured outputs.

**Investigate:**
- Walk a tool-call generation: model produces JSON matching tool schema → runtime parses + executes.
- Why is forced structured output a non-negotiable for agents?
- What happens if 5% of outputs malform? How does the agent loop break?

### 2.5 Agent evals at scale

Agent evals: tool-use correctness (right tool?), output validity (right answer?), behavioral (refuses appropriately?), trajectory (loop terminates efficiently?).

→ Pattern: `evals` reinforced

**Investigate:**
- Why is "model-graded" (LLM-as-judge) the standard for open-ended agent tasks?
- Known failure modes of LLM-as-judge (length bias, position bias, self-preference)?
- How do you build a golden set that doesn't go stale?

### 2.6 Agent security (deepens Phase 49)

The agent is a new attack surface. Prompt injection, jailbreaks, tool-use escalation, output exfiltration. Capability allowlisting + content filters are the defenses.

**Investigate:**
- What's prompt injection, and what's the canonical defense (separating instructions from data, output filters)?
- What does capability allowlisting look like (agent can only call tools in its allowlist)?
- How does Anthropic's Constitutional AI compose with your own filters?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Agent framework | **LangGraph**; raw SDK + custom; CrewAI; AutoGen | LangGraph: mature, graph-oriented (recommended). Raw: control. Multi-agent frameworks: niche. |
| Tool surface | **MCP**; framework-specific; custom JSON | MCP: portable, future-proof (recommended). |
| Model | Claude (best tool-use); GPT (good general); local (smaller open-weights) | Cost vs capability vs control. |
| Eval framework | **Promptfoo / Inspect**; LangSmith; custom | OSS (recommended). |

---

## 4. TOOLS (as of 2026-06)

- **Anthropic Claude** via `prism`: primary model
- **LangGraph** + **MCP Python SDK**: agent runtime + protocol
- **MCP servers** you author for ascent, chronicle, crag
- **Promptfoo / Inspect**: eval framework
- **OpenTelemetry + Grafana**: runtime tracing

### Reading
- Anthropic Tool Use docs: current
- MCP spec: architecture section, twice
- "AI Engineering" (Chip Huyen): agents chapter
- "Prompt Injection Attacks and Defenses" (Greshake et al.): survey paper

---

## 5. MASTERY: Agent runtime + 3 MCP servers

### 5.1 The deliverable

LangGraph + MCP, with three MCP servers exposing basecamp's operational surface:

1. **`mcp-chronicle`**: runbooks, postmortems, ADRs, weekly logs as MCP resources. Agent reads them.
2. **`mcp-crag`**: Iceberg tables via Trino as a `query` tool. Agent runs analytical queries.
3. **`mcp-ascent`**: subset of `ascent new service` as a tool. **Approval-gated** (agent proposes, human approves).

Plus an agent: given "summarize last week's incidents," uses mcp-crag + mcp-chronicle; given "draft a new service called X," uses mcp-ascent with approval.

### 5.2 Ship bar

Agent runtime + 3 MCP servers are public. Together: a platform engineer chats with the agent ("what's been happening with beacon this week?"), agent uses MCP tools, summarizes. Then ("can you draft a new service called audit-archive?"), agent uses ascent through MCP with approval.

Volume: ~2000-4000 lines Python. Multi-week phase.

### 5.3 Operational depth checklist

```
[ ] LangGraph agent loop working with Claude via prism
[ ] Three MCP servers operational: chronicle, crag, ascent
[ ] Agent reads a runbook and applies to a scenario
[ ] Agent runs an Iceberg query and summarizes
[ ] Agent proposes ascent action; human approval gate works
[ ] Prompt injection test: malicious runbook entry tries to subvert; defenses hold
[ ] Capability allowlist: agent can't call tools outside scope
[ ] Eval suite: 30+ scenarios; scored; regression-tracked
[ ] Trajectory eval: loop terminates within expected iterations
[ ] OTel traces show full reasoning + tool-call decision history
```

---

## 6. COMPARE: LangChain agents or CrewAI

Run same agent shape with LangChain's older `AgentExecutor` or CrewAI multi-agent. Reflect.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: agent loop stuck, MCP server hang, eval regression, prompt injection detected, capability escalation attempt
- 2-3 ADRs (MCP over framework-specific; human-in-loop for ascent)
- Weekly log

---

## 8. CONTRIBUTE

- MCP servers (anthropic-mcp-servers ecosystem)
- LangGraph examples / docs
- Promptfoo / Inspect eval definitions

---

## What ships from this phase

- **`loom` complete**: agent runtime + 3 MCP servers operational
- **MCP servers public on GitHub**
- **Eval suite**: 30+ scenarios, regression-tracked

---

## Validation criteria

```
[ ] Agent runtime + 3 MCP servers operational
[ ] MCP servers public
[ ] Eval suite ≥30 scenarios; regression-tracked
[ ] Prompt injection + capability scoping verified
[ ] All 10 operational depth checks
[ ] LangChain/CrewAI compare (400 words)
[ ] 4-5 runbooks
[ ] 2-3 ADRs
[ ] Pattern entries:
    - agent-loop → DEEP
    - tool-use → DEEP
    - mcp-protocol → OUTLINE
    - structured-outputs reinforced
    - evals deepened
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3.5 hours.**

### Part 1: Build (120 min)
Add a new MCP tool to ascent server: `list-services-with-slo-breach`. Wire into agent allowlist. Verify agent uses correctly when asked "which services are burning their error budget right now?" Add 5 new eval scenarios.

### Part 2: Diagnose (60 min)
An agent regression scenario (e.g., "agent that worked yesterday now loops until max-iterations"). Possible: model behavior changed; MCP server returning malformed; system prompt drift.

### Part 3: Articulate (30 min)
~800 words: *"Defend requiring human approval on ascent actions. Cover blast radius, prompt injection scenarios, capability allowlisting, when full automation would be safe."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Agent calling `kubectl` directly | Surface should be paved-road, not raw infra |
| Skipping eval suite | Regressions silent; you won't know |
| Full automation of ascent from day one | Human approval is cheap insurance |
| Loose system prompts ("be helpful") | Vague prompts = vague behavior |
| One giant tool that does many things | Many narrow tools beat one wide tool |

---

## Patterns touched this phase

- `agent-loop`: **DEEP**
- `tool-use`: **DEEP**
- `mcp-protocol`: OUTLINE
- `structured-outputs` reinforced
- `evals` deepened

---

→ Next: [Phase 49: AI Security + AI Observability](/program/arc-5/phase-49/)
