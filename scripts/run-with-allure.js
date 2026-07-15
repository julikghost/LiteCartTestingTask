const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const testArgs = process.argv.slice(2);

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
  // Prefer surfacing Allure failure in CI so missing artifacts are not silent
  if (process.env.CI === 'true') {
    process.exit(report.status ?? 1);
  }
}

process.exit(test.status ?? 1);
