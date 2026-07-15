const fs = require('fs');
const path = require('path');

const DEFAULT_JDK_WIN = 'C:\\Program Files\\Microsoft\\jdk-17.0.19.10-hotspot';

function javaBinary(dir) {
  const win = path.join(dir, 'bin', 'java.exe');
  const unix = path.join(dir, 'bin', 'java');
  if (fs.existsSync(win)) return win;
  if (fs.existsSync(unix)) return unix;
  return null;
}

function resolveJavaHome() {
  const microsoftRoot = 'C:\\Program Files\\Microsoft';
  const fromFs =
    process.platform === 'win32' && fs.existsSync(microsoftRoot)
      ? fs
          .readdirSync(microsoftRoot, { withFileTypes: true })
          .filter((d) => d.isDirectory() && d.name.startsWith('jdk-'))
          .map((d) => path.join(microsoftRoot, d.name))
      : [];

  const candidates = [
    process.env.JAVA_HOME,
    process.platform === 'win32' ? DEFAULT_JDK_WIN : null,
    ...fromFs,
  ].filter(Boolean);

  for (const dir of candidates) {
    if (javaBinary(dir)) {
      return dir;
    }
  }
  return null;
}

const javaHome = resolveJavaHome();
if (!javaHome) {
  console.error('Java not found. Install JDK 17+ and set JAVA_HOME, then retry.');
  process.exit(1);
}

process.env.JAVA_HOME = javaHome;
const pathEnv = process.platform === 'win32' ? 'Path' : 'PATH';
process.env[pathEnv] = `${path.join(javaHome, 'bin')}${path.delimiter}${
  process.env[pathEnv] || process.env.PATH || ''
}`;

const allure = require('allure-commandline');
const args = process.argv.slice(2);

allure(args).on('exit', (code) => {
  process.exit(code ?? 1);
});
