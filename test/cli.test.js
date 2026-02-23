import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const CLI = join(__dirname, '..', 'bin', 'epicspec.js')
const PKG = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'))

function run(...args) {
  return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' })
}

test('--version prints version and exits 0', () => {
  const result = run('--version')
  assert.equal(result.status, 0)
  assert.match(result.stdout.trim(), new RegExp(PKG.version))
})

test('-v prints version and exits 0', () => {
  const result = run('-v')
  assert.equal(result.status, 0)
  assert.match(result.stdout.trim(), new RegExp(PKG.version))
})

test('no arguments prints help and exits 0', () => {
  const result = run()
  assert.equal(result.status, 0)
  assert.match(result.stdout, /epicspec/)
  assert.match(result.stdout, /Usage/)
})

test('help subcommand prints help and exits 0', () => {
  const result = run('help')
  assert.equal(result.status, 0)
  assert.match(result.stdout, /Usage/)
})

test('init --help prints init help and exits 0', () => {
  const result = run('init', '--help')
  assert.equal(result.status, 0)
  assert.match(result.stdout, /epicspec init/)
  assert.match(result.stdout, /--force/)
})

test('unknown command exits 1', () => {
  const result = run('unknown-command-xyz')
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Unknown command/)
})
