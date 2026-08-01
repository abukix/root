---
title: "Cloud Foundation: AWS Deep"
description: "Phase 23 of /root Arc 3: AWS at primitive depth. VPC, IAM, RDS, EKS, secrets, billing. Operate a small production-shaped topology end-to-end.."
tags: [arc-3, infrastructure, cloud, aws, iam]
arc: 3
phase: 23
---

> Seventh phase of Arc 3. One cloud, deep.

[Phase 22](/program/arc-3/phase-22/) declared cloud resources via Terraform + Crossplane (`forge`). This phase operates them: AWS at primitive depth. VPC, IAM, managed services (RDS, EKS, S3, Secrets Manager), cost discipline. The bar isn't certification. The bar is operating a small production-shaped topology and being able to defend every choice.

By phase end you can debug an IAM policy from first principles, design a network topology that satisfies real security requirements, reason about which managed services earn their cost vs are operational laziness, and keep your AWS bill under $50/month with practiced destroy-on-exit discipline.

---

## Prerequisites

> - [Phase 22](/program/arc-3/phase-22/) complete; forge shipped
> - AWS account with Free Tier; hardware MFA on root account
> - Budget alerts at $5, $25, $50
> - You accept: **you are not learning AWS. You are learning what utility computing is, with AWS as the canonical implementation.**

---

## Why this phase exists

Every later year assumes cloud fluency. Arc 4's data tier may run partially on AWS (managed Postgres, S3 for objects, GPU instances). Your next employer will have one cloud (or three).

Senior engineers reason about cloud trade-offs from primitive understanding: *what does this managed service actually save me, vs. what does it cost in lock-in and opacity?*

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You want infrastructure without owning physical machines. Servers when you need them, gone when you don't. Managed databases without DBAs. Object storage that scales to petabytes. Networking without buying switches. The trade-off: someone else's hardware, pricing, reliability guarantees.

That's the cloud problem. AWS, GCP, Azure are the three hyperscalers, solving it slightly differently.

---

## 2. PRINCIPLES

### 2.1 IAM as the security spine

Every action against every AWS resource is authorized by IAM. Principals, actions, resources, conditions. Get IAM right and you have least-privilege by default.

→ Pattern: `least-privilege`: **DEEP target this phase**

**Investigate:**
- Walk what happens when an IAM role assumes another role. What policies apply at each step?
- Identity-based vs resource-based policy?
- Why is "AWS managed" not the same as "well-scoped"?

### 2.2 VPC and network primitives

A VPC is your slice of AWS's network. Subnets, route tables, security groups, NACLs, VPC endpoints, NAT gateways.

**Investigate:**
- Why public AND private subnets? Why isn't private enough?
- Security Group vs Network ACL?
- When do you reach for VPC endpoints vs public internet?

### 2.3 Managed services as primitive trade

Every managed service is a trade: ops you don't do vs cost + lock-in. RDS, EKS, S3 each save real work and cost premiums.

**Investigate:**
- When is RDS right vs Postgres on EC2?
- What does EKS take off your plate vs what you still operate?
- Why do teams who try self-hosted MinIO eventually move back to S3?

### 2.4 Cost as architecture

In on-prem you buy hardware once. In cloud you pay continuously. This changes architecture: idle VMs are expensive, cross-AZ traffic is expensive, data egress is *very* expensive.

**Investigate:**
- Why is "the same workload" 2-3× more expensive in AWS if you didn't design for cloud cost?
- Actual cost of egress?
- Reserved Instances vs Savings Plans vs Spot vs On-Demand: what does each optimize?

### 2.5 Threat modeling at the cloud boundary

The cloud is a shared substrate. Your IAM policies, network rules, and secrets practices are the entire defense surface.

**Investigate:**
- Top-3 AWS misconfigurations leading to S3 data exposure?
- How does GuardDuty detect a credential leak?
- "Your responsibility vs AWS's responsibility" in the shared-responsibility model?

### 2.6 Control plane vs data plane

AWS APIs operate on a *control plane* (manage resources). Actual data flows over a separate *data plane*. Different reliability characteristics.

**Investigate:**
- Why can a region's control plane be slow while data plane is fine?
- What's the AWS service health dashboard hiding?
- When does control-plane latency matter operationally?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Compute | EC2; EKS; ECS; Fargate; Lambda | EC2: max control. EKS: standard K8s. Fargate: serverless containers. Lambda: event-driven, cold starts |
| Database | RDS; Aurora; DynamoDB; self-managed | RDS: managed Postgres/MySQL. Aurora: AWS-optimized. DynamoDB: NoSQL. Self-managed: lowest $, highest ops |
| Secrets | Secrets Manager; Parameter Store; KMS-encrypted | SM: rotation, more $. PS: free tier. KMS: cheap, you handle lifecycle |

