---
title: "Authentication & Authorization"
description: "Phase 12 of /root Arc 2: identity for your service. Sessions vs tokens, OAuth 2.0, OIDC, JWT, password hashing, RBAC + beyond. Add real auth to your Arc 2 service.."
tags: [arc-2, backend, auth, security]
arc: 2
phase: 12
---

> Fourth phase of Arc 2. Identity becomes part of the contract.

Most backend engineers handle auth the same way: install a library, copy a tutorial, hope it's right. This phase teaches the alternative: auth from first principles. Why session vs token, what JWTs actually carry, how OAuth 2.0's flows differ, when RBAC is enough vs when you need ABAC, how passwords should be hashed (and why "we don't store passwords plaintext" is a low bar). By phase end your Arc 2 service has *real* auth, not "I followed the FastAPI security tutorial" auth.

The AI-tier surface (`prism`, `loom`) in Arc 5 + the platform surface in Arc 3 will both reuse auth patterns from this phase. Getting it right now means not redoing it three times.

---

## Prerequisites

> - [Phase 11](/program/arc-2/phase-11/) complete; REST + gRPC operational
> - You have a use case in your service that needs auth (users, admin actions, ownership)
> - You accept: **auth is engineering, not a library import. The library implements the pattern; you must understand the pattern.**

---

## Why this phase exists

Authentication bugs ship to production constantly. The reasons are predictable: confused tokens vs sessions, JWTs accepted without verification, OAuth flows implemented from blog posts, password hashing using yesterday's algorithms, RBAC checks scattered through the codebase, secret-rotation never happens. Each is a vulnerability waiting to be discovered.

Senior engineers reason about auth as a *system*: where identity is established, where it's verified, where authorization happens, what the failure modes are, how secrets rotate. This phase installs that mental model.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

Some operations in your service are sensitive. They should be performed by specific identities, with specific permissions, in specific contexts. The service needs to *prove* the request comes from who it claims, then *decide* whether that identity is allowed to do what's requested.

That's the auth problem. Authentication (AuthN) proves identity; authorization (AuthZ) decides permissions. They're often conflated; they're different mechanisms. Sessions, OAuth, JWTs, API keys, mTLS: these are AuthN implementations. RBAC, ABAC, policy engines: these are AuthZ.

---

## 2. PRINCIPLES

### 2.1 AuthN vs AuthZ

AuthN: "who are you?" AuthZ: "what can you do?" Conflating them creates security holes. Most well-architected systems separate them clearly: a middleware authenticates (extracts identity from session/token/header), then handlers (or a policy engine) authorize.

**Investigate:**
- Walk a request through your service: where does AuthN happen? Where does AuthZ happen?
- What's the failure mode of skipping AuthZ when AuthN passes? (Hint: any authenticated user can do anything.)
- Why is "authenticated == authorized" the most common security bug?

### 2.2 Sessions vs tokens

Sessions: server stores session state, client holds a session ID (typically in a cookie). Tokens: client holds a signed token (typically JWT); server verifies the signature on each request. Each has trade-offs.

→ Pattern: `token-vs-session`

**Investigate:**
- What does session-based auth require server-side? (Hint: session store, sticky sessions OR shared store.)
- What does JWT auth give up? (Hint: easy revocation.)
- When is "stateless JWT" actually appropriate? When does session win?

### 2.3 Password hashing (when you do password auth)

Storing password hashes (not plaintext) is necessary but not sufficient. The hash must be slow (`bcrypt`, `argon2id`, `scrypt`) to resist offline brute force. The hash must include a salt. The hash must be parameterized so you can increase work factor over time.

**Investigate:**
- Why is SHA-256 *not* a password hash? (Hint: too fast.)
- What's argon2id's threat model, and why is it the current default recommendation?
- What's a peppered hash, and when does it earn its weight?

### 2.4 OAuth 2.0 and OIDC

OAuth 2.0 is the protocol for *delegating* access ("let App X read my Google Drive"). OIDC is OAuth 2.0 plus an identity layer. The flows (authorization code, PKCE, client credentials, device code) each fit a context.

