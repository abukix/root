---
title: "Networking Deep"
description: "Phase 18 of /root Arc 3: TCP/IP from packets up, TLS handshake mechanics, DNS resolver internals, L4/L7 load balancing, eBPF basics. The networking foundation everything later builds on.."
tags: [arc-3, infrastructure, networking, tcp, tls, dns]
arc: 3
phase: 18
---

> Second phase of Arc 3. Networking from packets up.

[Arc 2 Phase 11](/program/arc-2/phase-11/) taught HTTP from the API designer's altitude. This phase goes lower: TCP segments, TLS handshakes, DNS resolver internals, packet routing, eBPF for live observation. By phase end you can read a packet capture, walk a TLS handshake byte-by-byte, explain why a DNS resolution is slow, and reason about L4 vs L7 load balancing trade-offs from first principles.

This depth pays interest in every later phase: [Phase 25](/program/arc-3/phase-25/) service mesh is L4/L7 at scale, [Phase 28](/program/arc-3/phase-28/) observability uses eBPF, [Phase 24](/program/arc-3/phase-24/) multi-cloud networking depends on understanding what crosses the wire vs what doesn't.

---

## Prerequisites

> - [Phase 17](/program/arc-3/phase-17/) complete; kernel-level Linux fluency
> - Wireshark or equivalent installed
> - You accept: **you are not learning iptables. You are learning packet flow, with iptables as one of several netfilters.**

---

## Why this phase exists

Most engineers learn networking by accident: they hit a connectivity issue, search Stack Overflow, find the magic command, move on. Senior engineers debug network issues from first principles because they understand the layers, the state machines, the failure modes. This phase installs the mental model that converts "the connection times out" into "the SYN succeeded but the SYN-ACK got dropped at this hop because of MTU mismatch."

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You have machines (Phase 17). You want them to talk reliably, securely, and at low latency, over an inherently unreliable physical medium that drops, reorders, and duplicates packets. The endpoints may be in the next rack or across the planet.

The problem is giving applications the illusion of a reliable, ordered, secure byte stream over this mess. Or, when an application is fine with unreliable datagrams, providing those without the byte-stream cost.

---

## 2. PRINCIPLES

### 2.1 Layering (OSI vs TCP/IP)

Network functionality is layered: physical → link → network → transport → application. Each layer hides complexity and is replaceable.

→ Pattern: `layering-and-abstraction` (reinforced from Phase 17)

**Investigate:**
- Why are there layers at all? What does separating "where a packet goes" from "how bits get on the wire" buy?
- What breaks when a layer leaks (PMTU discovery, ICMP filtering, NAT and the IP layer)?
- Why is "Layer 7 vs Layer 4 load balancing" a recurring engineering decision?

### 2.2 Routing and addressing

Every endpoint has an address. Every router has a forwarding table. A packet's job is to traverse the table-of-tables from source to destination.

→ Pattern: `routing-and-addressing`

**Investigate:**
- IPv4 vs IPv6: beyond "more addresses," what's structurally different?
- How does BGP actually decide a path?
- What's CIDR, and why did it replace classful addressing?

### 2.3 Reliability over unreliability (TCP)

TCP gives you reliable, ordered, byte-stream-over-segment delivery on top of IP, which gives none of those. Mechanism: sequence numbers + ACKs + retransmission + flow control + congestion control.

**Investigate:**
- Walk a three-way handshake byte-by-byte with `tcpdump`.
- What's the difference between Reno, Cubic, BBR congestion control?
- When is UDP the right choice? (Hint: DNS, video, QUIC.)

### 2.4 Naming (DNS)

Names are how humans address endpoints; addresses are how routers do. DNS maps. It's also a distributed database, a security surface, and a frequent outage cause.

**Investigate:**
- Trace `dig +trace google.com`. Stub resolver vs recursive vs authoritative.
- What changes with DNSSEC, and why is it not universally deployed?
- What's a stale-cache TTL bug, and how do you defend against it?

### 2.5 Defense in depth

No perimeter. Every layer has its own security: link (ARP), network (firewall, NetworkPolicy), transport (TLS), application (auth tokens, mTLS).

→ Pattern: `defense-in-depth`

**Investigate:**
- What does a TLS handshake actually carry, and what does it prove?
- Why is mTLS standard inside service meshes? What doesn't it solve?
- What attacks does NetworkPolicy stop vs not?

### 2.6 eBPF as the modern observability layer

