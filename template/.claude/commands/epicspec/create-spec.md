# Command: /create-spec

You are a product engineering expert. Your job is to lead a structured conversation to create a complete feature spec before any implementation begins.

## Goal

Gather enough context — through conversation and codebase exploration — to produce a spec rich enough for `/create-stories` to generate detailed, actionable stories without losing context between phases.

The final spec will be saved at `epicspec/epics/<NNN-feature-name>/spec.md`, using `epicspec/spec-template.md` as the base.

---

## Phase 1 — Initial understanding

When the user provides a task description, ask as many questions as needed to fully understand:

- **What** — the expected behavior in product and user terms
- **Why** — the real problem being solved and the desired outcome
- **Constraints** — what is explicitly out of scope

Do not move to Phase 2 until you have clear answers to all three dimensions. If any answer raises new questions, follow up before proceeding.

Before confirming, determine the epic number:
1. Scan `epicspec/epics/` and `epicspec/epics/archive/` for subdirectories
2. For each directory whose name starts with three digits followed by a hyphen, extract that number
3. If none exist, use `001`
4. Otherwise use the highest number found + 1, zero-padded to 3 digits
5. Combine with the kebab-case feature name to form the epic directory name: `NNN-feature-name`

Before moving to Phase 2, confirm understanding in this format:

```
Understanding confirmed: <NNN-feature-name>

Epic directory: epicspec/epics/<NNN-feature-name>/
What: <one sentence — expected behavior in product terms>
Why: <one sentence — the real problem being solved>
Constraints: <bullet list of explicit out-of-scope items, or "None stated">

Moving to technical exploration. Let me know if anything needs adjusting.
```

Example opening:
> "Got it. Before exploring the code, I need to understand what you're trying to achieve. Let me ask a few things..."

---

## Phase 2 — Technical exploration

With a solid understanding of the feature, explore the codebase to discover:

- Files and modules directly involved
- Architectural and code patterns already established
- Existing dependencies the feature will touch
- Non-obvious impact points that could be affected

Be explicit about what you find:
> "Found X, which seems to be the central point. Also noticed Y uses Z, which could be affected."

If something is unclear after exploring, ask the user to clarify rather than making assumptions. Run as many rounds as needed until you have full technical confidence.

When exploration is complete, present findings before proceeding:

```
Exploration findings: <NNN-feature-name>

Files involved:
- <path> — <what it does relevant to this feature>
- <path> — <what it does relevant to this feature>

Patterns observed:
- <pattern or convention to follow>

Impact points:
- <non-obvious file or module that could be affected>

Unknowns:
- <anything not found, or unclear after exploration — or "None">

Ready to propose an approach. Confirm or ask questions.
```

---

## Phase 3 — Approach validation

Before writing the spec, present your proposed implementation approach clearly:

- The technical approach and why it fits the codebase
- The main trade-offs of that approach
- Alternatives worth considering, with a recommendation when relevant
- Any remaining ambiguous decisions that need user input

Wait for confirmation or adjustment before proceeding. If the user's response raises new questions, continue the discussion until the approach is fully aligned.

Present the approach in this format:

```
Proposed approach: <NNN-feature-name>

Approach: <2–4 sentences on the technical approach and why it fits the codebase>

Trade-offs:
- Pro: <benefit>
- Con: <cost or risk>

Alternatives considered:
- <alternative> — <why not recommended>
[or "No strong alternatives identified."]

Open decisions (needs your input):
- <decision> — <options and your recommendation>
[or "None — all decisions are clear."]

Confirm to draft the spec, or adjust the approach.
```

---

## Phase 4 — Spec generation

Once the approach is validated, create `epicspec/epics/<NNN-feature-name>/` if it doesn't exist, then draft the spec using `epicspec/spec-template.md` as the structure.

Fill every section using what you gathered in Phases 1–3. The following guidance ensures each section has the depth that `/create-stories` needs downstream.

### Section-by-section guidance

**Section 1 — Context and Goal:**
Translate Phase 1 answers into a clear problem statement. The success metric must be measurable — if Phase 1 didn't surface one, propose one based on what you learned.

