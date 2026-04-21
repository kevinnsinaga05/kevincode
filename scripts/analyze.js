const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function checkSyntax(relPath) {
  execFileSync(process.execPath, ['--check', path.join(root, relPath)], { stdio: 'pipe' });
}

function has(relPath, pattern) {
  return pattern.test(read(relPath));
}

const syntaxFiles = [
  'server.js',
  'assets/js/main.js',
  'assets/js/about.js',
  'register-sw.js',
  'sw.js'
];

const checks = [
  { name: 'OOP class available', ok: has('server.js', /class\s+TokenStore|class\s+SystemMonitor/) },
  { name: 'SQL access present', ok: has('server.js', /db\.query\(|CREATE TABLE IF NOT EXISTS/i) },
  { name: 'Health endpoint available', ok: has('server.js', /\/api\/health/) },
  { name: 'Metrics endpoint available', ok: has('server.js', /\/api\/metrics/) },
  { name: 'Version endpoint available', ok: has('server.js', /\/api\/version/) },
  { name: 'PWA service worker present', ok: has('sw.js', /self\.addEventListener\('install'|self\.addEventListener\('fetch'/) },
  { name: 'Alert notification present', ok: has('assets/js/main.js', /window\.addEventListener\('error'|window\.alert\(/) || has('assets/js/about.js', /window\.alert\(/) },
  { name: 'Static smoke test present', ok: fs.existsSync(path.join(root, 'tests', 'smoke.test.js')) }
];

try {
  syntaxFiles.forEach(checkSyntax);
  console.log('Syntax check passed for:', syntaxFiles.join(', '));
} catch (error) {
  console.error('Syntax check failed.');
  console.error(error.stdout ? error.stdout.toString() : error.message);
  process.exit(1);
}

const failedChecks = checks.filter((check) => !check.ok);

console.log('Quality checklist:');
checks.forEach((check) => {
  console.log(`- ${check.ok ? 'PASS' : 'FAIL'} ${check.name}`);
});

if (failedChecks.length > 0) {
  console.error('\nStatic analysis failed.');
  process.exit(1);
}

console.log('\nStatic analysis passed.');