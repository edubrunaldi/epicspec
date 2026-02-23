#!/usr/bin/env node
import { intro, outro, multiselect, confirm, spinner, isCancel, cancel, log } from '@clack/prompts';
import { cpSync, mkdirSync, readdirSync, existsSync, readFileSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PKG = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const TEMPLATE_DIR = join(__dirname, '..', 'template');

const AGENTS = [
  { value: 'claude', label: 'Claude Code' },
  { value: 'cursor', label: 'Cursor' },
];

// ── argument parsing ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const hasFlag = (...flags) => flags.some(f => args.includes(f));
const nonFlagArgs = args.filter(a => !a.startsWith('-'));

const command = nonFlagArgs[0];

// ── global flags ──────────────────────────────────────────────────────────────

if (hasFlag('--version', '-v')) {
  console.log(PKG.version);
  process.exit(0);
}

// Root help: no command, explicit "help" subcommand, or --help with no command
if (!command || command === 'help') {
  printHelp();
  process.exit(0);
}

// ── route commands ────────────────────────────────────────────────────────────

if (command === 'init') {
  if (hasFlag('--help', '-h')) {
    printInitHelp();
    process.exit(0);
  }
  const targetArg = nonFlagArgs[1] ?? '.';
  const force = hasFlag('--force');
  await init(resolve(targetArg), force);
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Run epicspec --help for usage.');
  process.exit(1);
}

// ── commands ──────────────────────────────────────────────────────────────────

async function init(targetPath, force) {
  intro(`epicspec v${PKG.version}`);

  // Create target directory if it doesn't exist
  if (!existsSync(targetPath)) {
    mkdirSync(targetPath, { recursive: true });
    log.info(`Created directory: ${targetPath}`);
  }

  // Warn if already initialized
  if (!force && existsSync(join(targetPath, 'epicspec'))) {
    const overwrite = await confirm({
      message: 'epicspec/ already exists in this directory. Overwrite?',
    });
    if (isCancel(overwrite) || !overwrite) {
      cancel('Aborted. Use --force to skip this check.');
      process.exit(0);
    }
  }

  // Agent selection
  const agents = await multiselect({
    message: 'Which agents do you use? (space to select)',
    options: AGENTS,
    required: true,
  });

  if (isCancel(agents)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }

  const s = spinner();

  try {
    // Shared: epicspec/ templates
    s.start('Copying epicspec templates...');
    mkdirSync(join(targetPath, 'epicspec'), { recursive: true });
    cpSync(join(TEMPLATE_DIR, 'epicspec'), join(targetPath, 'epicspec'), { recursive: true });
    s.stop('epicspec/ ✓');

    // Claude Code
    if (agents.includes('claude')) {
      s.start('Setting up Claude Code...');
      const dest = join(targetPath, '.claude', 'commands', 'epicspec');
      mkdirSync(dest, { recursive: true });
      cpSync(join(TEMPLATE_DIR, '.claude', 'commands', 'epicspec'), dest, { recursive: true });
      s.stop('.claude/commands/epicspec/ ✓');
    }

    // Cursor
    if (agents.includes('cursor')) {
      s.start('Setting up Cursor...');
      const dest = join(targetPath, '.cursor', 'commands');
      mkdirSync(dest, { recursive: true });
      const src = join(TEMPLATE_DIR, '.cursor', 'commands');
      for (const file of readdirSync(src).filter(f => f.startsWith('epicspec'))) {
        cpSync(join(src, file), join(dest, file));
      }
      s.stop('.cursor/commands/ ✓');
    }
  } catch (err) {
    s.stop('Failed.');
    log.error(`Could not copy files: ${err.message}`);
    process.exit(1);
  }

  log.info(`Initialized in: ${targetPath}`);

  const nextCommand = agents.includes('claude') ? '/epicspec:create-spec' : '/epicspec-create-spec';
  outro(`Done! Run ${nextCommand} in your agent to start.`);
}

// ── help text ─────────────────────────────────────────────────────────────────

function printHelp() {
  console.log(`
epicspec — Spec-first development for AI-assisted engineering

Usage:
  epicspec <command> [options]

Commands:
  init [path]    Initialize epicspec in a project directory (default: .)

Options:
  -v, --version  Print version number
  -h, --help     Show this help message

Run epicspec <command> --help for command-specific help.
`.trim());
}

function printInitHelp() {
  console.log(`
epicspec init [path]

Initialize epicspec in a project directory.

Arguments:
  path           Target directory (default: current directory)

Options:
  --force        Overwrite existing epicspec files without prompting
  -h, --help     Show this help message

Examples:
  epicspec init .
  epicspec init ./my-project
  epicspec init /path/to/project --force
`.trim());
}
