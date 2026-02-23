# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-23

### Added

- `epicspec init` command — interactive CLI to scaffold epicspec into any project, with agent selection (Claude Code, Cursor)
- `/epicspec:create-spec` command — 6-phase guided workflow to turn a feature idea into a structured spec document
- `/epicspec:create-stories` command — decomposes a spec into granular story files ready for implementation
- `/epicspec:implement-story` command — task-by-task story implementation with verification and completion tracking
- `/epicspec:archive` command — safely moves completed epics to `epicspec/epics/archive/` after all stories are done
- `NNN-` numeric prefix convention for epic directories (e.g. `001-feature-name`) for chronological sorting
- `epicspec/spec-template.md` — 10-section spec template covering behavior, data model, interface contract, acceptance criteria, and more
- `epicspec/story-template.md` — structured story template with tasks, warnings, and testing guidance
- Support for both Claude Code (`.claude/commands/`) and Cursor (`.cursor/commands/`) agents

[1.0.0]: https://github.com/edubrunaldi/epicspec/releases/tag/v1.0.0
