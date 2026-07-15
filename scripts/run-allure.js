const fs = require('fs');
const path = require('path');

const DEFAULT_JDK = 'C:\\Program Files\\Microsoft\\jdk-17.0.19.10-hotspot';

function resolveJavaHome() {
  const microsoftRoot = 'C:\\Program Files\\Microsoft';
  const fromFs = fs.existsSync(microsoftRoot)
    ? fs
        .readdirSync(microsoftRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith('jdk-'))
        .map((d) => path.join(microsoftRoot, d.name))
    : [];

  const candidates = [process.env.JAVA_HOME, DEFAULT_JDK, ...fromFs].filter(Boolean);

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'bin', 'java.exe'))) {
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
process.env.Path = `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.Path || ''}`;

const allure = require('allure-commandline');
const args = process.argv.slice(2);

allure(args).on('exit', (code) => {
  process.exit(code ?? 1);
});
