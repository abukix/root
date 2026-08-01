---
title: "HTTP, REST, gRPC & API Design"
description: "Phase 11 of /root Arc 2: API design as a deliberate engineering discipline. HTTP semantics, REST principles (Richardson maturity), gRPC trade-offs, API versioning, OpenAPI contracts. Add REST and gRPC APIs to your Arc 2 service.."
tags: [arc-2, backend, http, rest, grpc, api]
arc: 2
phase: 11
---

> Third phase of Arc 2. APIs as a contract.

APIs are the surface where your service meets the world. Designed well, they're easy to use, survive evolution, and document themselves. Designed badly, they leak implementation details, break consumers on every release, and require tribal knowledge to use. This phase teaches the discipline: HTTP at depth (because most APIs are HTTP-based), REST as more than "URLs with verbs," gRPC where it earns its weight, and the versioning hygiene that lets your API outlive its first version.

By phase end your Arc 2 service exposes a clean REST API with proper HTTP semantics, an OpenAPI contract, and a gRPC alternative for one or two endpoints. You've designed at least one endpoint that demonstrates Richardson Maturity Level 3 (hypermedia). You've thought through versioning. The API reads like a deliberately designed thing, not an accidental one.

---

## Prerequisites

> - [Phase 10](/program/arc-2/phase-10/) complete; Redis caching working
> - Your service has a basic HTTP interface (probably from earlier hacking); this phase makes it deliberate
> - You accept: **a well-designed API is engineering. "Just expose the database" is not an API.**

---

## Why this phase exists

Most backend engineers write APIs by accident: an endpoint per page, an endpoint per feature, no versioning strategy, error responses invented on the spot. The API works for the first six months and becomes a nightmare in year three when the third client integration reveals that nothing is consistent. Senior engineers design APIs deliberately, treating each endpoint as a long-lived contract with consumers.

This phase installs the deliberate-design discipline. By phase end you can defend your API's shape against a thorough code review.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

Other software needs to interact with your service. The interaction has shape: requests, responses, error states, evolution over time. The shape needs to be: predictable (consumers can guess), discoverable (consumers can explore), versioned (you can change it without breaking clients), and documented (consumers can read it).

That's the API design problem. REST is the dominant pattern (using HTTP semantics as the structure). gRPC is the strongly-typed binary alternative for service-to-service. GraphQL is a query-language alternative. WebSockets and SSE are the streaming variants. Each fits different scenarios.

---

## 2. PRINCIPLES

### 2.1 HTTP semantics at depth

HTTP defines methods (GET, POST, PUT, PATCH, DELETE), status codes (2xx, 3xx, 4xx, 5xx), headers (caching, content negotiation, auth), and the request/response lifecycle. Most APIs misuse HTTP. The well-designed ones lean *into* HTTP, treating it as their grammar.

**Investigate:**
- What's the difference between PUT (idempotent replace) and PATCH (partial update)? When do you reach for each?
- When do you return 200, 201, 202, 204, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504? What does each *mean*?
- What's content negotiation, and why does `Accept: application/json` matter?

### 2.2 REST and Richardson Maturity

Roy Fielding's REST is more than "URLs with verbs." Richardson Maturity Levels: Level 0 (one URL, RPC over HTTP), Level 1 (resources), Level 2 (resources + HTTP verbs), Level 3 (hypermedia / HATEOAS). Most "REST" APIs sit at Level 2; Level 3 is rare in practice.

→ Pattern: `rest-as-pattern`

**Investigate:**
- Walk the four maturity levels with examples.
- Why does Level 3 (hypermedia) appear rarely in practice? When does it earn its weight?
- What's "RESTish" vs strict REST, and why does the distinction matter for ecosystem tooling?

### 2.3 Resource modeling

REST APIs are organized around resources, not actions. `POST /users` creates a user. `DELETE /users/42` deletes one. `POST /users/42/cancel` is a *resource* (the cancellation action). The resource-noun mindset is where REST design lives.

**Investigate:**
- How do you model "send a password reset email" as a resource? (Hint: a password reset is a thing.)
- When do you create a sub-resource (`/users/42/orders`) vs a top-level collection (`/orders?user=42`)?
- What's the rule of thumb for plural vs singular resource names?

