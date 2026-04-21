const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

assert.ok(fs.existsSync(path.join(root, 'server.js')), 'server.js should exist');
assert.ok(fs.existsSync(path.join(root, 'sw.js')), 'sw.js should exist');
assert.ok(fs.existsSync(path.join(root, 'register-sw.js')), 'register-sw.js should exist');
assert.ok(fs.existsSync(path.join(root, 'assets', 'js', 'main.js')), 'main.js should exist');
assert.ok(read('server.js').includes('class TokenStore'), 'server should include OOP TokenStore');
assert.ok(read('server.js').includes('/api/health'), 'server should expose health endpoint');
assert.ok(read('server.js').includes('/api/metrics'), 'server should expose metrics endpoint');
assert.ok(read('server.js').includes('/api/version'), 'server should expose version endpoint');
assert.ok(read('assets/js/main.js').includes("window.addEventListener('error'"), 'main.js should notify app errors');

console.log('Smoke test passed.');