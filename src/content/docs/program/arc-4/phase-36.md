---
title: "Deep Learning Fundamentals (PyTorch)"
description: "Phase 36 of /root Arc 4: PyTorch from tensors up. Autograd, NN modules, training loops, optimizers, common architectures (MLP, CNN, basic attention). The DL substrate every Arc 5 LLM/agent phase builds on.."
tags: [arc-4, ml, deep-learning, pytorch]
arc: 4
phase: 36
---

> Sixth phase of Arc 4. Deep learning from tensors up.

[Phase 35](/program/arc-4/phase-35/) showed classical ML wins on tabular. This phase teaches deep learning for the cases where it wins: unstructured data (text, images, audio), large datasets, when the patterns are too rich for hand-engineered features. PyTorch is the canonical framework in 2026. By phase end you've trained MLPs, CNNs, and a basic attention model from scratch, understanding the math + the code at each step.

This phase is the substrate every Arc 5 LLM/agent phase builds on. LLMs are transformers, transformers are attention, attention is matrix math on tensors. Master tensors here; the rest of Arc 5 reads naturally.

---

## Prerequisites

> - [Phase 35](/program/arc-4/phase-35/) complete; classical ML fluency
> - GPU available (local NVIDIA or cloud burst); Apple Silicon MPS works for small models
> - You accept: **deep learning is just calculus and linear algebra with good engineering. Most of the work is data + plumbing.**

---

## Why this phase exists

You can't operate a Arc 5 LLM gateway without understanding what an LLM is computing. You can't reason about distributed training without understanding the training loop. You can't tune fine-tuning without understanding the loss + optimizer + autograd. This phase installs the foundations so Arc 5 is engineering, not magic.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have unstructured data (text, images, audio) or structured data with rich nonlinear patterns. Classical ML doesn't capture the relevant structure. You want a model that learns hierarchical representations from data: that's deep learning.

PyTorch is the canonical framework. TensorFlow + JAX are the alternatives. Hugging Face Transformers is the standard library for transformer models.

---

## 2. PRINCIPLES

### 2.1 Tensors and autograd

A tensor is a multi-dimensional array with gradients. PyTorch's autograd tracks operations and computes gradients via reverse-mode automatic differentiation.

→ Pattern: `autograd`

**Investigate:**
- Walk a small computation: `y = (x ** 2).sum(); y.backward(); print(x.grad)`. What did PyTorch do?
- What's the difference between `tensor.detach()` and `with torch.no_grad():`?
- Why does `.backward()` accumulate gradients?

### 2.2 Gradient descent + backpropagation

Gradient descent: move weights in the negative-gradient direction to reduce loss. Backpropagation: efficient gradient computation via the chain rule.

→ Pattern: `gradient-descent`, `backpropagation`

**Investigate:**
- Walk SGD updates by hand on a 2-parameter problem.
- Why is mini-batch SGD better than full-batch in practice (memory + noise → escape local minima)?
- What's the role of learning rate, and what do schedulers do?

### 2.3 NN modules + the training loop

PyTorch's `nn.Module` is the abstraction. A training loop is: forward → loss → backward → optimizer.step → repeat.

**Investigate:**
- Walk a minimal MLP class. What does `__init__` + `forward` do?
- Why is `model.train()` vs `model.eval()` significant? (Dropout, BatchNorm behavior.)
- What's `optimizer.zero_grad()` and why is forgetting it the most common PyTorch bug?

### 2.4 Optimizers and learning rate schedules

SGD, momentum, Adam, AdamW. Each has a use case. Learning rate schedules (cosine, linear, constant) shape the trajectory.

**Investigate:**
- Walk Adam's update rule. What's it adapting?
- Why is AdamW preferred over Adam for many cases (weight decay correctness)?
- What's "warmup" and why does it matter for transformer training?

### 2.5 Common architectures: MLP, CNN, attention

- **MLP**: fully connected layers; baseline for any task.
- **CNN**: convolutional layers; image-shaped data; locality + translation invariance.
- **Attention**: query-key-value; transformer's core operation. Phase 36 introduces basic attention; Arc 5 deepens.

→ Pattern: `attention-mechanism`: first OUTLINE (Arc 5 deepens)

**Investigate:**
- Walk a convolution operation: 3×3 kernel over an image. What's it computing?
- Walk basic self-attention: Q × K^T / sqrt(d), softmax, × V. Why does each piece exist?
- Why did transformers replace RNNs for sequence modeling? (Hint: parallelism + better long-range dependencies.)

### 2.6 Overfitting, regularization, the validation curve

Same patterns as classical ML, plus DL-specific ones: dropout, weight decay, data augmentation, early stopping.

