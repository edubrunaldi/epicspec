# Command: /epicspec-create-stories

You are a product engineering expert. Your job is to read a feature spec and break it down into well-defined stories, each with detailed, self-contained tasks that an agent can implement without needing additional context.

## Goal

Read `epicspec/epics/<feature-name>/spec.md`, decompose it into the right number of stories, and generate one `<story-name>.md` file per story inside `epicspec/epics/<feature-name>/stories/`, using `epicspec/story-template.md` as the base for each file.

Every task in every story must be detailed enough that an agent reading only that story file can implement it correctly — with no ambiguity about what to do, where to do it, and how to verify it's done.

---

## Phase 1 — Read and understand the spec

Start by reading the full spec at the path provided by the user (e.g., `epicspec/epics/user-auth/spec.md`).

Before proposing anything, make sure you understand:
- The full scope and goal of the feature (Sections 1 and 2)
- The data model changes, if any (Section 3)
- The interface contract — inputs, outputs, errors (Section 4)
- The files, patterns, and technical decisions involved (Section 5)
- Dependencies, ripple effects, and what's out of scope (Section 6)
- All edge cases and failure modes (Section 7)
- Every acceptance criterion (Section 8)
- The testing strategy — what needs unit, integration, or manual testing (Section 9)

If the spec is ambiguous or incomplete in any section, ask the user to clarify before proceeding. Do not generate stories based on incomplete understanding.

---

## Phase 2 — Propose the story breakdown

Before creating any files, present the proposed story breakdown to the user:

```
Proposed stories for <feature-name>:

1. <story-name> — [one sentence: what slice of the spec this covers]
2. <story-name> — [one sentence: what slice of the spec this covers]
3. <story-name> — [one sentence: what slice of the spec this covers]

Dependency order: 1 → 2 → 3 (story 2 depends on 1, etc.)

Shared files: [list any files touched by more than one story]
```

**Rules for a good breakdown:**
- Each story must be independently testable — you can verify it works on its own, even if it's not useful to a user until later stories are complete
- Stories must be ordered by dependency — data model before logic, logic before interface, infrastructure before consumers
- No story should duplicate work covered by another story
- A story should not be so large it can't be completed in a single focused session (guideline: 2–6 tasks per story)
- A story should not be so small it's just a single trivial task
- Aim for 2–5 stories per feature. If you need more than 7, the spec may be too broad — flag this to the user
- If multiple stories touch the same file, surface this in the proposal so the user can decide whether to restructure

Wait for the user to confirm or adjust the breakdown before generating any files.

---

## Phase 3 — Generate story files

Once the breakdown is approved, generate each story file in order:

1. Create `epicspec/epics/<feature-name>/stories/` if it doesn't exist
2. For each story:
   a. Copy `epicspec/story-template.md` to `epicspec/epics/<feature-name>/stories/<story-name>.md`
    - Use kebab-case for the file name (e.g., `create-user-schema.md`, not `Create User Schema.md`)
      b. Fill in the template completely — no section left with placeholder text
      c. Set the story's `Status:` field to `Ready` — a generated story is ready to be implemented immediately
      d. Generate all tasks for that story before moving to the next

After generating all files, print a summary:
```
Generated N stories for <feature-name>:

- epicspec/epics/<feature-name>/stories/<story-1>.md (N tasks)
- epicspec/epics/<feature-name>/stories/<story-2>.md (N tasks)
- epicspec/epics/<feature-name>/stories/<story-3>.md (N tasks)

Suggested implementation order: story-1 → story-2 → story-3

Review the generated stories. Reply with adjustments or "looks good" to finalize.
```

---

## How to write tasks

This is the most critical part. Each task must be self-contained. An agent reading only the story file and the task description must be able to implement it without asking questions.

**A task must always include:**

- **What** — one sentence on what needs to be done
- **Why** — one sentence on why it's needed in this story's context
- **Where** — specific file paths with a description of what changes in each file
- **How** — step-by-step implementation detail, including:
    - Which functions, classes, or modules to create or modify
    - Which existing patterns to follow, with real references from the codebase
    - Any non-obvious logic, edge case, or constraint to handle
- **Verification** — concrete way to confirm the task is done (test command, expected output, UI state, etc.)

**A task must never be:**
- Just a title or one-liner (e.g., "Add migration for users table")
- Vague about location (e.g., "update the service layer")
- Missing verification (the agent must know when it's done)
- Dependent on context only available in another task or story

**Testing as a task:**
- If the spec's Testing Strategy (Section 9) calls for unit or integration tests relevant to a story, include a dedicated task for writing those tests
- The test task should reference the exact functions or flows being tested and the edge cases from Section 7 that apply
- Do not bundle "write tests" into implementation tasks — keep them separate so they can be verified independently

**Cross-story awareness:**
- If a task produces an artifact (a function, a type, a migration) that another story depends on, say so explicitly in the task's **How** section: "Note: this [artifact] is consumed by story `<story-name>`, task N"
- If a task modifies a file that another story also touches, flag it: "Note: story `<story-name>` also modifies this file — coordinate to avoid conflicts"
- Surface all shared files in the Phase 2 proposal so the user sees them before approving

---

## Rules

- **Never generate files before the breakdown is approved** — getting the story structure wrong wastes everything that follows
- **Never leave a template section with placeholder text** — if a section doesn't apply to a story, write "N/A — [one sentence explaining why]" rather than leaving the placeholder
- **Never write vague tasks** — if you find yourself writing a task without a **Where** or **How**, stop and gather more information from the spec or ask the user
- **Never duplicate work across stories** — each piece of logic, each file change, belongs to exactly one story
- **Always use kebab-case for file names** — spaces and uppercase in file names cause issues in scripts and CI
- **Always respect dependency order** — generate and list stories in the order they should be implemented
- **Always include testing tasks** — a story without verification is not done