### 2.4 gRPC and RPC

gRPC is binary, strongly-typed (Protobuf), HTTP/2-based RPC. It's faster than REST at the wire level and gives you generated clients in every language. The cost: less discoverability (no curl-able URLs), tooling lock-in, less browser-friendly.

→ Pattern: `grpc-as-pattern`

**Investigate:**
- When does gRPC win over REST? (Hint: internal service-to-service, polyglot teams, performance-sensitive.)
- What's a Protobuf field tag, and why is it the contract for backward compatibility?
- How do you handle errors in gRPC? (Status codes, error details, custom error types.)

### 2.5 API versioning

Your API will change. Versioning is how you change it without breaking consumers. Strategies: URL versioning (`/v1/users`), header versioning (`Accept: application/vnd.api.v1+json`), query parameter (`?v=1`). Each has costs.

→ Pattern: `api-versioning`

**Investigate:**
- Why is URL versioning the most common despite being "least RESTful"?
- What's a breaking change, formally? (Hint: any change a well-behaved client wouldn't survive.)
- How do you deprecate a version? What's the sunset header?

### 2.6 OpenAPI as a contract

OpenAPI (the spec formerly known as Swagger) lets you describe your REST API in YAML or JSON. Generated docs, generated clients, contract tests: all flow from a good OpenAPI document.

**Investigate:**
- What's the difference between OpenAPI-as-docs (write spec from existing code) and OpenAPI-as-contract (write spec first, generate code)?
- How does contract testing (e.g., Schemathesis) prevent regressions?
- What's the equivalent for gRPC? (Protobuf definitions are the contract; tooling generates from them.)

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| API style | REST; gRPC; GraphQL; tRPC | REST: ubiquitous, HTTP-native. gRPC: fast, typed, service-to-service. GraphQL: flexible queries, complex backend. tRPC: TypeScript-tight, monorepo-friendly. |
| Framework (Python) | FastAPI; Litestar; Flask; Django REST | FastAPI: modern, async, OpenAPI native. Litestar: similar. Flask: simple, mature. Django REST: batteries-included. |
| Framework (Go) | `chi` + stdlib; `gin`; `echo`; `connect-go` (for connect-rpc / gRPC) | chi: minimal, idiomatic. gin/echo: middleware-rich. connect-go: gRPC + REST simultaneously. |
| Versioning | URL (`/v1/`); header; query param; no versioning | URL: ubiquitous. Header: pure REST. Query: hacky. None: rapid breaking changes inevitable. |
| Error format | RFC 7807 (Problem Details for HTTP APIs); custom JSON; google.rpc.Status | RFC 7807: standard. Custom: works, less interoperable. google.rpc: gRPC-style. |

---

## 4. TOOLS (as of 2026-06)

### REST frameworks
- **Python**: FastAPI (recommended), Litestar
- **Go**: `chi` + stdlib (recommended), `gin`, `echo`

### gRPC
- **Python**: `grpcio` + `grpcio-tools`
- **Go**: `grpc-go`, or `connect-go` (REST + gRPC simultaneously)

### Tooling
- **`openapi-generator`**: generate clients from OpenAPI spec
- **`Schemathesis`**: property-based testing against OpenAPI
- **`buf`**: Protobuf linting + breaking-change detection
- **`grpcurl`**: `curl` for gRPC services

### Reading
- "RESTful Web Services Cookbook" (Allamaraju): pragmatic REST patterns
- "REST API Design Rulebook" (Masse): terse, opinionated
- Roy Fielding's PhD thesis Chapter 5 (REST origin)
- gRPC docs + the Protobuf style guide

---

## 5. MASTERY: REST + gRPC for your service

### 5.1 The deliverable

Your Arc 2 service now exposes:

- A **clean REST API** with HTTP semantics applied correctly: GET for reads, POST/PUT/PATCH/DELETE for mutations, proper status codes, structured error bodies (RFC 7807 or similar)
- An **OpenAPI 3.1 spec** generated from or hand-authored alongside the code
- At least one **gRPC endpoint** for an internal-facing operation (the one that would benefit from typed binary RPC)
- **Versioning strategy** chosen and applied (URL or header)
- **API documentation** auto-generated from the OpenAPI spec (Swagger UI, Redoc, or similar)