eBPF (extended Berkeley Packet Filter) runs verified programs in the kernel for observability + networking. It's the underlying technology for Cilium, modern profilers, and L4/L7 packet steering without sidecars.

**Investigate:**
- What's an eBPF program, and what makes it "safe to run in the kernel" (the verifier)?
- How does Cilium use eBPF to implement K8s NetworkPolicy faster than iptables?
- What's `bpftrace`, and why is it the modern equivalent of `dtrace`?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Transport | TCP; UDP; QUIC | TCP: reliable, HOL block. UDP: lean. QUIC: encrypted, multiplexed, complex |
| Address family | IPv4; IPv6; dual-stack | IPv4: ubiquitous, exhausted. IPv6: future. Dual-stack: complex |
| Firewalling | iptables; nftables; eBPF (Cilium) | iptables: legacy. nftables: modern. eBPF: programmable, fastest |
| Load balancing | L4; L7; DSR | L4: fast, simple. L7: smart, expensive. DSR: scales, complex |

---

## 4. TOOLS (as of 2026-06)

- **Capture**: `tcpdump`, `wireshark`
- **DNS**: `dig`, `drill`
- **HTTP**: `curl`, `httpie`
- **Connections**: `ss`, `lsof -i`
- **Path**: `mtr`, `traceroute`
- **Firewall**: `nft`, `iptables`, `bpftool`

### Reading
- "Computer Networking: A Top-Down Approach" (Kurose & Ross)
- "TCP/IP Illustrated, Vol. 1" (Stevens): the deep dive
- RFCs: 9293 (TCP), 9110 (HTTP semantics)
- "Learning eBPF" (Liz Rice)

---

## 5. MASTERY: Linux netstack at depth

```
[ ] Capture and annotate a TCP three-way handshake
[ ] Force PMTU blackhole: drop ICMP fragmentation-needed; observe symptom
[ ] Configure iptables/nftables drop on a specific port; verify with nmap
[ ] Set up unbound or knot-resolver locally
[ ] Trace DNS resolution stub → recursive → authoritative
[ ] Set up TLS with a self-signed cert + Let's Encrypt; observe handshakes
[ ] Use ss -tnp to inspect open TCP connections during real traffic
[ ] Write a 50-line HTTP client + server from sockets in Python or Go
[ ] Use bpftrace to count packet drops on an interface for 60 seconds
[ ] Read one packet capture from a real failure (your own bug or a public one)
```

---

## 6. COMPARE: pf (FreeBSD) or eBPF (Cilium)

Pick one:
- **`pf` on FreeBSD**: same firewall pattern, different rule language
- **Cilium standalone**: eBPF-based; observe NetworkPolicy implementation

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks: DNS, TCP hang (PMTU), TLS handshake failure, packet loss diagnosis
- 1+ ADR (CoreDNS over BIND, or similar)
- Weekly log

---

## 8. CONTRIBUTE

- `curl`: bug or docs
- `coredns`: docs, edge cases
- RFC errata via IETF

---

## What ships from this phase

- **Tier-0 networking utils** in `chronicle/scripts/network/`
- **From-scratch HTTP client + server** as labs
- **Network runbooks**
- Pulse from Arc 1 gets meaningful upgrades (better timeouts, eBPF-based probing optional)

---

## Validation criteria

```
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 4-5 network runbooks
[ ] 1+ ADR
[ ] Pattern entries deepened:
    - routing-and-addressing → OUTLINE
    - layering-and-abstraction → reinforced
    - defense-in-depth → first OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Diagnose (90 min)
Scenario: connectivity works locally but fails from a specific subnet. Diagnose with tcpdump + DNS + firewall.

### Part 2: Articulate (60 min)
~1000 words: walk a request from `curl https://example.com/foo` to response. DNS, TCP, TLS, HTTP, return path. Cite layers + patterns.

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Memorizing port numbers | Tool-thinking, not protocol-thinking |
| Trusting your DNS cache | Stale-resolver bugs are the most common "network" issue |
| Ignoring ICMP "because ping doesn't matter" | PMTU + traceroute depend on it |
| Skipping the from-scratch HTTP exercises | You won't really understand framework HTTP until you've done it raw |

---

## Patterns touched this phase

- `routing-and-addressing`: first OUTLINE
- `layering-and-abstraction`: reinforced
- `defense-in-depth`: first OUTLINE

---

Next: [Phase 19: Containers from Scratch](/program/arc-3/phase-19/)
