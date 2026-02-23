# Story: [Story Name]

**Spec:** `epicspec/epics/<feature-name>/spec.md`
**Date:** [YYYY-MM-DD]
**Status:** Draft | Ready | In Progress | Done

---

## Context

> What specific slice of the feature does this story address? Why does it exist as a standalone story?

[2–5 sentences connecting this story to the broader spec. Reference the spec section that motivated this story — e.g., "This story covers the data model changes described in Section 3, which are a prerequisite for all other stories in this epic."]

---

## Current State

> What exists today that this story builds on or changes? What is the starting point?

[Describe the current state concretely. If building something new, describe what's missing and what foundation already exists. If modifying existing behavior, describe what currently happens and why it's insufficient. Reference specific files or behaviors when possible.]

---

## Solution

> How does this story move things forward? What will exist or behave differently after it's done?

[Describe the end state. Reference architectural decisions from the spec (Section 5) and explain how they apply here. Mention specific files, modules, or patterns that will be introduced or modified.]

---

## Acceptance Criteria

> Subset of the spec's criteria that this story is responsible for closing.

- [ ] [Verifiable criterion scoped to this story]
- [ ] [Verifiable criterion scoped to this story]

---

## Warnings

> Anything an implementer must know before starting — shared files, irreversible operations, ordering constraints, non-obvious gotchas.

- [e.g., "This migration is irreversible — review carefully before running"]
- [e.g., "File `X` is also modified by story `Y` — implement in dependency order to avoid conflicts"]

*Leave empty if there are no special concerns.*

---

## Tasks

> Each task must be self-contained: an agent reading only this story and the task description must be able to implement it correctly without needing to ask questions.

### Task 1: [Task Name]

**What:** [One sentence describing what needs to be done.]

**Why:** [One sentence explaining why this task is necessary in the context of this story.]

**Where:**
- `[path/to/file]` — [what to add, change, or remove in this file and why]
- `[path/to/other/file]` — [what to add, change, or remove and why]

**How:**

[Step-by-step description of the implementation. Be specific about:
- Which functions, classes, or modules to create or modify
- Which patterns from the codebase to follow (reference real examples if possible)
- Any non-obvious logic or edge case to handle during implementation
- If this task produces an artifact consumed by another story, state it here]

**Verification:**
- [How to confirm this task is complete — e.g., "running `X` test passes", "endpoint returns `Y`", "UI shows `Z`"]

---

### Task 2: [Task Name]

**What:** [One sentence describing what needs to be done.]

**Why:** [One sentence explaining why this task is necessary in the context of this story.]

**Where:**
- `[path/to/file]` — [what to add, change, or remove in this file and why]

**How:**

[Step-by-step description of the implementation.]

**Verification:**
- [How to confirm this task is complete]

---

### Task N: [Task Name]

**What:** [One sentence describing what needs to be done.]

**Why:** [One sentence explaining why this task is necessary in the context of this story.]

**Where:**
- `[path/to/file]` — [what to add, change, or remove in this file and why]

**How:**

[Step-by-step description of the implementation.]

**Verification:**
- [How to confirm this task is complete]

---

## Testing

> What tests does this story require? Derived from the spec's Testing Strategy (Section 9), scoped to this story.

**Unit tests:**
- [What logic needs isolated testing and where the test file lives]

**Integration tests:**
- [What flows need end-to-end validation]

*Leave empty for categories that don't apply to this story.*

---

## Dependencies

**This story depends on:**
- [Other story or external condition that must be complete before this one starts]

**This story unblocks:**
- [Other story that can only start after this one is done]