**Investigate:**
- Walk a learning curve where you've overfit. What does it look like?
- When is more data better than more regularization?
- Why is dropout's "scale at inference" trick necessary?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Framework | **PyTorch**; TensorFlow; JAX | PyTorch: research + production standard. TF: enterprise legacy. JAX: research-leaning, fast. |
| Architecture for tabular | XGBoost (Phase 35); MLP | XGBoost usually wins; MLP only competitive with very large data + careful regularization. |
| Architecture for sequences | LSTM/GRU; Transformer | LSTM: simpler, weaker. Transformer: better, more compute. |
| Optimizer | SGD + momentum; AdamW | SGD: classical, careful tuning. AdamW: modern default. |

---

## 4. TOOLS (as of 2026-06)

- **PyTorch 2.x**
- **`einops`**: tensor reshaping that's readable
- **`torch.compile`**: JIT compiler for PyTorch 2+
- **Hugging Face Transformers**: pretrained models + tokenizers
- **Hugging Face Datasets**: public datasets

### Reading
- "Deep Learning with PyTorch" (Stevens et al.)
- "Dive into Deep Learning" (Zhang et al., free online)
- The original "Attention Is All You Need" paper (Vaswani et al.)
- Karpathy's "Let's build GPT from scratch" video: the canonical intro

---

## 5. MASTERY: Three models end-to-end

Build three models from scratch (no high-level wrappers; PyTorch + numpy only for the first two):

### 5.1 MLP for a tabular task

Same data as Phase 35. Train an MLP. Compare to XGBoost. Reflect.

### 5.2 CNN for an image task

MNIST or CIFAR-10 (or your own image dataset). Train a small CNN. Reach > 90% on MNIST.

### 5.3 Basic attention model

Implement a minimal self-attention layer + train a tiny transformer (~10M params or fewer) on a small text task. This is Karpathy-style "build GPT from scratch."

### 5.4 Operational depth checklist

```
[ ] PyTorch installed; GPU detected (or MPS for Apple Silicon)
[ ] MLP trained on tabular data; compared to XGBoost
[ ] CNN trained on MNIST/CIFAR; reached >90% on MNIST
[ ] Attention layer implemented from scratch
[ ] Tiny transformer trained on a text task
[ ] Profiled training: GPU util, memory, throughput
[ ] Used a learning rate scheduler; observed the loss curve
[ ] Applied dropout + weight decay; observed regularization effect
[ ] Saved + loaded model checkpoints
[ ] Used Hugging Face Transformers to load a pretrained model; observe vs your from-scratch impl
```

---

## 6. COMPARE: JAX or Hugging Face

Pick one:
- **JAX**: reimplement your attention model in JAX + Flax. Reflect on functional style + JIT.
- **HF Transformers**: fine-tune a pretrained BERT on your text task. Reflect on what HF abstracts.

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks: GPU OOM, training loss NaN, model checkpoint loading failure
- 1-2 ADRs (PyTorch over TF; AdamW default)
- Weekly log

---

## 8. CONTRIBUTE

- PyTorch: docs, examples
- Hugging Face Transformers: community models, docs
- A public ML notebook or blog post (when blog is live)

---

## What ships from this phase

- **Three trained DL models** (MLP, CNN, tiny transformer)
- **Notebooks repo** updated
- **Confidence reading PyTorch source**

---

## Validation criteria

```
[ ] MLP, CNN, tiny transformer all trained from scratch
[ ] Attention layer implemented from scratch
[ ] Compared to pretrained via HF
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 DL runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - autograd → OUTLINE
    - gradient-descent → OUTLINE
    - backpropagation → OUTLINE
    - attention-mechanism → OUTLINE (Arc 5 deepens)
[ ] Exit Test passed
```

---

## Exit Test

**Time: 3 hours.**

### Part 1: Build (120 min)
Implement a tiny transformer from scratch (≤ 50 lines of PyTorch). Train it on a small text task. Get loss to converge.

### Part 2: Diagnose (45 min)
A training scenario (loss is NaN; model isn't learning; GPU OOM). Possible causes for each.

### Part 3: Articulate (15 min)
~400 words: *"Walk a single backprop step through a 2-layer MLP. Cover forward pass, loss computation, gradient computation per layer, weight update."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Forgetting `optimizer.zero_grad()` | Gradients accumulate; training breaks silently |
| Using `.train()`/`.eval()` interchangeably | BatchNorm + Dropout behave differently; results lie |
| Loading data without `num_workers > 0` | GPU idle waiting on data |
| Not profiling training | You optimize the wrong thing |
| Reaching for SOTA architectures before baselines | Sometimes a strong baseline + good data beats a complex model |

---

## Patterns touched this phase

- `autograd`: OUTLINE
- `gradient-descent`: OUTLINE
- `backpropagation`: OUTLINE
- `attention-mechanism`: OUTLINE (Arc 5 deepens)

---

→ Next: [Phase 37: Distributed Training (KubeRay)](/program/arc-4/phase-37/)
