---
title: "OS Internals"
description: "Phase 17 of /root Arc 3: Linux at the kernel level. Process model, virtual memory, syscalls, schedulers, filesystems, boot. FreeBSD as compare. The substrate every later phase rests on.."
tags: [arc-3, infrastructure, os, kernel, linux]
arc: 3
phase: 17
---

> First phase of Arc 3. Kernel-level depth.

Arc 1 made Linux legible *as a developer uses it*. Arc 3 takes it to the kernel. Every later phase of /root, from containers and Kubernetes to distributed systems, the data tier, and ML serving, ultimately resolves to processes, file descriptors, page tables, and syscalls running on a Linux kernel. If those primitives are fuzzy, every later abstraction is partial magic.

This phase isn't about memorizing kernel APIs. It's about *being able to debug any layer above the kernel* by reasoning from primitives. By phase end you can read `strace` output fluently, walk the lifecycle of a syscall from userspace to kernel and back, explain virtual memory's mechanics to a junior engineer, and articulate what the scheduler is doing when your system "feels slow."

---

## Prerequisites

> - All Arc 2 complete; service running in Docker
> - Linux environment available (your homelab, dev laptop, or VM)
> - FreeBSD VM available for compare exercises (or willingness to run macOS for partial compare)
> - You accept: **you are not learning Linux. You are learning what a kernel is, with Linux as the canonical implementation.**

---

## Why this phase exists

Senior engineers debug *any* layer of the stack because they understand what's underneath the abstraction. This phase installs that habit at the lowest level: every abstraction has an implementation, every implementation has trade-offs, and trade-offs come from physics, history, and incentives. The *pattern*, what a kernel is, what it solves, what it leaks, survives the tool.

This phase also sets the pattern-first scaffold cadence for Arc 3. The remaining 13 phases use the same shape. The discipline you build here pays interest for the whole year.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You have hardware: CPU, RAM, I/O devices. You want to run many programs on it, give each program the illusion of having the whole machine, prevent any program from crashing or spying on the others, abstract over every specific disk and NIC, and survive crashes cleanly.

That's the operating-system problem. Linux is one implementation. FreeBSD is another. Windows NT is another. macOS/XNU is a BSD + Mach hybrid. seL4 is formally verified. Unikernels (MirageOS, Unikraft) are a different shape entirely. The *pattern* survives; the *tools* age.

---

## 2. PRINCIPLES

### 2.1 Resource virtualization

Every process believes it has the whole machine: its own CPU, its own memory, its own file descriptors. Virtualization makes this illusion convincing while the actual hardware is shared.

→ Pattern: `virtualization` (foundations)

**Investigate:**
- What is a virtual address space, and why does each process get its own?
- What happens when a process accesses an address? MMU, TLB, page-table walk.
- What goes wrong when virtualization breaks (segfault, OOM kill, swap thrashing)?

### 2.2 Privilege separation

The kernel runs in privileged mode; processes run in user mode. Every dangerous operation requires the process to ask the kernel via a syscall.

→ Pattern: `privilege-separation`, target DEEP this phase

**Investigate:**
- What is a system call, mechanically? Walk it through ring 0 / ring 3 (or its equivalent on your CPU).
- Why is the privilege boundary expensive to cross? Benchmark `write(2)` to `/dev/null` vs an in-memory counter.
- How do `vDSO` and `io_uring` reduce or eliminate boundary crosses for specific syscalls?

### 2.3 Mediation

The kernel mediates every interaction between processes and hardware: filesystems, networking, timers, signals.

→ Pattern: `mediation` (foundations)

**Investigate:**
- Why isn't there a "let processes write to disk directly" shortcut? (Hint: page cache, write barriers, fsync semantics.)
- What's the cost of mediation, and when do you bypass it (`DPDK`, `io_uring`)?
- Why does Kubernetes' Service object resemble the kernel's mediation pattern (both interpose to provide a stable interface)?

### 2.4 Layering and abstraction

The OS is layered: hardware → kernel → libc → application. Each layer hides complexity and exposes a contract.

→ Pattern: `layering-and-abstraction`

**Investigate:**
- Trace a `printf` from your C program to bytes on the screen. Count the layers.
- What happens when a layer's contract is wrong (libc bug, kernel regression)?
- How does the same layering pattern appear in TCP/IP (Phase 18), OverlayFS (Phase 19), and K8s API/etcd (Phase 20)?

### 2.5 The process as the unit of execution

A process has its own address space, file descriptors, signal handlers, scheduling priority. Threads share an address space; processes don't.

**Investigate:**
- What's in `/proc/PID/`? Walk every file.
- What does `fork(2)` actually do? Why is `vfork` a thing? Why is `clone(2)` more general?
- What does the scheduler decide when there are 1000 runnable processes and 4 cores?

### 2.6 The filesystem as a namespace

Files are an abstraction over blocks on disk. The VFS layer makes ext4, XFS, ZFS, NFS, FUSE, and tmpfs all look identical to applications.

**Investigate:**
- What's an inode? A dentry?
- Why does `/proc` look like a filesystem despite no disk behind it?
- What's the kernel's path lookup algorithm?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Kernel design | Monolithic (Linux); microkernel (seL4, Mach); hybrid (XNU) | Monolithic: fast, large attack surface. Micro: small, IPC overhead. Hybrid: pragmatic compromise. |
| Process model | fork + exec (Unix); spawn (Windows) | fork: cheap for shells. spawn: cleaner for IDEs. |
| Scheduling | CFS (Linux); BSD scheduler; round-robin | CFS: fairness. BSD: throughput. Round-robin: simplicity. |
| Filesystem | ext4; XFS; ZFS; btrfs | ext4: fast, simple. XFS: scale. ZFS: data integrity. btrfs: features + snapshots. |
| Init system | systemd; OpenRC, runit, s6 | systemd: feature-rich, controversial. Alternatives: minimal, niche. |

