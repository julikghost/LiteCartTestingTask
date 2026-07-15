const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESULTS = path.join(ROOT, 'allure-results');
const LATEST = path.join(ROOT, 'allure-report');
const HISTORY = path.join(ROOT, 'allure-history');

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    '_',
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join('');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (!fs.existsSync(RESULTS) || fs.readdirSync(RESULTS).length === 0) {
  console.error('No allure-results found — cannot generate Allure report.');
  process.exit(1);
}

console.log(`Generating Allure report from ${RESULTS} ...`);
const generate = spawnSync(
  process.execPath,
  [
    path.join(__dirname, 'run-allure.js'),
    'generate',
    RESULTS,
    '--clean',
    '-o',
    LATEST,
  ],
  { stdio: 'inherit', cwd: ROOT, env: process.env },
);

if ((generate.status ?? 1) !== 0) {
  console.error('allure generate failed with code', generate.status);
  process.exit(generate.status ?? 1);
}

if (!fs.existsSync(path.join(LATEST, 'index.html'))) {
  console.error('Allure report was not created (index.html missing).');
  process.exit(1);
}

const archiveDir = path.join(HISTORY, stamp());
copyDir(LATEST, archiveDir);
console.log(`Allure report saved: ${path.relative(ROOT, LATEST)}`);
console.log(`Allure archive saved: ${path.relative(ROOT, archiveDir)}`);