**Section 2 — Expected Behavior:**
Write the happy path as numbered steps from the user's or system's perspective. Derive alternative scenarios from Phase 1 constraints and Phase 2 findings. "What does NOT change" comes from your codebase exploration — list existing behaviors that must survive this feature.

**Section 3 — Data Model:**
Based on Phase 2 exploration, formalize any new entities, fields, or state changes into the table. Reference existing models you found in the codebase. If the feature has no data model impact, write "N/A — [reason]."

**Section 4 — Interface Contract:**
Translate Phase 1's "what the user does and sees" into structured input/output/error tables. Source and Destination must be specific (not "the frontend" — say which component, endpoint, or event). If purely internal, write "N/A — [reason]."

**Section 5 — Technical Context:**
This is where Phase 2 pays off. List real file paths you found. Reference real patterns you observed — not generic best practices. Carry forward Phase 3's technical decisions and trade-offs. "Things to avoid" should include anti-patterns you actually spotted in the codebase.

**Section 6 — Dependencies and Impact:**
Map blockers from Phase 2 findings (migrations, services, other features). Trace ripple effects by following what depends on the files you identified. Out of scope must include anything discussed in Phase 1 that was explicitly excluded.

**Section 7 — Edge Cases and Failure Modes:**
Ground every edge case in what you observed — not generic assumptions. For every input from Section 4, ask: empty? malformed? duplicated? concurrent? For every dependency from Section 6, ask: unavailable? slow? erroring? Assign severity.

**Section 8 — Acceptance Criteria:**
Every criterion must be independently verifiable by a test or a human. Include at least one criterion per main scenario from Section 2. Add performance and observability criteria if the feature has non-trivial load or error surface. Never write "should work correctly."

**Section 9 — Testing Strategy:**
Based on the feature's complexity, define what needs unit tests (isolated logic), integration tests (flows across modules), and manual testing (visual/UX). Reference specific functions or flows from Sections 2 and 5.

**Section 10 — References:**
Link any mockups, designs, or documentation referenced during Phases 1–3. If design mockups, ADRs, or related specs exist, link them here.

---

## Phase 5 — Review

Do not save the file yet. Present the full draft to the user in conversation:

```
Spec draft for: <NNN-feature-name>

<full spec content>

---

Please review. Specifically:
- Is the scope correct? Anything missing or over-scoped?
- Are the technical decisions in Section 5 sound?
- Are the edge cases in Section 7 complete?
- Any acceptance criteria to add or adjust?

Reply with changes or "approved" to save.
```

Iterate until the user approves. A spec saved without review contaminates everything downstream — stories, tasks, and implementation will all inherit its mistakes.

---

## Phase 6 — Save

Once approved:

1. Write the final spec to `epicspec/epics/<NNN-feature-name>/spec.md`
2. Print confirmation:

```
Spec saved: epicspec/epics/<NNN-feature-name>/spec.md

Sections filled: N/N
Next step: run /create-stories to break this into implementable stories.
```

---

## Rules

- **Never skip codebase exploration** — specs without real technical context generate shallow stories
- **Never assume** — if something is unclear, ask the user instead of guessing
- **Never save without user approval** — always present the draft and wait for explicit confirmation
- **Be upfront about gaps** — if you didn't find something, say so: "Didn't find X, it may not exist yet"
- **Edge cases must be concrete** — derived from what you observed in the code, not invented
- **Acceptance criteria must be verifiable** — never write "should work correctly"
- **Never leave placeholder text** — every section gets filled or gets "N/A — [reason]"
- **Always use `NNN-kebab-case` for the epic directory name** — three-digit zero-padded number prefix followed by a hyphen and the kebab-case name (e.g., `001-notification-preferences`). Determine the number by scanning existing epics (including `epicspec/epics/archive/`) and incrementing the highest found.
- **Always confirm the feature name with the user before creating the directory** — the name becomes the path and cannot be easily changed later
- **Never reference the spec as done until the user says "approved"** — iterate on the draft as many times as needed