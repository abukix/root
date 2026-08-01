---
title: "Classical ML Engineering"
description: "Phase 35 of /root Arc 4: regression, classification, ensembles, XGBoost, recommendations. The non-deep-learning ML that wins on tabular data and doesn't need a GPU. When to reach for each.."
tags: [arc-4, ml, classical-ml, xgboost, recommendations]
arc: 4
phase: 35
---

> Fifth phase of Arc 4. The non-deep-learning ML that still wins most production tabular use cases.

The narrative in 2026 ML discourse is all transformers, all the time. The production reality is that *most ML in business is still XGBoost*: tabular data, structured features, supervised learning, no GPU needed. Senior ML engineers reach for classical ML first and only escalate to deep learning when the data shape demands it. This phase builds that judgment.

By phase end you've shipped working models in regression, classification, ensembles (XGBoost specifically), and recommendation systems. You can defend the choice "this is XGBoost work, not deep learning" with data.

---

## Prerequisites

> - [Phase 34](/program/arc-4/phase-34/) complete; Python ML stack fluency
> - At least one real tabular dataset to work with

---

## Why this phase exists

The deep-learning-first mentality has produced a generation of engineers who reach for PyTorch when scikit-learn + XGBoost would have outperformed it with 1% the operational cost. Senior engineers do the math: GPU costs, training time, model deployment complexity, debugging difficulty. Classical ML wins more often than the narrative suggests.

---

## The pattern-first frame

Same eight steps.

---

## 1. PROBLEM

You have tabular data (rows × columns, possibly with a time dimension). You want to predict labels, regress numerical targets, or rank items. The patterns at this scale: regression (continuous targets), classification (discrete labels), ensembles (combine many weak learners), recommendations (rank items per user).

---

## 2. PRINCIPLES

### 2.1 Regression: predicting continuous targets

Linear regression, Ridge, Lasso, Elastic Net. The principles: minimize squared error, regularize to prevent overfitting, interpret coefficients.

**Investigate:**
- Walk linear regression's closed-form solution. Why doesn't it scale beyond moderate features?
- L1 vs L2 regularization: when does each fit?
- What's heteroscedasticity, and why does it bite OLS regression?

### 2.2 Classification: predicting discrete labels

Logistic regression, decision trees, SVMs (briefly). For multi-class: one-vs-rest, softmax.

**Investigate:**
- Why does logistic regression use sigmoid + log-likelihood, not least squares?
- Walk a decision tree split: how does it pick the split point?
- What's class imbalance, and what mitigations exist?

### 2.3 Ensembles: bagging and boosting

Bagging (Random Forest): many trees, averaged. Boosting (XGBoost, LightGBM, CatBoost): sequentially correct errors. Both win on tabular data; boosting usually wins by more.

→ Pattern: `ensemble-methods`

**Investigate:**
- Walk Random Forest: what's bagged? What's the variance reduction mechanism?
- Walk gradient boosting: what's the residual? Why does each tree fit the residual?
- When does Random Forest beat XGBoost? (Hint: small data, less hyperparameter tuning budget.)

### 2.4 Gradient boosting at production scale

XGBoost is the production tabular winner. LightGBM is faster on large data. CatBoost handles categorical features natively. Same family, different optimizations.

→ Pattern: `gradient-boosting`

**Investigate:**
- What does XGBoost's regularization do beyond standard gradient boosting?
- Why is `early_stopping` a non-negotiable production practice?
- How do XGBoost's monotonic constraints work, and when do you reach for them?

### 2.5 Recommendation systems

Collaborative filtering (user × item matrix), matrix factorization (SVD, ALS), content-based filtering, hybrid. The patterns: matrix decomposition, similarity computation, cold-start handling.

→ Pattern: `recommendation-patterns`

**Investigate:**
- Walk ALS (alternating least squares) for matrix factorization.
- What's the cold-start problem, and how do hybrid recommenders handle it?
- When does deep learning beat matrix factorization for recommendations (large catalogs, complex interactions)?

### 2.6 Feature engineering as the actual work

In classical ML, feature engineering matters more than model choice. Domain knowledge, interaction features, log-transforms, target encoding, time-based features.

**Investigate:**
- For your domain (whatever your tabular dataset is about): brainstorm 5 features beyond the raw columns.
- What's target encoding, and where does it go wrong (leakage if not done in CV)?
- Why is feature engineering "the unsexy work that wins"?

---

## 3. TRADE-OFFS