→ Pattern: `oauth-flow`

**Investigate:**
- Walk the authorization code flow with PKCE step by step. Why is PKCE needed for public clients?
- When do you use client credentials flow (service-to-service)?
- What's an ID token vs an access token? Why are they different?

### 2.5 JWTs and their pitfalls

JWTs are signed tokens with claims. They look simple; they're full of footguns. `alg: none` was a real vulnerability in early libraries. JWTs are hard to revoke. JWTs carry their state, which can leak.

**Investigate:**
- What's `alg: none`, and what's the canonical defense?
- Why does "long-lived JWT" usually become "we have an auth bug we can't fix without breaking everyone"?
- What's a refresh token, and how does it solve JWT's revocation problem?

### 2.6 RBAC and beyond

Role-Based Access Control: users have roles; roles have permissions. Simple, common, works for most cases. Attribute-Based Access Control (ABAC) and Policy-Based Access Control (PBAC, e.g., OPA/Rego) handle more nuanced cases ("user can edit their own posts," "admin can act on Tuesday").

→ Pattern: `rbac`

**Investigate:**
- When is RBAC sufficient? When does it fall apart?
- What's an ABAC rule that RBAC can't express?
- What's the OPA + Rego pattern, and when is it worth the operational complexity?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Session vs token | Session (cookie + store); JWT; opaque token + introspection | Session: revocable, requires store. JWT: stateless, revocation is hard. Opaque + introspection: middle ground, server load. |
| Identity provider | Self-hosted (Keycloak, Authentik); managed (Auth0, Clerk, Cognito); roll-your-own | Self-hosted: full control, ops cost. Managed: convenience, vendor cost. Roll-your-own: maximum risk, almost never right. |
| Password hash | argon2id; bcrypt; scrypt | argon2id: current default. bcrypt: still acceptable. scrypt: less common but valid. |
| Authorization model | RBAC; ABAC; OPA + Rego; row-level security in DB | RBAC: simple. ABAC: expressive. OPA: external policy engine. RLS: pushed into DB. |
| MFA | Required; optional; not implemented | Required: best security, user friction. Optional: balance. None: don't ship to anyone real. |

---

## 4. TOOLS (as of 2026-06)

### Auth libraries
- **Python**: `python-jose` (JWT), `authlib` (OAuth client), `passlib[argon2]` (hashing); `Authentik` or `Keycloak` for self-hosted IdP
- **Go**: `golang-jwt/jwt/v5`, `oauth2`, `crypto/bcrypt` or `argon2id` libraries

### Standards
- OAuth 2.0 (RFC 6749) + PKCE (RFC 7636)
- OIDC core
- JWT (RFC 7519) + JWS (RFC 7515)
- RFC 7807 for auth error responses

### Reading
- "OAuth 2 in Action" (Richer + Sanso)
- "API Security in Action" (Madden): the canonical practical book
- Auth0 docs + Okta blog (educational, vendor-neutral on the protocol level)
- The OWASP Authentication Cheat Sheet

---

## 5. MASTERY: Real auth in your Arc 2 service

### 5.1 The deliverable

Pick one of two paths based on your service's shape:

**Path A: User-facing service**:
- Add session-based or JWT-based auth for end users
- Password hashing with argon2id
- Email-based password reset flow (you can email yourself via SMTP locally)
- RBAC with at least two roles (e.g., `user` and `admin`)
- Authorization checks on protected endpoints
- Optional: MFA via TOTP

**Path B: Service-to-service**:
- Add OAuth 2.0 client credentials flow for service-to-service calls
- JWT-based access tokens with short TTL + refresh tokens
- Token introspection or signature verification
- Scopes for fine-grained authorization
- Mutual TLS (mTLS) as an optional alternative

Both paths require: documented threat model, secret rotation runbook, ADR explaining the choices.

### 5.2 Operational depth checklist

