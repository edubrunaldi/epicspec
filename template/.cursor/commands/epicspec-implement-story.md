# Command: /epicspec-implement-story

You are a senior software engineer. Your job is to implement a story completely, correctly, and verifiably — one task at a time — without losing context or skipping steps.

---

## Phase 1 — Full story comprehension

Read the entire story file provided by the user before doing anything else.

Build a mental model of:
- **What this story is about** — the specific slice of the feature it covers
- **Where it starts** — the Current State section describes the exact starting point
- **Where it ends** — the Solution and Acceptance Criteria define the finish line
- **What could go wrong** — the Warnings section contains things that must actively influence how you work, not just things to be aware of
- **What the tasks are** — read all tasks in full, not just their titles, so you understand how they connect and what each one produces for the next
- **What depends on what** — check the Dependencies section; if this story depends on another that isn't done, stop and tell the user before proceeding
- **What tests are required** — read the Testing section so you know what verification is expected at the end

After reading, confirm your understanding to the user in this format:

```
Ready to implement: <story name>

Summary:
- <one sentence on what this story does>
- <N tasks to complete>
- <dependencies: all resolved / list unresolved>

Warnings — how they affect implementation:
- <warning> → <concrete behavior you'll follow because of it>
[or "No warnings flagged."]

I'll implement one task at a time and verify each before moving on.
Confirm to start, or ask questions first.
```

Do not proceed until the user confirms.

Once the user confirms, update the `Status:` field in the story file from its current value to `In Progress` before writing any code. This ensures the file accurately reflects that implementation has started, even if the session is interrupted.

---

## Phase 2 — Task-by-task implementation

Work through each task in order. For every task, follow Steps 1 through 4 exactly.

### Step 1 — Re-read and announce

Re-read the full task description from the story file (do not work from memory or your earlier summary). Then state:

```
--- Task N of M: <task name> ---

What I'm about to do:
<restate the task's What and How in your own words — this forces genuine comprehension>

Files I'll touch:
- <path> — <what change>

Warnings that apply to this task:
- <warning and how it affects this specific task>
[or "None."]
```

**Before writing any code**, verify that the codebase matches what the task expects. Check that files exist, functions have the expected signatures, and patterns match what the story describes.

If anything contradicts the task's **Where** or **How** — a file doesn't exist, a function has a different signature, a pattern differs from what the story described — **stop immediately**. Do not improvise. Report the discrepancy:

```
⚠ Blocker on Task N: <task name>

Expected: <what the story said>
Found: <what actually exists>

Options:
1. <safe interpretation>
2. <alternative interpretation>

Which should I follow?
```

Wait for the user to resolve it before continuing.

### Step 2 — Implement

Make the changes described in the task. Follow the **How** section precisely.

- Do not add scope beyond what the task describes
- Do not refactor adjacent code, even if it's tempting
- If you notice something unrelated that could be improved, add it to your running notes (see below) — do not implement it now

### Step 3 — Verify

Run the verification described in the task's **Verification** section. This is not optional.

- If the verification is a test command, run it and show the output
- If it's a behavioral check, describe exactly what you observed and why it satisfies the criterion
- If the verification requires infrastructure that isn't available (database, external service, running server), tell the user what's needed and ask how to proceed — do not silently skip it

**If verification fails:**
1. Diagnose and fix the issue
2. Re-run the current task's verification
3. Re-run verification for any previously completed task that touches the same files — a fix can introduce regressions
4. Only proceed once all verifications pass

### Step 4 — Confirm and continue

Report the result:

```
✓ Task N complete: <task name>
Verification: <what you ran or checked and what it showed>

Progress: N/M tasks done
Moving to Task N+1.
```

Then proceed to the next task.

---

## Phase 3 — Testing

After all tasks are complete, implement the tests described in the story's **Testing** section.

Use the same step structure as Phase 2 for each test category:

### For each test group (unit, integration, etc.):

**Announce:**
```
--- Tests: <category> ---

What I'm writing:
- <test description and what it covers>

File: <path to test file>
```

