---
title: "Python ML Stack"
description: "Phase 34 of /root Arc 4: the ML lingua franca. numpy, pandas, scikit-learn fundamentals. Vectorization muscle, train/test split, cross-validation, feature scaling. The foundation every ML phase builds on.."
tags: [arc-4, ml, python, numpy, pandas, sklearn]
arc: 4
phase: 34
---

> Fourth phase of Arc 4. The ML lingua franca.

This phase makes you fluent in the Python ML stack: numpy, pandas, scikit-learn, at the level where you stop thinking about syntax and start thinking about *what* to compute. Vectorization replaces for-loops. Pandas DataFrames replace dict-of-lists. scikit-learn's API conventions (fit/transform/predict) become reflex. By phase end you've trained a small model end-to-end on a real dataset with proper train/test discipline.

This is also where local ML development lives. The deployment pieces (operator-managed Ray, KServe) come in Phases 37-38. Phase 34 is your dev loop.

---

## Prerequisites

> - Arc 1 Python fluency (Phase 2); Arc 3 distributed-systems understanding (Phase 21)
> - A modest dataset to learn on: your own chronicle weekly logs work great for a classification or anomaly-detection task

---

## Why this phase exists

Most engineers who say "I know ML" mean "I've used sklearn once." This phase installs the *operational* fluency: not just calling `model.fit()` but reasoning about features, leakage, vectorization, memory, the bias-variance trade-off. The fluency that lets you read any ML codebase without flinching.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have data. You want to predict something from it: a label, a number, a cluster. The workflow is: explore → preprocess → train → evaluate → iterate. The Python ML stack (numpy + pandas + sklearn) is the canonical toolset for this workflow at small-to-medium scale.

---

## 2. PRINCIPLES

### 2.1 Vectorization as the muscle

In ML, for-loops are slow. Vectorized operations (numpy arrays, pandas Series) run in C, 100-1000× faster. The mental shift is "think in arrays, not elements."

→ Pattern: `vectorization-as-pattern`

**Investigate:**
- Why is numpy fast? (Hint: contiguous memory, SIMD, no Python interpreter overhead per element.)
- Walk a vectorized operation step-by-step in memory.
- When is vectorization the wrong tool? (Hint: irregular control flow.)

### 2.2 Train / test / validation split

You can't evaluate a model on the data you trained it on (it memorizes). Split: train (fit), validation (tune), test (final report). Never let the test set touch hyperparameter tuning.

→ Pattern: `train-test-split`

**Investigate:**
- What's data leakage, and what does it look like?
- When is a simple train/test split insufficient (time-series, grouped data)?
- Why is the test set held out *forever* until the final report?

### 2.3 Cross-validation

K-fold cross-validation gives a more reliable performance estimate by averaging across multiple splits. Stratified, group, time-series CV handle structure in the data.

→ Pattern: `cross-validation`

**Investigate:**
- Walk 5-fold CV. What's averaged?
- When does CV underestimate generalization error (data leakage across folds)?
- How does GroupKFold differ from KFold, and when does it matter?

### 2.4 Feature engineering and scaling

Many models assume features on similar scales. Standardization (z-score), normalization (min-max), and log transforms each have a use case.

**Investigate:**
- Why does StandardScaler matter for SVM but not for decision trees?
- What's leakage in scaling, and how does sklearn's Pipeline prevent it?
- When are categorical encodings the bottleneck (one-hot, target, ordinal)?

### 2.5 Bias-variance trade-off

A model can underfit (high bias, too simple) or overfit (high variance, too complex). The sweet spot depends on data size, complexity, regularization.

**Investigate:**
- Walk learning curves: training error + validation error vs training set size.
- What's regularization, and how does L1 vs L2 differ?
- Why is "deep learning has high variance" the operational reality for small datasets?

### 2.6 The sklearn API as design pattern

`fit(X, y)`, `transform(X)`, `predict(X)`, `score(X, y)`. Consistent across every estimator. Pipelines chain transformers + estimators. This is the API that defined the modern ML ecosystem.

