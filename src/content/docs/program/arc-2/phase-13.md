---
title: "Containers as a User"
description: "Phase 13 of /root Arc 2: Docker fluency. Dockerfile design, multi-stage builds, image layers, docker-compose for local dev, registry workflow. Containerize your Arc 2 service. Containers-from-scratch (unshare + cgroups) is Arc 3 P19.."
tags: [arc-2, backend, containers, docker]
arc: 2
phase: 13
---

> Fifth phase of Arc 2. Containers from the user's altitude.

This phase is *containers as a user*: Docker fluency, image hygiene, docker-compose for local development, registry workflows. It is *not* containers-from-scratch with `unshare` and cgroups; that's Arc 3 Phase 19, where you'll dissolve the Docker abstraction into its Linux primitives. Arc 2 is about using containers fluently as a working backend engineer, while Arc 3 is about understanding them at the kernel level.

By phase end your Arc 2 service runs in Docker via a multi-stage build that produces a small, secure image. A `docker-compose.yml` brings up your full local environment (service + Postgres + Redis + any queues). You can publish to a container registry. You've debugged a container that wouldn't start. This is the deploy-shape of every later phase: when Arc 3 lands K8s, you're already containerized.

---

## Prerequisites

> - [Phase 12](/program/arc-2/phase-12/) complete; auth operational
> - Docker (or Podman) installed
> - You accept: **you are not learning Docker the tool. You are learning what containerization-as-a-user is, with Docker as the canonical workflow.**

---

## Why this phase exists

Most engineers learn Docker by copying Dockerfiles from blogs. The result: 2GB images for 100MB services, secrets baked into image layers, debug tools shipped to production, no understanding of why a build is slow or why a container won't start. This phase installs the discipline that production services depend on: *small, deliberate, debuggable* images.

Arc 3's K8s phases assume you're already containerized cleanly. Arc 4-Arc 5's ML/AI workloads assume you can produce reproducible images. The discipline here pays interest for the rest of /root.

---

## The pattern-first frame

Same eight steps as every phase.

---

## 1. PROBLEM

You wrote a service. It runs on your laptop. You need it to run *anywhere*: a colleague's laptop, a CI runner, a production server in Arc 3. The runtime needs all the right dependencies (Python version, system libraries, environment variables). Without containers, every target environment is a snowflake; with them, your service runs identically anywhere a container runtime exists.

That's the containerization problem from the user's altitude. Docker is the canonical workflow. Podman is daemonless. containerd is the OCI-spec runtime underneath both. Buildah, kaniko, ko, and Buildpacks are alternative build tools. The *pattern*, packaging the service plus its dependencies into a portable, layered image, survives the tool.