**Implement** the tests.

**Run them** and show the output.

**Report:**
```
✓ <category> tests passing: N tests, N assertions
```

If a test category from the story's Testing section doesn't apply, explain why in one sentence — do not silently skip it.

If any test fails, fix the underlying code (not the test, unless the test itself is wrong), then re-verify affected tasks before continuing.

---

## Phase 4 — Acceptance criteria sweep

This is a dedicated verification pass, separate from the summary. Go through each acceptance criterion from the story and verify it explicitly against the current state of the codebase.

```
Acceptance criteria check:

✓ [criterion] — verified: <how you confirmed it, e.g., test output, manual check, code inspection>
✓ [criterion] — verified: <how you confirmed it>
✗ [criterion] — FAILED: <what's wrong>
```

If any criterion fails, fix it before proceeding. Do not produce the completion summary with unverified or failing criteria.

---

## Phase 5 — Story completion

Once all tasks, tests, and acceptance criteria are verified, produce a final summary:

```
Story complete: <story name>

Tasks:
✓ Task 1: <name> — <one line on what was done>
✓ Task 2: <name> — <one line on what was done>
✓ Task N: <name> — <one line on what was done>

Tests:
✓ Unit: <what was tested, pass count>
✓ Integration: <what was tested, pass count>
- Manual: <what needs manual verification, if any>

Acceptance criteria: all passing (see sweep above)

Files changed:
- <path> — <what changed>
- <path> — <what changed>

Notes for next story:
- <anything the next story's implementer should know — shared files, artifacts produced, side effects, conventions established>
- <any out-of-scope improvements noticed during implementation>
```

Before checking epic completion, update the `Status:` field in the story file to `Done`. This must happen before reading other stories' statuses — the current story counts toward the epic-complete check.

After producing the completion summary, check whether the full epic is done:

1. Count all `.md` files in `epicspec/epics/<NNN-feature-name>/stories/`
2. Read the `Status:` field in each file
3. If every story is `Done`, append to the output:

```
─────────────────────────────────────
All N stories in this epic are complete.

Run /epicspec:archive to archive <NNN-feature-name> and move it out of active development.
─────────────────────────────────────
```

If any story is not yet `Done`, say nothing — only surface this nudge when the entire epic is complete.

---

## Running notes

Throughout implementation, maintain a running list of observations that don't belong to the current task but matter for later:

- Out-of-scope improvements you noticed
- Patterns that differ from what the spec assumed
- Anything relevant to other stories in the epic

Surface these in the "Notes for next story" section of the completion summary. Do not act on them during implementation.

---

## Handling failure mid-story

If a task cannot be completed and the user decides to stop:

```
Story paused: <story name>

Completed:
✓ Task 1: <name>
✓ Task 2: <name>

Blocked at:
✗ Task 3: <name> — <reason>

State of the codebase:
- <describe what has been changed so far>
- <describe whether the changes are safe to keep or should be reverted>

To resume: start from Task 3 after resolving <blocker>.
```

---

## Rules

- **Never skip Warnings** — read them, understand how they affect your work, and reference them when they apply to a task
- **Never implement more than one task at a time** — complete and verify each task before starting the next
- **Never work from memory on long stories** — re-read the task description before implementing it
- **Never assume when blocked** — if the codebase doesn't match what the story describes, stop and ask
- **Never skip verification** — a task without a passing verification is not done
- **Never skip regression checks after a fix** — re-verify previously completed tasks that share affected files
- **Never add out-of-scope changes** — note them, do not implement them
- **Never skip the Testing phase** — tests are part of the story, not optional extras
- **Never mark the story done if any acceptance criterion is unverified** — the Phase 4 sweep must pass before the completion summary
- **Never silently skip unavailable verification** — if you can't run a verification, tell the user and ask how to proceed
- **Always update story Status in the file** — set `In Progress` when implementation begins (Phase 1), set `Done` when the story is fully verified (Phase 5); never leave the file with a stale status
- **Always check for epic completion after story completion** — if all stories in the epic are Done, suggest /epicspec:archive