**Investigate:**
- Why is the `Pipeline` object the right way to do preprocessing + modeling?
- What's `fit_transform` vs `fit` then `transform`?
- How does this API translate to PyTorch / TensorFlow (it doesn't, exactly)?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| DataFrame library | **pandas**; Polars; DuckDB | pandas: ubiquitous, slow. Polars: fast, Rust-backed, less ubiquitous. DuckDB: SQL + DataFrame hybrid. |
| Array library | numpy; cupy (GPU); jax (auto-diff) | numpy: standard. cupy: GPU. jax: research / numerical research. |
| ML library | scikit-learn; XGBoost; LightGBM (Phase 35 deepens) | sklearn: general. XGBoost/LightGBM: tabular winner. |

---

## 4. TOOLS (as of 2026-06)

- **numpy**, **pandas**, **scikit-learn**
- **`polars`** as fast pandas alternative
- **`jupyterlab`** for exploratory dev
- **`uv`** for env management (consistent with Arc 1 Python tooling)

### Reading
- "Python for Data Analysis" (Wes McKinney, 3rd ed.): pandas canonical
- "Hands-On Machine Learning" (Géron, 3rd ed.): sklearn-flavored ML intro
- scikit-learn user guide (free, comprehensive)
- "An Introduction to Statistical Learning" (James et al., 2nd ed.): free online

---

## 5. MASTERY: One model end-to-end on real data

```
[ ] Pick a real dataset (your chronicle logs, public dataset, your day-job data with permission)
[ ] Exploratory data analysis: distributions, missing values, correlations
[ ] Vectorize all your processing: no for-loops
[ ] Split: train / validation / test
[ ] Build a Pipeline with preprocessing + estimator
[ ] Cross-validate; report mean + std
[ ] Tune hyperparameters (GridSearchCV or RandomizedSearchCV) on validation
[ ] Evaluate on held-out test set: once, at the end
[ ] Write a model card documenting: problem, data, model, performance, limitations
[ ] Profile your training loop: where is time spent?
```

---

## 6. COMPARE: Polars or DuckDB

Reimplement one of your pandas pipelines in Polars (Rust-backed, fast) or DuckDB (SQL over DataFrames). Reflect on speed + ergonomics.

400-word reflection.

---

## 7. OPERATE

- Notebook discipline: one notebook per experiment; commit notebooks to a `notebooks/` repo; export results as markdown reports
- 1-2 runbooks (e.g., "Reproduce a notebook result"; "Diagnose data leakage")
- Weekly log

---

## 8. CONTRIBUTE

- scikit-learn: docs, examples
- pandas: documentation
- A small public Kaggle-style competition for practice (your portfolio doesn't need to win; the practice is the point)

---

## What ships from this phase

- **First trained model** documented with model card
- **Notebooks repo** on GitHub (public OK; sensitive data scrubbed)
- **Vectorization muscle**: you'll read ML code without flinching

---

## Validation criteria

```
[ ] End-to-end model on real data with proper train/test discipline
[ ] Pipeline-based preprocessing (no leakage)
[ ] Cross-validation done properly
[ ] Model card written
[ ] All 10 operational depth checks
[ ] Polars/DuckDB compare reflection (400 words)
[ ] 1-2 runbooks
[ ] Pattern entries:
    - vectorization-as-pattern → OUTLINE
    - train-test-split → OUTLINE
    - cross-validation → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2 hours.**

### Part 1: Build (75 min)
Given a new dataset (provided), build a complete pipeline: preprocess + model + evaluate. Properly cross-validated. Model card written.

### Part 2: Diagnose (30 min)
A leakage scenario: model performs great on validation, terrible on a separate test set. Identify the leakage source.

### Part 3: Articulate (15 min)
~400 words: *"When would you reach for pandas vs Polars vs DuckDB for a 10GB CSV processing task?"*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| for-loops over pandas rows | 100-1000× slower than vectorized |
| Touching the test set during hyperparameter tuning | Inflated performance estimate |
| Scaling before splitting | Test-set statistics leak into preprocessing |
| Single train/test split for small data | High variance in estimate; use CV |
| `fit_transform` on test data | Should be `transform` only |

---

## Patterns touched this phase

- `vectorization-as-pattern`: OUTLINE
- `train-test-split`: OUTLINE
- `cross-validation`: OUTLINE

---

→ Next: [Phase 35: Classical ML Engineering](/program/arc-4/phase-35/)
