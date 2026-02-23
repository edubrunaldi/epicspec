# Spec: [Feature Name]

**Author:** [name]
**Date:** [YYYY-MM-DD]

---

## 1. Context and Goal

> Why does this feature exist? What user or business problem does it solve?

[2–10 sentences. Be specific about the pain point, who experiences it, and what success looks like. Avoid solutioning here — focus on the "why".]

**Success metric (optional):** [How would you measure if this feature achieved its goal? e.g., "reduce checkout abandonment by 15%", "eliminate manual CSV exports"]

---

## 2. Expected Behavior

> Describe what the system should do as if explaining to someone who will test it, with no access to the code.

**Preconditions:**
- [What must be true before this feature can run? e.g., "user is authenticated", "product has at least one variant"]

**Main scenario (happy path):**
1. [step]
2. [step]
3. [step]
4. [expected outcome]

**Alternative scenarios:**
- **[Scenario name]:** [description of variation and its expected outcome]
- **[Scenario name]:** [description of variation and its expected outcome]

**What does NOT change:**
- [Existing behavior that must remain untouched — prevents regressions]

---

## 3. Data Model

> What data does this feature create, read, update, or delete?

**New entities / fields:**
| Entity/Table | Field | Type | Constraints | Notes |
|---|---|---|---|---|
| `[entity]` | `[field]` | `[type]` | `[nullable, unique, default, etc.]` | `[purpose]` |

**State transitions (if applicable):**
```
[state_a] → [state_b] → [state_c]
                ↘ [state_d] (on failure)
```

*Leave empty if the feature has no data model impact.*

---

## 4. Interface Contract

> How is this feature exposed or consumed? Describe the boundary between this feature and everything else — whether that's a user, another module, an API consumer, or the system itself.

**Inputs:**
| Source | Name / Trigger | Shape / Type | Notes |
|---|---|---|---|
| `[user action / API call / event / CLI arg / file / signal]` | `[name]` | `[type or shape]` | `[validation, defaults, constraints]` |

**Outputs:**
| Destination | Name / Result | Shape / Type | Notes |
|---|---|---|---|
| `[screen / response / file / event / stdout / state change]` | `[name]` | `[type or shape]` | `[format, side effects]` |

**Error / failure handling:**
| Condition | Behavior |
|---|---|
| `[invalid input / missing dependency / timeout]` | `[message, fallback, retry, exit code, UI feedback]` |

*Leave empty if the feature has no meaningful boundary to define.*

---

## 5. Technical Context

> Which parts of the codebase are affected, and how should this be built?

**Files / modules involved:**
- `[path/file]` — [what it does in this feature's context]
- `[path/file]` — [what it does in this feature's context]

**Patterns to follow:**
- [Architecture, naming, or style convention already in use that must be respected]
- [Existing library, utility, or abstraction to reuse — don't reinvent]

**Key technical decisions:**
- [Chosen approach and why — e.g., "polling over websockets because the update frequency is low"]
- [Tradeoff acknowledged — e.g., "denormalized for read speed, accepting write complexity"]

**Things to avoid:**
- [Anti-pattern or tempting shortcut that should NOT be taken, and why]

---

## 6. Dependencies and Impact

> What does this feature touch beyond its direct scope?

**Depends on (blockers):**
- [Feature, service, migration, or data that must exist before work starts]

**Impacts (ripple effects):**
- [Other modules, services, or teams that may be indirectly affected]

**Out of scope (explicit exclusions):**
- [What was deliberately left out to keep scope contained — prevents scope creep]

---

## 7. Edge Cases and Failure Modes

> What could go wrong? What unexpected states need handling?

| # | Situation | Expected behavior | Severity |
|---|---|---|---|
| 1 | [edge case] | [how the system should react] | [low/med/high] |
| 2 | [concurrent access / race condition] | [handling] | |
| 3 | [external service unavailable] | [fallback / retry / graceful degradation] | |
| 4 | [invalid / corrupt input] | [validation / rejection] | |
| 5 | [permission denied / unauthorized] | [handling] | |

---

## 8. Acceptance Criteria

> What must be true for this feature to be considered done. Every item must be independently verifiable.

- [ ] [Concrete, testable criterion — e.g., "User sees confirmation toast after saving"]
- [ ] [Concrete, testable criterion — e.g., "API returns 422 if `email` is missing"]
- [ ] [Concrete, testable criterion — e.g., "Existing `/orders` endpoint behavior is unchanged"]
- [ ] [Performance criterion if relevant — e.g., "Response time < 200ms at p95"]
- [ ] [Observability criterion if relevant — e.g., "Errors are logged with correlation ID"]

---

## 9. Testing Strategy

> How should correctness be verified?

**Unit tests:**
- [What logic needs isolated testing? e.g., "discount calculation with edge amounts"]

**Integration tests:**
- [What flows need end-to-end validation? e.g., "full checkout with payment mock"]

**Manual / exploratory testing:**
- [Anything that's hard to automate or needs visual/UX verification]

*Omit categories that don't apply.*

---

## 10. References

> Links, prior art, design docs, conversations, or anything that provides additional context.

- [link or reference — brief description of what it contains]
- [link or reference — brief description of what it contains]

---

## Changelog

| Date | Author | Change |
|---|---|---|
| [YYYY-MM-DD] | [name] | Initial draft |