(Containers from scratch, namespaces, cgroups, OverlayFS, is Arc 3 Phase 19. This phase is the user's side.)

---

## 2. PRINCIPLES

### 2.1 Containerization-as-user

A container is a process running with restricted views of the kernel. From your altitude as a developer, a container is a *self-contained, isolated, lightweight bundle* of your service plus its dependencies. You build it once, run it anywhere. The kernel-level details (namespaces, cgroups) are Arc 3.

→ Pattern: `containerization-as-user`

**Investigate:**
- What does `docker run hello-world` actually do? (Brief: pulls image, creates container, runs entrypoint, exits.)
- Why is "containers are not VMs" a load-bearing distinction?
- When is a container *not* the right packaging? (Hint: GUI desktop apps, persistent state that should live elsewhere.)

### 2.2 Image layers and the build cache

Docker images are stacked read-only layers. Each Dockerfile instruction creates a layer. Layer reuse is what makes builds fast: if a layer's inputs haven't changed, Docker reuses it. Ordering Dockerfile instructions correctly is the difference between 30-second builds and 5-minute builds.

→ Pattern: `image-layers`

**Investigate:**
- What's the difference between a `FROM` layer, a `COPY` layer, and a `RUN` layer?
- Why do most Dockerfiles `COPY package.json` *before* `COPY .`?
- What's `--cache-from` and `--cache-to` for buildx?

### 2.3 Multi-stage builds

A multi-stage Dockerfile has multiple `FROM` statements. Earlier stages build (compile Go, install Python deps), and the final stage copies only the artifacts into a minimal runtime image. This is how a 100MB Go binary ends up in a 10MB final image.

→ Pattern: `multi-stage-builds`

**Investigate:**
- Why doesn't the final image need the Go compiler or pip?
- What's `distroless`, and when does it fit?
- How does `COPY --from=builder` work?

### 2.4 Image hygiene

Production-quality images are small (fast to pull), minimal (small attack surface), non-root (defense in depth), tagged precisely (not `latest`), and reproducible (same inputs → same image hash).

**Investigate:**
- Why is `latest` not a version? What should production images be tagged with?
- What's the difference between Alpine, Debian-slim, and distroless as base images?
- How do you make a Python image small? A Go image? A Node image?

### 2.5 docker-compose for local development

`docker-compose.yml` defines a multi-container local environment: your service + Postgres + Redis + a queue + whatever else. `docker compose up` brings everything up; `docker compose down` tears it down. This is the local-dev paradigm for any service that depends on multiple infra components.

**Investigate:**
- What's the difference between Docker `network` modes (bridge, host, none, custom)?
- How do environment variables flow into containers? Where do secrets fit?
- When does Compose feel limiting? (Hint: at the scale of multiple services + multiple environments.)

### 2.6 Container registry workflow

Images live in a registry: Docker Hub, GitHub Container Registry (ghcr.io), AWS ECR, Google Artifact Registry. The push-pull workflow is: build local → tag → push to registry → pull from anywhere.

**Investigate:**
- What's an image manifest? What's a multi-arch image?
- How does ghcr.io auth work with GitHub Actions?
- What's image signing (cosign/Sigstore), and when does it earn its weight?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Runtime | Docker; Podman; containerd | Docker: ubiquitous, daemon. Podman: daemonless, rootless-friendly. containerd: lower-level, K8s-default. |
| Base image | Alpine; Debian-slim; distroless; full Debian/Ubuntu | Alpine: tiny, musl quirks. Debian-slim: friendly + small. Distroless: smallest, no shell (hard to debug). Full: large, friendly. |
| Build tool | Dockerfile; Buildpacks; Nix; ko (Go); Jib (Java) | Dockerfile: ubiquitous. Buildpacks: opinionated. Nix: reproducible, learning curve. ko: language-specific, fast. |
| Local dev | docker-compose; Tilt; Skaffold; raw `docker run` | Compose: ubiquitous, simple. Tilt: K8s-flavored. Skaffold: K8s-flavored. Raw: too verbose. |
| Registry | Docker Hub; ghcr.io; cloud-native (ECR, GCR, etc.); self-hosted | Hub: ubiquitous, rate limits. ghcr: free for OSS. Cloud: integrated. Self-hosted: max control. |

---

## 4. TOOLS (as of 2026-06)

### Build + run
- **Docker** or **Podman**: main workflow
- **`buildx`** (Docker BuildKit): fast, multi-arch builds
- **`docker compose`**: local multi-container dev

### Inspection
- **`dive`**: visualize image layer bloat
- **`docker image inspect`**: image metadata
- **`docker scout`** or **Trivy**: vulnerability scanning

### Reading
- "Docker Deep Dive" (Poulton), an accessible intro
- "Container Security" (Liz Rice), short and sharp
- Docker docs (the *Best Practices* section is excellent)
- The OCI Image Spec, read at least once

---

## 5. MASTERY: Containerize your Arc 2 service

### 5.1 The deliverable

Your Arc 2 service now has:

- A **multi-stage Dockerfile** producing a final image under 100MB (smaller is better)
- The container **runs as non-root**
- A **`docker-compose.yml`** that brings up your service + Postgres + Redis + any queues
- The image **published to ghcr.io** (or another registry) via GitHub Actions, tagged with `:latest` AND a specific version
- **Vulnerability scan** clean (Trivy or Docker Scout); known CVEs documented if accepted
- A README section documenting the local-dev flow

### 5.2 Operational depth checklist

```
[ ] Write a multi-stage Dockerfile for your service
[ ] Use dive to find layer bloat; reduce final image by 50%+ vs initial naive Dockerfile
[ ] Configure the image to run as a non-root user
[ ] Build a docker-compose.yml that brings up everything for local dev
[ ] Test the compose setup on a fresh checkout: does someone else's machine work?
[ ] Push the image to ghcr.io via GitHub Actions on release
[ ] Tag images with semver + Git SHA + branch
[ ] Run Trivy or Docker Scout against the image; address findings or document acceptance
[ ] Debug a container that won't start (deliberately misconfigure something; recover)
[ ] Use `docker exec` to enter a running container; understand the filesystem layout
```

---

## 6. COMPARE: Buildpacks or Nix

Pick one:

- **Buildpacks**: install `pack`, build your service via Buildpacks. Compare the result vs your Dockerfile.
- **Nix**: package your service via Nix. Compare reproducibility + image size.

400-word reflection on when each fits vs the Dockerfile default.

---

## 7. OPERATE

- 3-4 runbooks: "Container won't start," "Image bloat diagnosis," "Registry auth failure," "Multi-arch build broken"


- 1-2 ADRs (e.g., "Why distroless vs Alpine," "Why ghcr.io vs Docker Hub")
- Weekly log

---

## 8. CONTRIBUTE

- Docker docs: small clarification or example
- A small fix to a popular base-image project
- A blog post (when blog goes live) about a non-obvious Dockerfile pattern you discovered

---

## What ships from this phase

- **Arc 2 service containerized + published to a registry**
- **docker-compose for local dev** working
- **Container runbooks** in `chronicle`
- **Pattern OUTLINEs**: containerization-as-user, image-layers, multi-stage-builds

---

## Learning loop cadence

```
Week 1     PROBLEM + PRINCIPLES 2.1-2.2 (containerization, layers)
           First Dockerfile; understand layer cache

Week 2     PRINCIPLES 2.3-2.4 (multi-stage, hygiene)
           Multi-stage Dockerfile; non-root user; size reduction

Week 3     PRINCIPLES 2.5 (compose)
           docker-compose.yml; full local dev environment

Week 4     PRINCIPLES 2.6 (registry)
           CI publish to ghcr.io; multi-arch builds

Week 5     COMPARE: Buildpacks or Nix
           chronicle runbooks

Week 6     OPERATE + CONTRIBUTE
           Exit Test
```

---

## Validation criteria

```
[ ] Arc 2 service containerized with multi-stage Dockerfile <100MB
[ ] docker-compose.yml brings up full local dev environment
[ ] CI publishes to ghcr.io on release
[ ] Trivy/Scout scan clean (or accepted with rationale)
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 3-4 container runbooks
[ ] 1-2 ADRs
[ ] Pattern entries deepened STUB → OUTLINE:
    - containerization-as-user
    - image-layers
    - multi-stage-builds
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Take a small service (provided source). Write a multi-stage Dockerfile that produces a < 50MB image running as non-root. Write a docker-compose.yml with the service + Postgres. Verify it boots end-to-end.

### Part 2: Diagnose (45 min)
A container scenario (provided: e.g., "this container starts and immediately exits with code 137"). Possible causes: OOM-killed (memory limit too low); PID 1 not handling SIGTERM; missing entrypoint script.

### Part 3: Articulate (15 min)
~400 words: *"You're asked why your service ships in a container instead of a venv. Walk through the rationale and what specifically containers give you over a venv-based deploy."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| `FROM ubuntu` for a Go service | 100MB+ image for a 10MB binary |
| Running as root inside the container | One escape vulnerability → host compromise |
| Tagging only `:latest` | Not a version; cannot deterministically deploy |
| `COPY .` early in the Dockerfile | Invalidates the cache on every code change |
| Skipping the vulnerability scan | CVEs ship with you; ignorance ≠ absence |

---

## Patterns touched this phase

- `containerization-as-user`: first OUTLINE
- `image-layers`: first OUTLINE
- `multi-stage-builds`: first OUTLINE

---

→ Next: [Phase 14: Message Queues + Event-Driven Patterns](/program/arc-2/phase-14/)
