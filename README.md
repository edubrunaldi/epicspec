# epicspec

[![npm version](https://img.shields.io/npm/v/@epicspec/epicspec.svg)](https://www.npmjs.com/package/@epicspec/epicspec)
[![license](https://img.shields.io/npm/l/@epicspec/epicspec.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/@epicspec/epicspec.svg)](https://nodejs.org)
[![CI](https://github.com/edubrunaldi/epicspec/actions/workflows/ci.yml/badge.svg)](https://github.com/edubrunaldi/epicspec/actions/workflows/ci.yml)

**Spec-driven development that keeps the agile flow: Epic → Story → Task.**

Write a spec, not a prompt. epicspec brings the agile Epic → Story → Task structure to AI-assisted engineering: a structured conversation produces a feature spec, the spec breaks into ordered stories, and each story is implemented task-by-task — with verification at every step before moving on.

No code is written until the spec is approved. No story starts until the previous one is verified. No epic closes until every story is done.

---

## Why epicspec?

- **No code without an approved spec** — structured gates prevent wasted implementation.
- **Specs are versioned artifacts, not chat messages** — your feature intent survives session boundaries.
- **Stories preserve context across sessions** — each story file is self-contained; no re-asking needed.
- **Verification at every step** — bugs surface at the task level, not after an entire story is built.
- **Works with Claude Code, Cursor, and GitHub Copilot** — native command formats for each.

---

## Table of contents

- [Why epicspec?](#why-epicspec)
- [Quick start](#quick-start)
- [Getting started](#getting-started)
- [Commands](#commands)
- [How it works](#how-it-works)
- [Example](#example)
- [File layout](#file-layout)
- [How to contribute](#how-to-contribute)

---

## Quick start

```bash
npx @epicspec/epicspec init .
```

Then run `/epicspec:create-spec` in your AI agent. See [Getting started](#getting-started) for manual install and options.

---

## Getting started

**Requires Node.js >= 18.**

### npm install

```bash
npm install -g @epicspec/epicspec
epicspec init .
```

Or without installing globally:

```bash
npx @epicspec/epicspec init .
```

Use `epicspec init . --force` to skip overwrite prompts when re-initializing an existing project. You can also run `epicspec --version` to confirm the installed version, or `epicspec --help` to see all available commands.

The CLI asks which agents you use and copies the right files automatically.

### Manual install

Copy the template files for your agent into your project root:

| Agent | Copy from | Copy to | First command |
|---|---|---|---|
| Claude Code | `template/.claude/commands/epicspec/` | `.claude/commands/epicspec/` | `/epicspec:create-spec` |
| Cursor | `template/.cursor/commands/epicspec-*.md` | `.cursor/commands/` | `/epicspec-create-spec` |
| GitHub Copilot | `template/.github/prompts/epicspec-*.prompt.md` | `.github/prompts/` | `/epicspec-create-spec` |

All agents also need `template/epicspec/` copied to `epicspec/`.

---

## Commands

All commands run inside your AI agent (Claude Code, Cursor, or GitHub Copilot).

### `/epicspec:create-spec`

Leads a 6-phase structured conversation before any code is written:

1. **Initial understanding** — What, Why, Constraints
2. **Technical exploration** — reads the codebase, finds affected files and patterns
3. **Approach validation** — presents the plan, waits for your confirmation
4. **Spec generation** — fills `epicspec/spec-template.md` with real findings
5. **Draft review** — presents the full spec, iterates until you approve
6. **Save** — writes to `epicspec/epics/<NNN-feature-name>/spec.md`

Nothing is saved without your explicit approval.

### `/epicspec:create-stories`

Reads an approved spec and breaks it into the right number of independent, dependency-ordered stories (1 for small features; 2–5 for typical features; up to 8 for larger ones):

1. Reads and validates every section of the spec
2. Proposes the breakdown with dependency order and shared files — waits for your approval
3. Generates each story file at `epicspec/epics/<NNN-feature-name>/stories/<NN-story-name>.md`

Each story is self-contained: an agent reading only that file has everything needed to implement it.

### `/epicspec:implement-story`

Implements a single story completely and verifiably:

1. Reads the full story, confirms understanding, waits for your go-ahead
2. Works task-by-task — re-reads each task, implements, verifies before moving on
3. Runs all tests from the story's Testing section
4. Sweeps every acceptance criterion — none marked done without explicit verification
5. Produces a completion summary with notes for the next story

If a blocker is found mid-task, implementation stops and reports exactly what was found.

### `/epicspec:archive`

Moves a completed epic from `epicspec/epics/` to `epicspec/epics/archive/`:

1. Detects all active epics — if more than one exists, asks which to archive
2. Shows a pre-archive summary with each story's status — warns if any are not Done
3. Moves the epic folder and marks all story files as Archived
4. Confirms the new location

Nothing is deleted. The epic is always recoverable from `epicspec/epics/archive/`.

---

## How it works

```
create-spec  →  create-stories  →  implement-story  →  archive
```

1. **create-spec** — 6-phase structured conversation produces `spec.md`
2. **create-stories** — reads the spec, proposes dependency-ordered story files
3. **implement-story** — one story at a time: task → verify → next
4. **archive** — moves the completed epic to `epics/archive/`

---

## Example

<details>
<summary>Full walkthrough — email notification preferences</summary>

### 1. Create the spec

```
you:    /epicspec:create-spec

agent:  Got it. Before I touch any code, help me understand what we're building.
        What feature are you working on, and what problem does it solve?

you:    Users need to turn off email notifications per category — marketing,
        product updates, security alerts. Right now it's all-or-nothing.

agent:  Makes sense. A few things to clarify before I explore the codebase:
        1. Per-account or per-device?
        2. Should security alerts be opt-out or always-on?
        3. Do changes take effect immediately or on the next send cycle?

you:    Per-account. Security always-on. Immediately.

agent:  Exploring the codebase...
        Found: User model has a single `email_notifications: boolean` field.
        The mailer reads it directly before every send — no per-category logic.
        No migration framework; raw SQL scripts under db/migrations/.

        Proposed approach: replace the boolean with a `notification_preferences`
        JSONB column, keyed by category, defaulting to true. Security category
        is excluded from the preferences object — it always sends.
        [... approach validated, spec drafted, reviewed, approved ...]

agent:  Spec saved: epicspec/epics/001-notification-preferences/spec.md
```

### 2. Break it into stories

```
you:    /epicspec:create-stories @epicspec/epics/001-notification-preferences/spec.md

agent:  Proposed breakdown:

        1. 01-schema          — add JSONB column + migration
        2. 02-mailer-check    — update mailer to read per-category prefs
        3. 03-preferences-api — GET/PATCH endpoint for user preferences
        4. 04-preferences-ui  — settings panel in account page

        Dependency order: 01-schema → 02-mailer-check → 03-preferences-api → 04-preferences-ui
        Shared files: src/models/user.ts (stories 1, 2), src/services/mailer.ts (stories 2, 3)
        Confirm or adjust?

you:    looks good

agent:  Generated 4 stories:
        epicspec/epics/001-notification-preferences/stories/01-schema.md
        epicspec/epics/001-notification-preferences/stories/02-mailer-check.md
        epicspec/epics/001-notification-preferences/stories/03-preferences-api.md
        epicspec/epics/001-notification-preferences/stories/04-preferences-ui.md
```

### 3. Implement story by story

```
you:    /epicspec:implement-story @epicspec/epics/001-notification-preferences/stories/01-schema.md

agent:  Ready to implement: schema

        Summary: adds `notification_preferences` JSONB column — 2 tasks: migration + model update
        Dependencies: none
        Warnings: migration is irreversible — review SQL before confirming

        Confirm to start?

you:    go

agent:  --- Task 1 of 2: write migration ---
        [writes db/migrations/012_add_notification_preferences.sql]
        ✓ Task 1 complete. Migration ran, column exists.

        --- Task 2 of 2: update User model ---
        [updates src/models/user.ts]
        ✓ Task 2 complete. Type-checks pass.

        Story complete: schema
        Files changed: db/migrations/012_add_notification_preferences.sql, src/models/user.ts
        Notes for next story: preferences default to {marketing: true, product_updates: true}
                              security key intentionally absent — always sends.
```

Repeat `/epicspec:implement-story` for each remaining story in order.

### 4. Archive the epic

```
you:    /epicspec:archive

agent:  Active epics:

        1. 001-notification-preferences

        Ready to archive: 001-notification-preferences

        Stories:
          ✓ 01-schema          — Done
          ✓ 02-mailer-check    — Done
          ✓ 03-preferences-api — Done
          ✓ 04-preferences-ui  — Done

        Location: epicspec/epics/001-notification-preferences/  →  epicspec/epics/archive/001-notification-preferences/

        Confirm to proceed, or reply "no" to cancel.

you:    yes

agent:  Archived: 001-notification-preferences

        Moved to: epicspec/epics/archive/001-notification-preferences/
        Stories marked Archived: 4
```

</details>

---

## File layout

After install, your project contains:

```
epicspec/
  spec-template.md          # base template used by /create-spec
  story-template.md         # base template used by /create-stories
  epics/
    <NNN-feature-name>/
      spec.md               # generated by /create-spec
      stories/
        01-<story-name>.md  # generated by /create-stories
        02-<story-name>.md
    archive/
      <NNN-feature-name>/   # moved here by /epicspec:archive
        spec.md
        stories/
          01-<story-name>.md
          02-<story-name>.md
```

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## How to contribute

Contributions are welcome. Here are the main ways to help:

- **Add a new agent** — If you've integrated epicspec into another agent, submit a PR.
- **Improve command templates** — the prompts under `template/` drive the entire workflow. Better wording, clearer gates, tighter output formats.
- **Fix bugs or docs** — open an issue or send a PR directly.
- **Share feedback** — open an issue describing what felt awkward or broke.

### Setup

The CLI lives in `bin/epicspec.js`. Commands and templates are markdown.

```bash
git clone https://github.com/edubrunaldi/epicspec.git
cd epicspec
npm install
npm test
```

Files you'll most likely edit:

| Path | What it controls |
|---|---|
| `template/.claude/commands/epicspec/` | Claude Code commands |
| `template/.cursor/commands/` | Cursor commands |
| `template/.github/prompts/` | GitHub Copilot prompt files |
| `template/epicspec/` | Spec and story templates |
| `README.md` | Docs |

### Making changes

1. Fork and create a branch: `feat/windsurf-support`, `fix/spec-template-typo`, etc.
2. Edit under `template/` for command or template changes, or `README.md` for docs.
3. Open a pull request. Include a short usage example if you're changing a command.

### Adding a new agent

1. Copy the closest existing command file from `template/.claude/commands/epicspec/`, `template/.cursor/commands/`, or `template/.github/prompts/`.
2. Adapt the syntax and invocation format to the target agent.
3. Update the **Manual install** table in `README.md`.

### Guidelines

- Keep each command file self-contained — an agent reading it should need nothing else.
- Preserve the gate-before-proceeding structure: no code without spec approval, no next story without verification.
- PRs that change command behavior must include a before/after example in the description.

---

MIT License
