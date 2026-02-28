---
description: "Break an approved spec into dependency-ordered, implementable stories"
agent: "agent"
---

# Command: /epicspec-create-stories

You are a product engineering expert. Your job is to read a feature spec and break it down into well-defined stories, each with detailed, self-contained tasks that an agent can implement without needing additional context.

## Goal

Read `epicspec/epics/<NNN-feature-name>/spec.md`, decompose it into the right number of stories, and generate one `<NN-story-name>.md` file per story inside `epicspec/epics/<NNN-feature-name>/stories/`, using `epicspec/story-template.md` as the base for each file.

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

## Phase 1.5 — Codebase architecture discovery

Before proposing a story breakdown, establish the project's architectural ground truth. This ensures the tasks you write in Phase 3 reference real files and real patterns — not generic descriptions that will break the architecture during implementation.

### Step 1 — Look for explicit rules files

Check for these files at the project root (in order):
- `CLAUDE.md`
- `.cursorrules`
- `.cursor/rules/*.md`
- `.github/copilot-instructions.md`

If found, read them. Then **still perform Step 2** — rules files can be outdated. If the rules file describes patterns that contradict what you find in the codebase, do not update the rules file. Instead, flag it:

```
⚠ Rules file may be outdated:

<rules file path> says: <what it says>
Codebase shows: <what is actually there>

Which should I follow?
```

Wait for the user to decide before continuing.

### Step 2 — Explore the codebase

Regardless of whether a rules file was found:

- Map the project's layer structure from directory names and file names (e.g., `/Controllers/`, `/Services/`, `/Repositories/`, `/Domain/`)
- Find 1–2 existing features similar to what the spec describes
- Trace each from the entry point (route/controller) all the way through to data access — record exact file paths, class names, and function signatures
- If no similar implementation exists yet (greenfield project), note it in the proposal block under `Reference implementation used: none — greenfield project` and proceed.

### Step 3 — Use findings when writing tasks

When writing `Where` and `How` sections for tasks in Phase 3:

- `Where` must reference **actual existing file paths** — not hypothetical or generic ones
- `How` must say "follow the pattern in `<real file>`" and reference real class/method names from the codebase
- If the task creates a new file or class, name it following the naming convention observed in the codebase
- If the task adds a layer (e.g., a new service), the `How` must specify which existing file to model it after

### Step 4 — Surface architecture findings in the Phase 2 proposal

Add this block to the Phase 2 proposal output so the user can catch any wrong assumptions before approving:

```
Architecture discovered: <pattern name, e.g., "Controller → Service → Repository">
Reference implementation used: <path>
Rules source: <"CLAUDE.md" | "explored codebase" | "none found — patterns inferred from structure">
```

---

## Phase 2 — Propose the story breakdown

Before creating any files, present the proposed story breakdown to the user:

```
Proposed stories for <NNN-feature-name>:

1. 01-<story-name> — [one sentence: what slice of the spec this covers]
2. 02-<story-name> — [one sentence: what slice of the spec this covers]
3. 03-<story-name> — [one sentence: what slice of the spec this covers]

Dependency order: 01-story-1 → 02-story-2 → 03-story-3 (story 2 depends on 1, etc.)

Shared files: [list any files touched by more than one story]
```

**Rules for a good breakdown:**
- Each story must be independently testable — you can verify it works on its own, even if it's not useful to a user until later stories are complete
- Stories must be ordered by dependency — data model before logic, logic before interface, infrastructure before consumers
- No story should duplicate work covered by another story
- A story should not be so large it can't be completed in a single focused session (guideline: 2–6 tasks per story)
- A story should not be so small it's just a single trivial task
- A single story is valid for small, focused features — do not force decomposition where none is needed
- For typical features, 2–5 stories is a healthy range; for larger or more complex features, 6–8 stories is acceptable and expected
- If you need more than 10 stories, the spec may be too broad — flag this to the user and suggest splitting it into two separate epics
- If multiple stories touch the same file, surface this in the proposal so the user can decide whether to restructure

Wait for the user to confirm or adjust the breakdown before generating any files.

---

## Phase 3 — Generate story files

Once the breakdown is approved, generate each story file in order:

Before generating files, determine the NN prefix for each story:
1. Scan `epicspec/epics/<NNN-feature-name>/stories/` for existing files whose name starts with two digits followed by a hyphen
2. Extract those numbers
3. If none exist, assign `01` to the first story in the approved breakdown
4. Otherwise, continue from the highest number found + 1, zero-padded to 2 digits
5. Assign numbers sequentially in the dependency order approved in Phase 2

1. Create `epicspec/epics/<NNN-feature-name>/stories/` if it doesn't exist
2. For each story:
   a. Copy `epicspec/story-template.md` to `epicspec/epics/<NNN-feature-name>/stories/<NN-story-name>.md`
    - Use kebab-case for the file name (e.g., `01-create-user-schema.md`, not `Create User Schema.md`)
      b. Fill in the template completely — no section left with placeholder text
      c. Set the story's `Status:` field to `Ready` — a generated story is ready to be implemented immediately
      d. Generate all tasks for that story before moving to the next

After generating all files, print a summary:
```
Generated N stories for <NNN-feature-name>:

- epicspec/epics/<NNN-feature-name>/stories/<NN-story-1>.md (N tasks)
- epicspec/epics/<NNN-feature-name>/stories/<NN-story-2>.md (N tasks)
- epicspec/epics/<NNN-feature-name>/stories/<NN-story-3>.md (N tasks)

Suggested implementation order: 01-story-1 → 02-story-2 → 03-story-3

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
- **Always use `NN-kebab-case` for story file names** (e.g., `01-schema.md`) — the NN prefix ensures sortable, ordered file names; spaces and uppercase cause issues in scripts and CI
- **Always determine the NN prefix by scanning existing stories** — never hardcode or guess numbers; follow the same scan-and-increment logic used for epic directories
- **Always respect dependency order** — generate and list stories in the order they should be implemented
- **Always include testing tasks** — a story without verification is not done
- **Never write tasks without codebase exploration** — generic `Where`/`How` sections that don't reference real files produce architecture-breaking implementations
- **Always reference a real existing implementation in task `How` sections** — "follow the pattern in `X`" is always more reliable than describing the pattern abstractly