---

## 4. TOOLS (as of 2026-06)

- **`aws` CLI v2**
- **`aws-vault`**: credential isolation
- **`saml2aws`**: SSO into AWS
- **AWS Cost Explorer**: open weekly
- **CloudWatch**: logs + metrics native
- **Steampipe**: query AWS like a database

### Reading
- "The AWS Well-Architected Framework": Security + Cost pillars
- "AWS Certified Solutions Architect - Associate" exam guide (not the cert, the survey)
- AWS docs (definitive, rarely beautiful)

---

## 5. MASTERY: Small production-shaped topology

### 5.1 The target

Via Terraform (lifted from forge):

- VPC with public + private subnets across 2 AZs
- EKS small (3 nodes, t3.medium)
- RDS Postgres in private subnet, multi-AZ for HA
- S3 buckets for state and artifacts
- Secrets Manager for DB password, rotated automatically
- IRSA for EKS service accounts
- Budget alerts at $5, $25, $50

Then deploy a containerized `beacon` to EKS, talking to RDS, with secrets from Secrets Manager.

### 5.2 Operational depth checklist

```
[ ] Provision via forge; destroy at end of session
[ ] Decode an IAM denial: read error, find missing permission, narrow grant
[ ] Configure IRSA so a Pod gets temporary credentials without storing keys
[ ] Set up RDS automated backups; restore a point-in-time backup; verify
[ ] Force RDS failover; observe what client sees
[ ] Configure CloudTrail; trace a suspicious API call back to the principal
[ ] Set up budget alert; trigger; verify SNS notification
[ ] Inspect AWS Config compliance findings; remediate at least one
[ ] Use Steampipe to query "every S3 bucket without encryption" across your account
[ ] Tear down; verify no orphaned resources via Cost Explorer 24 hours later
```

---

## 6. COMPARE: GCP equivalents (light)

Map AWS primitives to GCP equivalents (200-word reflection). Deep GCP compare is [Phase 24](/program/arc-3/phase-24/).

---

## 7. OPERATE

- 3-4 runbooks: IAM denial, RDS failover, sudden cost spike, EKS node failing to join
- 1-2 ADRs (RDS over self-managed Postgres)
- Weekly log

---

## 8. CONTRIBUTE

- AWS docs: small PRs to amazon-archives or aws-samples
- Terraform AWS provider
- `aws-vault`

---

## What ships from this phase

- **AWS side of basecamp**: VPC + IAM + RDS + EKS small + Secrets Manager + budget alerts
- **`beacon` deployed on EKS** as parallel deployment to homelab K3s
- **AWS runbooks**
- **$50 budget honored**: cost discipline is a verifiable artifact

---

## Validation criteria

```
[ ] AWS topology operational + destroyed cleanly (no orphan resources)
[ ] beacon deployed on EKS
[ ] All 10 operational depth checks
[ ] GCP compare reflection (200 words)
[ ] 3-4 AWS runbooks
[ ] 1-2 ADRs
[ ] Total AWS spend < $50
[ ] Pattern entries:
    - least-privilege → DEEP
    - defense-in-depth → OUTLINE
    - threat-modeling → first OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (90 min)
Fresh AWS account. Provision via forge: VPC + EKS small + RDS Postgres + S3 + Secrets Manager. IRSA configured so a Pod can read the secret. Budget alert at $5.

### Part 2: Diagnose (60 min)
Pod in EKS getting `AccessDenied` calling S3 despite IAM role with `s3:GetObject` on `*`. Diagnose end-to-end.

### Part 3: Cost analysis (30 min)
Look at Cost Explorer for the phase. Top 3 line items. Explain each. Propose one optimization.

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Using root account for anything | One credential leak = total compromise |
| Wildcard IAM policies "for now" | Becomes "production" without anyone deciding |
| Hardcoding credentials in code | IRSA or Secrets Manager. Always. |
| Leaving resources up "I'll need them tomorrow" | This is how cloud bills become incidents |
| Trusting AWS-managed policies as "least-privilege" | Most are over-permissive. Read them. |

---

## Patterns touched this phase

- `least-privilege`: **DEEP**
- `defense-in-depth`: OUTLINE
- `threat-modeling`: first OUTLINE

---

→ Next: [Phase 24: Multi-cloud Synthesis](/program/arc-3/phase-24/)