| Decision | Options | Cost |
|---|---|---|
| Tabular winner | **XGBoost**; LightGBM; CatBoost; Random Forest | XGBoost: most mature. LightGBM: fastest. CatBoost: categorical-native. RF: simpler, weaker. |
| Regression baseline | Linear + Ridge/Lasso; XGBoost regression | Linear: interpretable. XGBoost: usually better performance. |
| Classification baseline | Logistic regression; XGBoost classifier | Same trade-off. |
| Recommendations | Matrix factorization (ALS); two-tower (Arc 5 with DL); rule-based | MF: classical baseline. Two-tower: when DL is justified. Rules: cold-start. |

---

## 4. TOOLS (as of 2026-06)

- **scikit-learn**
- **XGBoost**, **LightGBM**, **CatBoost**
- **`implicit`** for ALS recommendations
- **`shap`** for model interpretability

### Reading
- "Hands-On Machine Learning" (Géron, 3rd ed.): Ch. 5-7
- XGBoost paper (Chen + Guestrin): short, foundational
- "Recommendation Systems Handbook" (Ricci et al.)
- "An Introduction to Statistical Learning" (James et al.): comprehensive

---

## 5. MASTERY: Ship a classical ML model

```
[ ] Train an XGBoost classifier or regressor on your dataset
[ ] Tune hyperparameters via RandomizedSearchCV
[ ] Use early stopping; understand why it matters
[ ] Build a small recommendation system (ALS) for some user/item context (your weekly log "what did I read" if no better data)
[ ] Explain a prediction with SHAP values
[ ] Compare your XGBoost result against a logistic regression baseline; defend the gap
[ ] Add monotonic constraints if domain knowledge supports them
[ ] Implement at least 5 engineered features beyond raw columns; measure their lift
[ ] Profile training: where does XGBoost spend time?
[ ] Save model as a portable artifact (joblib for sklearn, .json for XGBoost)
```

---

## 6. COMPARE: LightGBM or CatBoost

Train the same problem with LightGBM (or CatBoost). Compare speed, accuracy, ergonomics.

400-word reflection.

---

## 7. OPERATE

- 2-3 runbooks: model drift detection (taste; Phase 38 deepens), feature engineering checklist, hyperparameter search budget
- 1-2 ADRs (XGBoost default vs LightGBM; when to escalate to DL)
- Weekly log

---

## 8. CONTRIBUTE

- XGBoost: docs, examples
- scikit-learn: docs
- Public Kaggle-style competition (practice + visibility)

---

## What ships from this phase

- **First production-shaped classical ML model**: XGBoost, with SHAP interpretation
- **Small recommendation system**
- **Notebooks repo** updated

---

## Validation criteria

```
[ ] XGBoost model trained, tuned, evaluated, interpreted
[ ] Recommendation system (ALS or similar)
[ ] SHAP explanations for top predictions
[ ] All 10 operational depth checks
[ ] Compare reflection (400 words)
[ ] 2-3 runbooks
[ ] 1-2 ADRs
[ ] Pattern entries:
    - ensemble-methods → OUTLINE
    - gradient-boosting → OUTLINE
    - recommendation-patterns → OUTLINE
[ ] Exit Test passed
```

---

## Exit Test

**Time: 2.5 hours.**

### Part 1: Build (90 min)
Given a tabular dataset (provided), ship XGBoost end-to-end with: feature engineering, cross-validation, hyperparameter tuning, SHAP explanations, model card.

### Part 2: Reflect (30 min)
Compare your XGBoost result to a logistic regression baseline. Defend the gap. Identify two features that drove most of the improvement.

### Part 3: Articulate (30 min)
~600 words: *"Argue for/against deep learning on a specific tabular use case (your choice). Cite production cost, training time, deployment complexity, performance."*

---

## Anti-patterns

| Anti-pattern | Why |
|---|---|
| Reaching for deep learning on tabular data | XGBoost usually wins, with 1% the operational cost |
| Skipping feature engineering | The unsexy work is where most performance lives |
| Tuning XGBoost without early stopping | You'll overfit on the training set |
| Ignoring class imbalance | Accuracy becomes meaningless |
| No SHAP / interpretation in production | "Why did the model say no?" becomes unanswerable |

---

## Patterns touched this phase

- `ensemble-methods`: OUTLINE
- `gradient-boosting`: OUTLINE
- `recommendation-patterns`: OUTLINE

---

→ Next: [Phase 36: Deep Learning Fundamentals (PyTorch)](/program/arc-4/phase-36/)
