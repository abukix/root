---
title: "Data Structures & Algorithms"
description: "Phase 3 of /root Arc 1: the practical subset — arrays, hashmaps, trees, graphs, BFS/DFS, sorting, complexity reasoning applied to real code. Not competitive programming; the subset a backend engineer actually uses."
tags: [arc-1, foundations, algorithms, data-structures]
arc: 1
phase: 3
---

> Third phase of /root. The practical subset of DS&A.

This is *not* a competitive-programming phase. You're not training for Codeforces. The goal is: when you reach for a data structure in real code, you reach for the *right* one and can explain why. When you read someone else's code, the algorithm choice is legible. When you debug a performance issue, you can reason about `O(n²)` hot paths from first principles.

The bar is the subset a backend engineer actually uses in production: arrays + hashmaps as workhorses, trees + graphs as occasional necessities, sorting + searching as bread-and-butter, complexity reasoning as a daily skill. Anything beyond this subset (red-black trees, advanced graph algorithms, dynamic programming) is gravy and can wait until you need it.

---

## Prerequisites

> - [Phase 2](/program/arc-1/phase-2/) complete; Python fluency in place
> - Comfort writing functions in Python
> - You accept: **you are not training for coding interviews. You are training to make right-sized choices in real code.**

---

## Why this phase exists

Most engineers learn DS&A in school, forget it, then re-learn the bare minimum for interviews. That works for getting hired and fails at the senior level. Senior engineers reason about data structure choice *constantly*: every time they read code, every time they design an API, every time they hit a performance issue. The reasoning is automatic, not effortful. This phase builds that reflex.

The pattern is: *match the data shape to the access pattern, and the algorithmic complexity will fall out.* If you're doing N lookups by key, that's a hashmap. If you need ordered iteration, that's a sorted structure. If you need both, that's a tree or a sorted dict. If you need range queries, that's a tree or an index. The pattern survives the language; the implementations age.

---

## The pattern-first frame

