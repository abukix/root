---
title: "Containers from Scratch"
description: "Phase 19 of /root Arc 3: dissolve Docker into Linux primitives. unshare, cgroups v2, OverlayFS, capabilities, seccomp. Build a working container in <100 lines of bash.."
tags: [arc-3, infrastructure, containers, kernel]
arc: 3
phase: 19
---

> Third phase of Arc 3. Docker's magic dissolves into Linux primitives.

[Arc 2 Phase 13](/program/arc-2/phase-13/) taught containers from the user's altitude: Docker workflow, multi-stage builds, image hygiene. This phase reuses the kernel primitives from [Phase 17](/program/arc-3/phase-17/), namespaces, cgroups, capabilities, to construct what Docker calls a "container." Once you've built one from `unshare` and a tarball, the entire container ecosystem (Docker, Podman, containerd, OCI images) becomes a thin layer of conventions over Linux features you already operate.

This phase pays the most interest of any in Arc 3. [Phase 20](/program/arc-3/phase-20/) Kubernetes is *just* declarative orchestration over these primitives. Every later year runs in containers; demystifying them here means every later container-related debugging session resolves to "which primitive is broken" rather than "Docker is misbehaving."

---

## Prerequisites

> - [Phase 17](/program/arc-3/phase-17/) cgroups + PID-1 exercises completed
> - Linux host with kernel ≥ 5.10 (cgroups v2, overlayfs)
> - You accept: **you are not learning Docker. You are learning what a container is, with Docker as one toolchain on top.**

---

## Why this phase exists

Containers are not magic. They are a tarball unpacked into a rootfs, run as a process with restricted views of the kernel (namespaces) and bounded resources (cgroups), often with reduced privileges (capabilities + seccomp). That sentence is the entire mental model. Everything Docker / Podman / Kubernetes does is plumbing around it.

Most engineers learn containers backward: Docker first, then "what's an image," then maybe namespaces. This phase does it forward: namespaces → cgroups → UnionFS layering → Docker as a workflow that bundles these.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You want to ship application X to environment Y reliably. X needs library versions, env vars, file layouts, capabilities. Y is a shared host running other applications with conflicting library versions. Y might be your laptop today and a production server tomorrow.

The conventional answers (VMs, configuration management) are slow, heavy, or fragile. Containers are the modern answer: a portable, self-contained, lightweight bundle that runs the same way on Y as it did on your laptop, isolated from other workloads.

---

## 2. PRINCIPLES

### 2.1 Namespaces

Each namespace virtualizes one kernel-managed resource: PID, mount, net, UTS, IPC, user, cgroup. A process inside a namespace sees only the resources its namespace exposes.

→ Pattern: `privilege-separation` (reinforced from Phase 17)

**Investigate:**
- What does `unshare --pid --fork --mount-proc bash` do? Walk through.
- Why does PID 1 inside the namespace matter (reaping, signal handling)?
- What's a user namespace, and what does it let an unprivileged user safely do?

### 2.2 cgroups v2

Control groups bound CPU, memory, I/O, PIDs a process tree can consume. They also enable accounting.

**Investigate:**
- What's in `/sys/fs/cgroup`?
- How does `memory.max` differ from `memory.high`, and what does OOM killer do at each?
- Why is cgroups v2 hierarchical, and what does that buy K8s pod-level resource limits?

### 2.3 OverlayFS

Layered filesystems let containers share read-only base layers and add a thin writable top. Image build → cached layers → COW for the runtime container.

**Investigate:**
- What does `overlayfs` actually do at mount time?
- Why do Docker image layers correspond to Dockerfile instructions?
- What's "layer bloat," and how do you prevent it?

### 2.4 Capabilities

Root has every privilege; capabilities split root into 40+ fine-grained permissions. Containers drop most.

**Investigate:**
- What does `getcap` show? What does `setcap` configure?
- Why does `CAP_NET_BIND_SERVICE` exist?
- Which caps does a typical Docker container start with?

### 2.5 Seccomp + AppArmor / SELinux

Seccomp filters which syscalls a process may make. AppArmor and SELinux are mandatory access controls layered above DAC.

**Investigate:**
- What does Docker's default seccomp profile block?
- When would you write a custom seccomp profile?
- AppArmor vs SELinux philosophies; which is your distro's default?

### 2.6 Immutable infrastructure

The pattern containers express at the platform level: don't mutate a running container. Ship a new image. Configuration drift becomes impossible because the artifact is immutable.

