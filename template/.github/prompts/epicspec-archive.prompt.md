---
description: "Archive a completed epic, moving it out of active development"
agent: "agent"
---

# Command: /epicspec-archive

You are a project engineer. Your job is to archive a completed epic — moving it out of active development so the project stays clean and focused.

---

## Phase 1 — Detect active epics

Scan `epicspec/epics/` for subdirectories, excluding `archive/`. Each subdirectory is a candidate epic.

**If zero epics found:**

```
No active epics found in epicspec/epics/. Nothing to archive.
```

Stop.

**If one epic found:**

```
Ready to archive: <NNN-feature-name>

Confirm? (yes / no)
```

Wait for the user to confirm before proceeding.

**If two or more epics found:**

```
Active epics:

1. <NNN-feature-name-1>
2. <NNN-feature-name-2>
...

Which epic should be archived? Reply with the number or name.
```

Wait for the user's answer before proceeding.

---

## Phase 2 — Pre-archive summary

Read the story files in `epicspec/epics/<NNN-feature-name>/stories/`. For each file, check its `Status:` field.

Present a summary:

```
Ready to archive: <NNN-feature-name>

Stories:
  ✓ <story-1> — Done
  ✓ <story-2> — Done
  ⚠ <story-3> — In Progress

Location: epicspec/epics/<NNN-feature-name>/  →  epicspec/epics/archive/<NNN-feature-name>/

Confirm to proceed, or reply "no" to cancel.
```

If any story is not `Done`, include a warning before asking for confirmation:

```
⚠ Warning: <N> stories are not marked Done. Archiving will move the epic as-is — no data is lost, but the stories will remain unfinished in the archive.
Continue anyway? (yes / no)
```

Do not proceed until the user confirms.

---

## Phase 3 — Archive

1. Create `epicspec/epics/archive/` if it doesn't exist
2. Move `epicspec/epics/<NNN-feature-name>/` to `epicspec/epics/archive/<NNN-feature-name>/`
3. Open every `.md` file in `epicspec/epics/archive/<NNN-feature-name>/stories/` and update its `Status:` field to `Archived`

---

## Phase 4 — Confirm

```
Archived: <NNN-feature-name>

Moved to: epicspec/epics/archive/<NNN-feature-name>/
Stories marked Archived: N

To review:
  epicspec/epics/archive/<NNN-feature-name>/spec.md
  epicspec/epics/archive/<NNN-feature-name>/stories/
```

---

## Rules

- **Never archive without user confirmation** — always present the pre-archive summary and wait for an explicit yes
- **Never silently skip stories that aren't Done** — warn the user and require an explicit "yes" to continue with incomplete stories
- **Never delete files** — archiving is a move operation only; nothing is lost
- **Always update story statuses to Archived after moving** — the Status field must reflect the epic's archived state
- **Always create `archive/` if it doesn't exist** — do not fail if the directory is missing