```
[ ] Pick session vs token; document the rationale
[ ] Implement password hashing with argon2id (Path A)
[ ] Implement JWT or opaque token issuance; verify signature on every request (Path A or B)
[ ] Add at least 2 roles; enforce on at least 3 endpoints
[ ] Audit your existing endpoints; identify any that should be protected but aren't
[ ] Write a token-revocation runbook (Path A or B)
[ ] Implement secret rotation: token signing key rotation without downtime
[ ] Use HTTPS even locally (mkcert or similar); get used to TLS being normal
[ ] Set secure cookie flags: HttpOnly, Secure, SameSite=Lax (Path A)
[ ] Read at least one OWASP security cheat sheet relevant to your auth scheme
```

---

## 6. COMPARE: OPA + Rego (or row-level security)

Pick one:

- **OPA + Rego**: install OPA, write a few Rego rules, integrate one endpoint via OPA
- **Postgres Row-Level Security**: push one authorization rule into the database

400-word reflection on when each fits.

---

## 7. OPERATE

- 3-4 runbooks: "Revoke a compromised token," "Rotate the signing key," "Diagnose 'why is this 403'", "Suspicious login activity"
- 2+ ADRs: session vs token; RBAC model
- Weekly log

---

## 8. CONTRIBUTE

- An OAuth 2.0 / OIDC library: docs or examples
- A small fix to Authentik / Keycloak docs
- OWASP cheat-sheet contribution

---

## What ships from this phase

- **Arc 2 service with real auth** (session or token + RBAC) + threat model documented
- **Auth runbooks** in `chronicle`
- **Pattern OUTLINEs**: token-vs-session, oauth-flow, RBAC

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (AuthN vs AuthZ, sessions vs tokens)
           Pick session or token; design the threat model

Week 2     PRINCIPLES 2.3 (password hashing)
           argon2id implemented (Path A) OR token issuance (Path B)

Week 3     PRINCIPLES 2.4 (OAuth + OIDC)
           OAuth flow implemented if applicable

Week 4     PRINCIPLES 2.5 (JWTs and pitfalls)
           JWT verification end-to-end; revocation strategy

Week 5     PRINCIPLES 2.6 (RBAC)
           Roles + authorization checks; key rotation

Week 6     COMPARE: OPA or RLS
           chronicle runbooks

Week 7     OPERATE + CONTRIBUTE
           Exit Test
```

---

## Validation criteria

```
[ ] Arc 2 service has working auth + authorization
[ ] Threat model documented
[ ] Key rotation runbook + practiced once
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 auth runbooks
[ ] 2+ ADRs
[ ] Pattern entries deepened STUB → OUTLINE:
    - token-vs-session
    - oauth-flow
    - rbac
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Add a new protected endpoint to your service with role-based access (spec provided). Verify with curl using a valid token, an expired token, a wrong-role token. All four cases produce correct status codes.

### Part 2: Diagnose (45 min)
An auth scenario (provided: e.g., "valid logins suddenly returning 401 for a subset of users"). Possible causes: clock skew on JWT exp; signing key rotated incompletely; cache poisoning; CORS misconfiguration.

### Part 3: Articulate (15 min)
~400 words: *"You're asked to add 'API keys for external integrations' to your service. Walk through the design: how keys are issued, scoped, rotated, revoked. Cite the patterns."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| `if user.is_authenticated` as the only check | Authenticated ≠ authorized |
| Long-lived JWTs without revocation strategy | One leaked token = permanent compromise until expiry |
| Auth logic scattered across endpoints | Inconsistency → security holes. Centralize. |
| Roll-your-own crypto | Use libraries. The crypto is hard; the integration is hard enough. |
| Skipping HTTPS locally "because it's local" | Habits matter. Production deploys what you practiced. |

---

## Patterns touched this phase

- `token-vs-session`: first OUTLINE
- `oauth-flow`: first OUTLINE
- `rbac`: first OUTLINE

---

→ Next: [Phase 13: Containers as a User](/program/arc-2/phase-13/)