→ Pattern: `immutable-infrastructure`: first OUTLINE

**Investigate:**
- Why does immutable infrastructure compose so well with GitOps (Phase 20)?
- When is mutable state acceptable inside an immutable container (persistent volumes)?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Runtime | Docker; Podman; containerd; CRI-O | Docker: daemon. Podman: rootless. containerd: K8s standard. CRI-O: K8s-only |
| Filesystem | OverlayFS (default); ZFS; AUFS (deprecated) | OverlayFS: standard. ZFS: integrity + snapshots, RAM-hungry |
| Base image | Alpine (musl); Debian-slim; distroless | Alpine: tiny, musl quirks. Debian-slim: friendly. Distroless: smallest, no shell |

---

## 4. TOOLS (as of 2026-06)

- **Building / running**: `docker`, `podman`, `buildah`, `skopeo`
- **Low-level**: `runc`, `crun`, `ctr` (containerd)
- **Inspecting**: `unshare`, `nsenter`, `dive`, `lsns`
- Reading: "Container Security" (Liz Rice), rootlesscontaine.rs, OCI Spec

---

## 5. MASTERY: Build a container from scratch

### 5.1 The from-scratch exercise

In ≤ 100 lines of bash, build a "container" that:
- Has its own PID namespace
- Has its own mount namespace (`/` is your rootfs)
- Uses cgroups v2 for memory + CPU limits
- Drops all capabilities except a small set
- Runs a single binary (e.g., `busybox sh`)

Use `unshare`, `mount`, `pivot_root`, `chroot`, manual `/sys/fs/cgroup` writes, `capsh`.

### 5.2 Operational depth checklist

```
[ ] From-scratch container running busybox (the 100-line bash exercise)
[ ] Same exercise in Go using runc as a library
[ ] Read overlayfs mount output for a running Docker container; map layers to image
[ ] Build a multi-stage Dockerfile for sift; minimize final image
[ ] Build a distroless image for pulse
[ ] Add a custom seccomp profile that blocks `unlink`; observe container behavior
[ ] Use `dive` to find layer bloat in a real image; reduce by 50%
[ ] Run a container as a non-root user; verify
[ ] Push an image to a local registry; pull it back
```

---

## 6. COMPARE: FreeBSD jails

Spin up FreeBSD 14 and create a jail. Same problem (isolated process group), different abstraction. Jails predate Linux namespaces; whole-system, not per-resource.

400-word reflection.

---

## 7. OPERATE

- 4-5 runbooks in `chronicle/runbooks/containers/`
- 1+ ADR (Podman vs Docker for homelab)
- Weekly log

---

## 8. CONTRIBUTE

- `runc`: docs
- `containerd`: docs
- OCI image spec: clarifications

---

## What ships from this phase

- **From-scratch container exercise** preserved in `chronicle/labs/containers/`
- **Container runbooks**
- Foundation ready for [Phase 20](/program/arc-3/phase-20/) K8s

---

## Validation criteria

```
[ ] From-scratch container works (≤100 lines bash)
[ ] All 9 operational depth checks
[ ] FreeBSD jails compare (400 words)
[ ] 4-5 container runbooks
[ ] 1+ ADR
[ ] Pattern entries:
    - privilege-separation reinforced (toward DEEP)
    - immutable-infrastructure → first OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (60 min)
Take a small Go service. Build a multi-stage Dockerfile producing <20MB distroless image. Add custom seccomp profile. Run rootless. Verify works + capabilities minimal.

### Part 2: Articulate (90 min)
~1200 words: *"Walk what happens when `docker run -it alpine sh` is invoked. Docker CLI → containerd → runc → namespaces → rootfs → process forked → shell prompt visible. Cite every primitive at each step. Explain what changes with `podman run` instead."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Building 2GB images with Ubuntu base | Pay for layers you don't use; distroless or Alpine |
| Running containers as root "for now" | Privilege escalation through container break-out is real |
| Ignoring from-scratch exercise | Every Docker bug stays magical |
| Treating `latest` as a tag | Not a version. Pin SHA or semver. |

---

## Patterns touched this phase

- `privilege-separation` reinforced (toward DEEP)
- `immutable-infrastructure`: first OUTLINE
- `layering-and-abstraction` reinforced (overlayfs)

---

→ Next: [Phase 20: Kubernetes + GitOps](/program/arc-3/phase-20/)