---

## 4. TOOLS (as of 2026-06)

### Inspection
- `strace`, `ltrace`: syscall + library tracing
- `perf`, `flamegraph`: profiling
- `bpftrace`, `bcc-tools`: eBPF for live kernel observability
- `/proc`, `/sys`: direct kernel state
- `lsof`, `pmap`: fd + memory inspection

### FreeBSD compare
- `truss` (strace equivalent)
- `procstat` (`/proc` equivalent)

### Reading
- "The Linux Programming Interface" (Kerrisk): the canonical reference
- "How Linux Works" (Brian Ward, 3rd ed.): readable orientation
- "Operating Systems: Three Easy Pieces" (free online): the textbook
- "Systems Performance" (Brendan Gregg): for the perf chapter

---

## 5. MASTERY: Linux at depth

### 5.1 Operational depth checklist

```
[ ] Walk through every file in /proc/self/: know what each represents
[ ] strace -c on `ls`, `cat`, a Python script: count syscalls; explain top 5
[ ] Trigger and diagnose: segfault (write a tiny C program), OOM kill (cgroup-bounded loop), swap thrashing
[ ] Build a process tree with fork/exec in C; observe with `pstree` and `/proc`
[ ] Read /proc/PID/maps; identify text, heap, stack, mmap regions
[ ] Use `bpftrace -e 'tracepoint:syscalls:sys_enter_openat { @[comm] = count(); }'` to count opens by process
[ ] Set up cgroups v2 manually (no systemd-run); pin a process to 1 CPU + 100MB RAM
[ ] Mount ext4, XFS, tmpfs; inspect with `dumpe2fs`/`xfs_info`/`mount`
[ ] Write a small init system in shell (PID 1 fundamentals: reaping zombies, signal handling)
[ ] Trace boot sequence with `dmesg` after a fresh boot
```

The cgroups + PID-1 exercises pay the most interest in [Phase 19](/program/arc-3/phase-19/) (containers from scratch).

### 5.2 chronicle seeds

`chronicle/runbooks/linux-kernel/`:
- "Diagnose a process eating CPU" (`top`, `perf top`, `strace`)
- "Diagnose disk-full or inode-exhaustion"
- "Diagnose memory pressure" (`vmstat`, `/proc/meminfo`, OOM scoring)
- "Recover a system that won't boot" (recovery shell, fsck, `init=/bin/bash`)

---

## 6. COMPARE: FreeBSD VM

Spin up FreeBSD 14 in a VM. Re-do 3 of the operational checklist items there: process inspection (`procstat`), syscall tracing (`truss`), filesystem mounting (UFS or ZFS).

400-word reflection: what's the same? what's different? what's the underlying principle?

---

## 7. OPERATE

- 4-5 runbooks in `chronicle/runbooks/linux-kernel/`
- 1+ ADR (e.g., "Why ext4 over XFS for the homelab data disk")
- Weekly log

---

## 8. CONTRIBUTE

- Linux kernel docs: typo or clarification
- `man-pages` project: examples or clarifications
- `util-linux` or `procps-ng`: small fix
- Strace/perf: docs

---

## What ships from this phase

- **Hardened kernel-level Linux fluency**
- **Kernel runbooks** in `chronicle` (~4-5 entries)
- **Pattern depth**: `privilege-separation` reaches DEEP (revisited in [Phase 19](/program/arc-3/phase-19/))

No new OSS this phase: preparation for the substrate that lands in Phases 19-20.

---

## Learning loop cadence

```
Weeks 1-2     PROBLEM + PRINCIPLES 2.1-2.3 (virtualization, privilege, mediation)
              First /proc walks; strace exercises

Weeks 3-4     PRINCIPLES 2.4-2.5 (layering, processes)
              fork/exec exercise; cgroups manual setup

Weeks 5-6     PRINCIPLES 2.6 + TRADE-OFFS
              Filesystem mount exercises; init system in shell

Weeks 7-8     MASTERY + COMPARE + OPERATE + CONTRIBUTE
              Exit Test
```

---

## Validation criteria

```
[ ] All 10 operational depth checks passed
[ ] FreeBSD compare reflection (400 words)
[ ] 4-5 Linux kernel runbooks
[ ] 1+ ADR
[ ] Pattern entries deepened:
    - virtualization → OUTLINE
    - privilege-separation → DEEP
    - mediation → OUTLINE
    - layering-and-abstraction → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Diagnose (90 min)
A scenario from the Phase 17 catalog (e.g., "this VM's load average is 30 with 0% CPU usage," which is disk I/O wait; or "this process won't die on SIGTERM," which is uninterruptible sleep). Find root cause + write runbook.

### Part 2: Articulate (60 min)
~1000 words: *"Walk a `read(fd, buf, 1024)` syscall from the C function call to data in `buf`. Cover: user→kernel transition, VFS lookup, page cache, block layer, device driver, return path. Cite patterns."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Learning Linux by tutorial | You'll know commands; not what they do |
| Skipping FreeBSD compare | Without it, "OS" and "Linux" stay confused |
| Memorizing `/proc/*` paths instead of understanding | The path is just a file; the abstraction is the point |
| Treating `strace` output as noise | It's the truth; when you can read it, you can debug anything |

---

## Patterns touched this phase

- `virtualization`: first OUTLINE
- `privilege-separation`: DEEP target
- `mediation`: first OUTLINE
- `layering-and-abstraction`: first OUTLINE

---

Next: [Phase 18: Networking Deep](/program/arc-3/phase-18/)
