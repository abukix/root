# /root program ADRs

Architecture Decision Records for the **program itself**: how /root is operated, what conventions apply across the Abukix workspace, what's been deliberately deferred.

These are distinct from:
- **basecamp ADRs**: live in `basecamp/docs/adrs/` when basecamp materializes at Arc 3 Phase 20. Capture platform architecture decisions (Flux over ArgoCD, Cilium over Istio, Iceberg over Delta Lake).
- **Module-level ADRs**: each basecamp module and Arc 1 tool keeps its own `adrs/` inside its own repo. Capture module-specific decisions.

This `adrs/` directory holds the small set of decisions that govern the **Abukix workspace** itself; they're upstream of every basecamp module and Arc 1 tool.

## Registry

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](./0001-solo-operator-with-disciplined-review.md) | Solo operator with disciplined review (no fake-team multi-account) | accepted | 2026-06-30 |
| [0002](./0002-curriculum-site-v0-framework-and-stack.md) | Curriculum site v0 — framework, deployment, domain, and identity stack | accepted | 2026-06-30 |

## Numbering

Four-digit zero-padded. Sequential. **Never** renumber; **never** reuse a number, even for superseded ADRs.

## Lifecycle

```
proposed   → drafting; not yet committed to.
accepted   → decision made, in effect.
deprecated → no longer preferred but legacy may still follow it.
superseded → replaced by a newer ADR (link forward via `superseded_by` frontmatter).
```

Once an ADR is `accepted`: **do not edit the body** to reflect later changes. Write a new ADR with `supersedes: <number>` and mark the old one `superseded`. The historical record is the value.

## Template

See `meta/adr-template` *(ports in v0.3.0)* for the structure every entry follows [TODO: link].
