const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RESULTS = path.join(ROOT, 'allure-results');
const testArgs = process.argv.slice(2);

// Playwright/Allure appends into allure-results; wipe so old projects (mobile, etc.)
// do not leak into the next report. Trend history is restored in generate-allure-report.js.
if (fs.existsSync(RESULTS)) {
  fs.rmSync(RESULTS, { recursive: true, force: true });
}
fs.mkdirSync(RESULTS, { recursive: true });

const test = spawnSync('npx', ['playwright', 'test', ...testArgs], {
  stdio: 'inherit',
  cwd: ROOT,
  shell: true,
});

const report = spawnSync(process.execPath, [path.join(__dirname, 'generate-allure-report.js')], {
  stdio: 'inherit',
  cwd: ROOT,
  env: process.env,
});

if ((report.status ?? 1) !== 0) {
  console.error('Allure report generation failed.');
  if (process.env.CI === 'true') {
    process.exit(report.status ?? 1);
  }
}

process.exit(test.status ?? 1);
