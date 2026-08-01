---
title: "Redis & Caching Patterns"
description: "Phase 10 of /root Arc 2: caching patterns from first principles. Cache-aside, write-through, write-behind, TTL strategy, stampede protection, eviction policies. Add Redis caching to your Arc 2 service.."
tags: [arc-2, backend, redis, caching]
arc: 2
phase: 10
---

> Second phase of Arc 2. Caching as a deliberate engineering choice.

Most engineers add caching the same way: a performance issue surfaces, someone says "let's cache it," Redis appears in the stack, the problem goes away (for a while), and nobody documents the invalidation strategy. Then six months later there's a stale-data bug nobody can reproduce. This phase teaches the alternative: *caching as a deliberate pattern* with named strategies, explicit TTLs, and engineered protection against the failure modes (stampedes, invalidation bugs, memory pressure).

By phase end your Arc 2 service has Redis caching applied to one or two well-chosen access paths. Each cached path has a documented strategy (cache-aside or write-through), a documented TTL, and an invalidation plan. You've measured cache hit rate. You've protected against stampede deliberately. You know when to cache and when not to.

---

## Prerequisites

> - [Phase 9](/program/arc-2/phase-9/) complete; Postgres-backed Arc 2 service operational
> - Redis 7+ installed locally
> - `redis-cli` working
> - You accept: **caching solves performance and creates correctness problems. The trade-off is intentional, not accidental.**

---

## Why this phase exists

There are two hard problems in computer science: cache invalidation, naming things, and off-by-one errors. The middle one is mostly a joke. The other two are real. This phase tackles the first head-on.

Caching done well multiplies throughput, reduces latency, and absorbs spike traffic. Caching done badly produces inconsistent data, hides architectural problems, and stops working under load. The difference is whether you reach for caching as a pattern with named strategies or as a reflex when something is slow.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

Some operations in your service are expensive: a database query that joins five tables, an external API call, a complex computation. Doing them on every request is slow and wastes resources. You want to *remember* the result so the next request returns it cheaply.

That's the caching problem. Redis is the canonical in-memory cache for backend services. Memcached is a simpler alternative. In-process LRU caches (`functools.lru_cache` in Python, `groupcache` in Go) are the simplest. CDN caches are the same pattern at the network edge. The *pattern*, memoize expensive results with explicit invalidation, survives the tool.

---

## 2. PRINCIPLES

### 2.1 Cache-aside (lazy loading)

The most common strategy: on read, check the cache; on miss, fetch from source, populate cache, return. Writes go to the source directly (and may invalidate or update the cache).

→ Pattern: `cache-aside`

**Investigate:**
- Walk a cache-aside read: hit vs miss flow.
- What happens to consistency if you write to the DB but forget to invalidate the cache?
- Why is cache-aside often the right default vs write-through?

### 2.2 Write-through and write-behind

Write-through: every write goes to both cache and source synchronously. Write-behind: writes go to cache immediately, source asynchronously.

→ Pattern: `write-through-write-behind`

**Investigate:**
- When does write-through earn its weight? (Hint: read-heavy workloads where cache miss is expensive.)
- What's the durability risk of write-behind? When is it acceptable?
- Why is write-through rare in practice compared to cache-aside?

### 2.3 TTL (time-to-live) strategy

Every cached entry expires. The TTL controls staleness tolerance + memory pressure + cache hit rate. Too short: useless cache. Too long: stale data. Picking TTLs is engineering, not random.

**Investigate:**
- How do you pick a TTL for a user-profile cache? For a "top 10 trending" cache? For a session cache?
- What's "TTL jitter," and why does adding it prevent thundering herds?
- When do you set no TTL (cache forever, explicit invalidation)?

### 2.4 Cache stampede (thundering herd)

A hot cache entry expires; thousands of requests miss simultaneously; all of them hit the source; the source falls over. This is one of the few caching bugs that scales linearly with success.

→ Pattern: `cache-stampede`

**Investigate:**
- Walk the timeline: cache hot → TTL fires → N requests miss simultaneously → source overloaded.
- What are the three classic mitigations (request coalescing / single-flight, early expiration, locks)?
- Why is randomized TTL jitter the cheapest defense?

### 2.5 Invalidation strategies

When the underlying data changes, the cache must reflect that change. Options: TTL (eventually consistent), explicit invalidation on write (immediate), version tags (lazy, durable). Each has trade-offs.

**Investigate:**
- Why is "just delete the cache key on write" the most reliable invalidation?
- When is TTL-only invalidation acceptable? (Hint: when staleness tolerance is high.)
- What's a cache stampede triggered by mass invalidation?

### 2.6 Eviction policies and memory pressure

When the cache fills up, something must go. LRU (least recently used) is the workhorse. LFU (least frequently used), random, FIFO have niches. Redis offers `allkeys-lru`, `volatile-lru`, `allkeys-lfu`, etc.

**Investigate:**
- Why is LRU the default? When does LFU beat it?
- What's `maxmemory-policy` in Redis, and how do you pick the right one?
- How do you detect memory pressure before Redis starts evicting hot keys?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Cache strategy | Cache-aside; write-through; write-behind | Cache-aside: simple, eventually consistent. Write-through: stronger consistency, higher write latency. Write-behind: fastest writes, durability risk. |
| Cache backend | Redis; Memcached; in-process LRU; CDN | Redis: rich, replication, persistence option. Memcached: simpler, evict-only. In-process: zero ops, single-instance. CDN: edge, HTTP-specific. |
| Invalidation | TTL-only; explicit on write; version tags | TTL: eventually consistent, simple. Explicit: immediate, requires coordination. Version tags: explicit, more keys. |
| Eviction policy | allkeys-lru; volatile-lru; noeviction; allkeys-random | allkeys-lru: workhorse. volatile-lru: only TTL'd keys evicted. noeviction: errors when full. random: rare niche. |
| Serialization | JSON; MessagePack; Protobuf | JSON: ubiquitous, debuggable. MessagePack: smaller, binary. Protobuf: schema, fastest. |

