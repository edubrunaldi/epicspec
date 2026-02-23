#!/usr/bin/env node
import { intro, outro, multiselect, spinner, isCancel, cancel, log } from '@clack/prompts';
import { cpSync, mkdirSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const TEMPLATE_DIR = join(__dirname, '..', 'template');

const AGENTS = [
  { value: 'claude', label: 'Claude Code' },
  { value: 'cursor', label: 'Cursor' },
];

const [,, command, targetArg = '.'] = process.argv;

if (command === 'init') {
  await init(resolve(targetArg));
} else {
  console.log('Usage: epicspec init <path>');
  console.log('       epicspec init .');
  process.exit(1);
}

async function init(targetPath) {
  intro('epicspec init');

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

  // Shared: copy epicspec/ templates
  s.start('Copying epicspec templates...');
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

  log.info(`Initialized in: ${targetPath}`);
  outro('Done! Open your project in the agent you selected and run /epicspec:create-spec to start.');
}