### 5.2 Operational depth checklist

```
[ ] Audit your existing endpoints; identify ones using wrong HTTP verbs or status codes
[ ] Apply RFC 7807 (or similar) error format across all endpoints
[ ] Hand-author or generate an OpenAPI 3.1 spec; verify it matches reality
[ ] Add one gRPC endpoint; define the Protobuf schema; generate clients in both Python and Go
[ ] Use `buf` to lint Protobuf and catch breaking changes
[ ] Run `Schemathesis` (or equivalent) contract tests against your REST API
[ ] Implement API versioning; document the version sunset policy
[ ] Add `Accept-Language` or `Accept` content negotiation for one endpoint
[ ] Document the API in the repo README with curl examples
[ ] Read the OpenAPI spec of a well-known API (e.g., Stripe) for reference
```

---

## 6. COMPARE: GraphQL or tRPC

Pick one:

- **GraphQL**: implement one query endpoint in GraphQL (Strawberry for Python, gqlgen for Go). Compare against REST.
- **tRPC**: if your service has a JS/TS frontend, expose one endpoint via tRPC.

400-word reflection on what each style optimizes.

---

## 7. OPERATE

- 2-3 runbooks: "API returning wrong status code in production," "gRPC service returning UNKNOWN", "OpenAPI spec drifted from code"
- 1+ ADR (e.g., "Why REST + gRPC vs gRPC-only" or "Why URL versioning over header versioning")
- Weekly log

---

## 8. CONTRIBUTE

- FastAPI / Litestar / chi / gin / echo: docs or examples
- OpenAPI Initiative: spec clarifications
- `buf`: small fix or doc

---

## What ships from this phase

- **Arc 2 service with REST + gRPC APIs + OpenAPI contract**
- **API runbooks** in `chronicle`
- **Pattern OUTLINEs**: REST, gRPC, API versioning

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1 (HTTP semantics)
           Audit existing endpoints; fix status codes + verbs

Week 2     PRINCIPLES 2.2-2.3 (REST, resource modeling)
           Refactor URLs to resource model; RFC 7807 errors

Week 3     PRINCIPLES 2.4 (gRPC)
           Add first gRPC endpoint; Protobuf schema

Week 4     PRINCIPLES 2.5-2.6 (versioning, OpenAPI)
           Versioning strategy; OpenAPI spec authored
           Contract testing with Schemathesis

Week 5     COMPARE: GraphQL or tRPC
           chronicle runbooks

Week 6-7   OPERATE + CONTRIBUTE
           Exit Test
```

---

## Validation criteria

```
[ ] Arc 2 service exposes clean REST API + OpenAPI spec
[ ] At least one gRPC endpoint operational
[ ] Versioning strategy applied
[ ] Contract tests running in CI
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 API runbooks
[ ] 1+ ADR
[ ] Pattern entries deepened STUB → OUTLINE:
    - rest-as-pattern
    - grpc-as-pattern
    - api-versioning
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Design + Build (90 min)
Design a new endpoint (spec provided) using REST principles. Pick the right HTTP method, status codes, error format. Add it to your service. Update the OpenAPI spec. Add at least one Schemathesis test.

### Part 2: Diagnose (45 min)
An API scenario (provided: e.g., "consumers report random 500 errors only when sending PATCH requests with Content-Type: application/merge-patch+json"). Identify root cause.

### Part 3: Articulate (15 min)
~400 words: *"When would you reach for gRPC over REST? Walk through one endpoint in your service that's a good gRPC candidate and one that should stay REST."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Returning 200 for everything | Status codes ARE part of the API contract |
| `GET /users/getUser?id=42` style | RPC-over-HTTP. You're paying REST costs without REST benefits. |
| No versioning strategy | Every change becomes a breaking change |
| Auto-generated OpenAPI without review | Drift between spec and code is a common bug source |
| "REST" without thinking about resources | Verbs in URLs (`/createUser`) is the giveaway |

---

## Patterns touched this phase

- `rest-as-pattern`: first OUTLINE
- `grpc-as-pattern`: first OUTLINE
- `api-versioning`: first OUTLINE

---

→ Next: [Phase 12: Authentication & Authorization](/program/arc-2/phase-12/)