---

## 4. TOOLS (as of 2026-06)

### Redis
- **Redis 7+**: the engine
- **`redis-cli`**: the CLI
- **`redis-cli --bigkeys`**: find the keys that hurt
- **`redis-cli MONITOR`**: see traffic live (don't run in production)
- **`redis-cli --latency`**: measure latency

### Client libraries
- **Python**: `redis-py` (sync), `redis-py` async, `coredis`
- **Go**: `go-redis/v9`, `redigo` (older)

### Reading
- Redis docs (concepts section, then data structures)
- "Redis in Action" (Carlson)
- "Designing Data-Intensive Applications" Ch. 5 (cache + replication discussion)
- "Caching at Reddit" (engineering blog post, public, illustrates stampede)

---

## 5. MASTERY: Redis caching in your Arc 2 service

### 5.1 The deliverable

Add Redis caching to your Arc 2 service on **at least one access path** (ideally two, one read-heavy, one with invalidation needs). Document:

- **Strategy** chosen (cache-aside, write-through, or write-behind) with rationale
- **TTL** chosen with rationale + jitter applied
- **Invalidation** plan (TTL-only, explicit, version-tagged)
- **Stampede protection** (single-flight, lock, randomized TTL)
- **Hit rate** measured under load (use a small load-generator script)

### 5.2 Operational depth checklist

```
[ ] Configure Redis locally (docker-compose-ready)
[ ] Add cache-aside to one read-heavy path; measure hit rate over a load run
[ ] Apply randomized TTL jitter; verify TTL distribution
[ ] Implement single-flight (request coalescing) for cache misses
[ ] Trigger a cache stampede deliberately (force-expire a hot key during load); observe; mitigate
[ ] Inspect Redis memory; identify big keys with `--bigkeys`
[ ] Configure `maxmemory-policy`; trigger eviction; verify hot keys survive
[ ] Add invalidation on writes for one path; verify consistency end-to-end
[ ] Use Redis MONITOR (briefly!) to observe traffic patterns
[ ] Read at least one of: "Caching at Reddit," "Caching at Stack Overflow," "Caching at Discord" engineering posts
```

---

## 6. COMPARE: Memcached or in-process LRU

Pick:

- **Memcached**: same idea, simpler, evict-only. Run alongside your service; cache a slice of the same access path. Compare ops complexity vs Redis.
- **In-process LRU**: `functools.lru_cache` (Python) or a Go LRU library. Same caching idea but no network. Compare latency + scaling.

400-word reflection on when each fits.

---

## 7. OPERATE

- 2-3 runbooks: "Cache hit rate dropped," "Cache stampede mitigation," "Redis memory pressure"
- 1+ ADR (e.g., "Why Redis vs Memcached for /root service")
- Weekly log

---

## 8. CONTRIBUTE

- Redis docs: typo or clarification
- `redis-py` or `go-redis`: small docs/example fix
- A blog post (Arc 3+ when blog is live) explaining a caching design choice

---

## What ships from this phase

- **Arc 2 service with Redis caching** on at least one path, with documented strategy
- **Cache runbooks** in `chronicle`
- **Pattern OUTLINEs**: cache-aside, write-through-write-behind, cache-stampede

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (cache-aside, write-through)
           Redis running; first cache-aside read

Week 2     PRINCIPLES 2.3-2.4 (TTL, stampede)
           TTL jitter applied; single-flight implemented

Week 3     PRINCIPLES 2.5-2.6 (invalidation, eviction)
           Invalidation on writes; memory configuration

Week 4     COMPARE: Memcached or LRU
           chronicle runbooks

Week 5-6   OPERATE + CONTRIBUTE
           Exit Test
```

---

## Validation criteria

```
[ ] Redis caching applied to your service with documented strategy
[ ] Cache hit rate measured under load
[ ] Stampede protection demonstrated
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 cache runbooks
[ ] 1+ ADR
[ ] Pattern entries deepened STUB → OUTLINE:
    - cache-aside
    - write-through-write-behind
    - cache-stampede
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Design + Build (90 min)
Add Redis caching to a new access path in your service (provided spec). Pick strategy, TTL, jitter, stampede protection. Measure before/after latency + hit rate.

### Part 2: Diagnose (45 min)
A cache scenario (provided: e.g., "the cache hit rate dropped from 85% to 15% an hour ago"). Identify root cause. Possible causes: TTL change, mass invalidation, traffic-pattern change, key explosion.

### Part 3: Articulate (15 min)
~400 words: *"When would you reach for cache-aside vs write-through? Use one example from your service to defend each."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| "Just add Redis" without picking a strategy | This is how invalidation bugs are born |
| TTL of "1 hour" without jitter | Synchronized expiry → thundering herd |
| Caching writes without thinking about durability | Write-behind without durability planning loses data |
| Using `KEYS *` in production | `O(n)` scan of every key: blocks Redis |
| Treating Redis as a database | It's a cache (with persistence options). Plan for it to lose data. |

---

## Patterns touched this phase

- `cache-aside`: first OUTLINE
- `write-through-write-behind`: first OUTLINE
- `cache-stampede`: first OUTLINE

---

→ Next: [Phase 11: HTTP, REST, gRPC & API Design](/program/arc-2/phase-11/)
