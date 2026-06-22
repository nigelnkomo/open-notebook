---
title: "Structure and Interpretation of Computer Programs"
permalink: /notebooks/sicp/
excerpt: "Notes on Abelson & Sussman's classic — evaluation, abstraction, metacircular evaluation, and the register machine."
last_modified_at: 2026-06-18T00:00:00+00:00
field: systems
authors: "Abelson, Sussman"
toc: true
toc_label: Table of Contents
---

## About This Book

*Structure and Interpretation of Computer Programs* (SICP) is one of the classic textbooks in computer science, known for its deep treatment of the fundamental ideas of programming. It is freely available online under a Creative Commons license.

**Read online**: [mitpress.mit.edu/sicp/](https://mitpress.mit.edu/sicp/)

---

## Chapter 1. Building Abstractions with Procedures

### 1.1 The Elements of Programming

Every powerful language has three mechanisms:

- **Primitive expressions** — the simplest entities the language is concerned with.
- **Means of combination** — compound elements are built from simpler ones.
- **Means of abstraction** — compound elements can be named and manipulated as units.

In Scheme (the book's dialect of Lisp), numbers are primitives, `+` and `*` are primitive procedures, and combination is simply a parenthesised list.

**Notable idea**: *procedures as black-box abstractions*. A procedure's implementation details should be hidden from its callers; only its contract matters.

### 1.2 Procedures and the Processes They Generate

The shape of the process depends on how the procedure is written:

- **Linear recursion** — grows then shrinks (e.g., naive factorial).
- **Linear iteration** — fixed space, state variables track progress.
- **Tree recursion** — branches exponentially (e.g., naive Fibonacci).

The key insight is that recursive *processes* (which require deferred operations) are different from recursive *procedures* (syntactic self-reference). A recursive procedure can generate an iterative process if it is written in tail-recursive style.

### 1.3 Formulating Abstractions with Higher-Order Procedures

Procedures that take other procedures as arguments or return them as results are *higher-order*. This is where the expressive power of functional programming starts to show:

- `sum` can be abstracted over the term, the next step, and the range.
- `fixed-point` generalises the idea of finding values where f(x) = x.
- Procedures as returned values enable *lexical closures* — the environment at definition time is captured.

## Chapter 2. Building Abstractions with Data

### 2.1 Introduction to Data Abstraction

Data abstraction separates *use* from *representation*. Compound data objects are manipulated through *selectors* and *constructors*, and the underlying representation can be changed without affecting client code.

In Scheme, `cons`, `car`, and `cdr` are the primitive pair operations. The book famously shows that pairs can be implemented using only procedures (Church encoding of pairs):

```
(define (cons x y)
  (lambda (m) (m x y)))
```

This is a mind-expanding demonstration that data and procedures are not as distinct as they first appear.

### 2.2 Hierarchical Data and the Closure Property

The *closure property* of `cons` — that it can be used to combine pairs, and the result can itself be combined with `cons` — is what makes arbitrary compound data structures possible (lists, trees, etc.).

The book introduces conventional interfaces for working with sequences:

- `map`, `filter`, `accumulate` as building blocks.
- Nested mappings (e.g., the eight-queens puzzle expressed declaratively).

### 2.3 Symbolic Data

Symbols are not strings; they are atomic data that can be compared with `eq?`. Symbolic manipulation enables:

- **Quotation** — treating code as data.
- **Derivatives** — a symbolic differentiator that applies rules to expressions.
- **Representing sets** — unordered, ordered, and binary trees as alternative representations with different performance trade-offs.

### 2.4 Multiple Representations for Abstract Data

*Generic operations* dispatch on the *type* of the argument. The book uses a rectangular/ polar representation of complex numbers to illustrate:

- **Type tags** (`'rectangular`, `'polar`) carried in the data.
- **Dispatching** — the operation checks the tag and calls the appropriate procedure.

This anticipates object-oriented programming: each representation is a "class" and the dispatch procedure is a "method".

### 2.5 Systems with Generic Operations

The idea is extended to a full arithmetic package for polynomials. A *coercion* mechanism (raising a type to a more general one) reduces the need for explicit cross-type operations.

The takeaway:分层设计 (layered design) + tagging + coercion = extensible systems without modifying existing code.

## Chapter 3. Modularity, Objects, and State

### 3.1 Assignment and Local State

Introducing `set!` changes everything. With assignment, a procedure is no longer a pure function — its behaviour depends on *history*. This gives us:

- **Local state variables** — encapsulated inside a procedure via `let`.
- **Mutation** — the world is no longer timeless.

The cost: substitutional model of evaluation breaks. We need the *environment model* instead.

### 3.2 The Environment Model of Evaluation

A procedure is now a pair: code + pointer to the environment in which it was created. Evaluation proceeds by:

1. Looking up bindings in the current environment.
2. Extending the environment frame when a procedure is applied.

This model explains lexical scoping, closures, and mutable state.

### 3.3 Modelling with Mutable Data

Lists become mutable with `set-car!` and `set-cdr!`. The book builds:

- **Queues** — front and rear pointers, mutation for O(1) insertion.
- **Tables** — association lists and tree-based lookup.
- **Constraints** — a propagation network where cells notify dependents when changed.

### 3.4 Concurrency: Time Is of the Essence

With multiple processes sharing state, we face:

- **Race conditions** — interleaving can produce incorrect results.
- **Serializers** — ensure mutual exclusion for sequences of operations.
- The trade-off: more concurrency means more potential efficiency but also more complexity in reasoning about correctness.

## Chapter 4. Metalinguistic Abstraction

### 4.1 The Metacircular Evaluator

The book implements a Scheme interpreter in Scheme. This is the core of the course: ~200 lines of code that define what it *means* to evaluate an expression.

Key components:
- **`eval`** — dispatches on expression type (literal, variable, lambda, if, begin, cond, define, set!, application).
- **`apply`** — handles primitive vs. compound procedures, builds a new environment frame.
- **`setup-environment`** — initial bindings for primitives.

Understanding this evaluator demystifies the entire language: there is no magic, just a well-structured program.

### 4.2 Variations on a Scheme — Lazy Evaluation

By changing the evaluator, we change the language:
- **Normal-order evaluation** (lazy) — arguments are evaluated only when needed.
- **`delay` and `force`** — primitives for lazy lists and infinite streams.

The book builds a lazy evaluator by modifying `apply` to delay argument evaluation, and adding `memo-proc` for memoisation.

### 4.3 Variations on a Scheme — Nondeterministic Computing

The `amb` evaluator automatically searches for values that satisfy given constraints. This is the basis for logic programming (cf. Prolog). The evaluator uses backtracking — when `amb` fails, it rewinds to the last choice point and tries another option.

## Chapter 5. Computing with Register Machines

### 5.1 Designing Register Machines

The final layer: implementing the evaluator directly as a register machine. A register machine has:

- A fixed set of **registers** (storage locations).
- A **controller** (a sequence of instructions).
- Primitive operations (arithmetic, memory access).

The book designs a simple register machine language and then implements the Scheme evaluator in it.

### 5.2 A Register-Machine Simulator

A simulator written in Scheme allows us to run register-machine programs without building hardware. This confirms that the evaluator works correctly at the lowest level of abstraction.

### 5.3 Storage Allocation and Garbage Collection

The register machine needs a heap for cons cells. The book implements:

- **Explicit free-list allocation**.
- **Stop-and-copy garbage collection** — trace reachable cells, copy them to a new half of memory, update pointers.

The garbage collector itself is written as a register machine program — the ultimate demonstration that these ideas are implementable in hardware.

## Reflection

SICP is unique in computer science education because it does not treat any level of abstraction as "just magic." Every idea — from procedures to data to state to languages to hardware — is built from the ground up. The central message: there are no fundamental distinctions between data, procedures, and languages; these are all tools for organising complexity, and the programmer has the power to reshape them.
