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
});

if ((report.status ?? 1) !== 0) {
  console.warn('Allure report generation failed.');
}

process.exit(test.status ?? 1);