Same eight steps as every phase. See [The Master Plan](/program/overview/#the-pattern-first-scaffold).

---

## 1. PROBLEM

You have data and operations on it. The data has shape: collections of items, key-value pairs, hierarchies, graphs. The operations have access patterns: by index, by key, by order, by neighborhood. Picking the wrong structure means an `O(n²)` algorithm where `O(n log n)` was available, or a 100ms operation where 1ms was free.

That's the DS&A problem. CLRS (the textbook) defines the universe; every language's standard library implements a subset, and every senior engineer carries a working subset of *the right thing to reach for in real code*.

---

## 2. PRINCIPLES

### 2.1 Big-O as the engineer's language

Big-O describes how runtime grows with input size. Constants don't matter for big-O but matter for real performance. `O(n)` with a constant factor of 1000 beats `O(log n)` with a constant factor of 1,000,000 for small n.

→ Pattern: `algorithmic-complexity`

**Investigate:**
- Walk the complexity of every operation on a Python `list`, `dict`, `set`. Why is `in` `O(n)` for list and `O(1)` for set?
- What's amortized complexity? Why is `list.append` `O(1)` amortized despite occasional `O(n)` resizes?
- When does `O(n²)` actually matter, and when is it fine?

### 2.2 Arrays and lists

Sequential memory. Index-based access in `O(1)`. Most languages call this "list" or "array" or "vector." Python's `list` is a dynamic array.

**Investigate:**
- What's the difference between Python's `list`, `array.array`, and `numpy.ndarray`?
- Why does `list.insert(0, x)` cost `O(n)` and `list.append(x)` cost `O(1)` amortized?
- When do you reach for `collections.deque` instead?

### 2.3 Hash tables (dicts, sets)

The workhorse data structure. Average `O(1)` insert, lookup, delete. Worst case `O(n)` if hash collisions cluster. Python's `dict` is one of the best hash tables in mainstream languages.

→ Pattern: `hash-tables-as-pattern`

**Investigate:**
- How does Python's `dict` resolve collisions? (Hint: open addressing with probing.)
- Why must hash keys be immutable? What's `__hash__` and `__eq__`?
- When is a hash table the wrong choice (need ordering, need range queries)?

### 2.4 Trees and recursion

Hierarchical structures. Binary trees, BSTs, balanced trees (red-black, AVL), B-trees, tries. Recursion is the natural traversal idiom; iteration with an explicit stack also works.

→ Pattern: `tree-traversals`

**Investigate:**
- Pre-order, in-order, post-order, level-order: what's each useful for?
- What's the difference between BFS and DFS? When does each fit?
- Why are B-trees the canonical disk index (Postgres, MySQL) vs in-memory red-black trees?

### 2.5 Graphs

Nodes and edges. Directed/undirected, weighted/unweighted, cyclic/acyclic. Adjacency list vs adjacency matrix as representations. The classical algorithms: BFS, DFS, shortest path (Dijkstra, BFS for unweighted), topological sort.

→ Pattern: `graph-search`

**Investigate:**
- When is a problem secretly a graph problem? (Hint: dependency graphs, social networks, network routing, build systems.)
- Walk through Dijkstra's algorithm on a small weighted graph by hand.
- What's a DAG, and why does topological sort exist?

### 2.6 Sorting and searching

Sorting: `O(n log n)` general-case. Stable vs unstable. In-place vs out-of-place. Comparison sorts vs counting/radix sorts. Python's `sorted()` is Timsort, optimized for partially-sorted data.

Searching: binary search on sorted arrays (`O(log n)`); hash lookup (`O(1)` average); tree search (`O(log n)` balanced).

**Investigate:**
- Why is the lower bound for comparison sorting `O(n log n)`?
- When is counting sort or radix sort `O(n)` and how does that not contradict the previous?
- When do you reach for `bisect` (binary search) in real Python code?

---

## 3. TRADE-OFFS

| Operation needed | Right structure | Wrong structure | Why |
|---|---|---|---|
| Lookup by key | `dict` / `set` | `list` | `O(1)` vs `O(n)` |
| Iterate in order | `list` (presorted) or `sorted()` | `dict` | dict has no inherent order (insertion order ≠ sorted order) |
| Range query | sorted list + bisect, or tree | dict | range needs ordering |
| LRU cache | `OrderedDict` or `functools.lru_cache` | manual dict + list | move-to-end + eviction |
| Counting | `collections.Counter` | dict + manual `+= 1` | Counter is idiomatic + faster |
| Deque (head + tail ops) | `collections.deque` | `list` | `O(1)` head/tail vs `O(n)` for list head |
| Priority queue | `heapq` | sorted list + insert | `O(log n)` vs `O(n)` insert |

---

## 4. TOOLS (as of 2026-06)

### Python stdlib
- `collections`: `Counter`, `defaultdict`, `deque`, `OrderedDict`, `namedtuple`
- `heapq`: heap (priority queue)
- `bisect`: binary search
- `functools`: `lru_cache`, `reduce`, `partial`
- `itertools`: `chain`, `groupby`, `combinations`, `permutations`, `product`

### Practice
- Use real problems from your work or open-source repos, not synthetic puzzles
- When competitive-programming-style problems do appear (e.g., for interview prep later in /root), pick from curated lists (NeetCode 75, Sean Prashad's pattern list) rather than grinding random Leetcode

### Reading
- "The Algorithm Design Manual" (Skiena): the practical engineer's textbook
- "Grokking Algorithms" (Bhargava): visual + friendly intro
- CLRS (Cormen, Leiserson, Rivest, Stein): the rigorous reference; skim, don't read cover-to-cover

---

## 5. MASTERY: Apply the right structure in real code

### 5.1 The deliverable

A **practice repository** on GitHub with ~20-30 solved problems organized by category. Each problem includes:

- The problem statement
- Your solution
- A comment block explaining the complexity (time + space)
- Tests verifying correctness on edge cases

This isn't a portfolio piece: it's a *practice journal*. You don't ship it loudly. But future-you should be able to skim it and remember the patterns.

### 5.2 The categories to cover

```
Arrays + strings         (5-6 problems)
Hashmaps + sets          (4-5 problems)
Trees + recursion        (4-5 problems)
Graphs + BFS/DFS         (3-4 problems)
Sorting + binary search  (3 problems)
Dynamic programming      (2-3 problems — taste, don't grind)
```

The "DP taste, don't grind" is intentional. DP is overrepresented in interview prep and underrepresented in production code. Know it exists; don't spend half the phase on it.

### 5.3 Operational depth checklist

```
[ ] Implement: BFS and DFS on a small graph from scratch
[ ] Implement: a simple LRU cache (don't use functools.lru_cache for this exercise)
[ ] Implement: in-order traversal of a binary tree iteratively (no recursion)
[ ] Implement: binary search both recursively and iteratively
[ ] Use heapq to solve a top-K problem
[ ] Use collections.Counter to solve a frequency problem
[ ] Profile two solutions to the same problem (different complexity) on increasingly large inputs; observe the growth
[ ] Read the source of Python's CPython `dictobject.c` (skim — see how dict is implemented)
[ ] Refactor a piece of sift from Phase 2 if you find an O(n²) hot path
```

---

## 6. COMPARE: Same problems in Go

After ~3 weeks of Python, re-solve 3-4 of your DS&A problems in Go. The interesting differences: Go's `map` is a hash table but doesn't preserve insertion order. Go has no built-in heap; you implement `heap.Interface` on a slice. Go has no built-in `set`; you use `map[T]struct{}` as the idiom.

400-word reflection on what each language makes easy vs hard.

---

## 7. OPERATE

- 1-2 runbooks: e.g., "Diagnose an O(n²) hot path in production code," written as if a junior engineer would follow it
- 1+ ADR (e.g., "Why dict over list for X in sift")
- Weekly log

---

## 8. CONTRIBUTE

- A DS&A learning repo on GitHub: submit a clear solution or explanation
- Python docs: improve a docstring or example in `collections` or `heapq`

---

## What ships from this phase

- **DS&A practice repo** on GitHub (private or public, your call)
- No new public OSS; `sift` may get a refactor if you found a complexity issue
- `chronicle` with the "diagnose O(n²)" runbook

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (Big-O, arrays)
           Solve 4-5 array problems

Week 2     PRINCIPLES 2.3 (hash tables)
           Solve 4-5 hashmap problems

Week 3     PRINCIPLES 2.4 (trees + recursion)
           Solve 4-5 tree problems

Week 4     PRINCIPLES 2.5 (graphs)
           Solve 3-4 graph problems

Week 5     PRINCIPLES 2.6 (sorting + searching)
           Solve 3 sort/search problems
           Taste DP: 2-3 problems

Week 6     MASTERY: full operational checklist
           COMPARE: Go reimplementation

Week 7     Exit Test + chronicle + buffer
```

---

## Validation criteria

```
[ ] DS&A practice repo with 20-30 solved problems
[ ] All 9 operational depth checks
[ ] Go compare reflection (400 words)
[ ] 1-2 runbooks
[ ] 1+ ADR
[ ] Pattern entries deepened STUB → OUTLINE:
    - algorithmic-complexity
    - hash-tables-as-pattern
    - tree-traversals
    - graph-search
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Solve (90 min)
Three problems from a curated list (one easy, one medium, one harder). The harder one should require choosing the right data structure non-obviously.

### Part 2: Diagnose (30 min)
Given a slow Python function, identify the complexity issue. Propose a fix. Estimate the new complexity.

### Part 3: Articulate (30 min)
~500 words: *"When would you reach for a `dict` vs a `list` in Python? Walk through three concrete examples from production-style code, citing the complexity of each operation."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Grinding Leetcode for hours daily | Interview prep theater. /root is preparing you for senior IC interviews where DS&A is one piece, not the focus. |
| Memorizing solutions | The point is recognizing patterns. Memorization wears off; pattern recognition compounds. |
| Avoiding recursion "because it feels weird" | Trees and graphs naturally recurse. Build the muscle. |
| Premature optimization | Knowing big-O doesn't mean you optimize everything. Most of your code can be O(n) and you're fine. |

---

## Patterns touched this phase

- `algorithmic-complexity`: first OUTLINE
- `hash-tables-as-pattern`: first OUTLINE
- `tree-traversals`: first OUTLINE
- `graph-search`: first OUTLINE

---

→ Next: [Phase 4: Programming Foundations II, Go](/program/arc-1/phase-4/)
