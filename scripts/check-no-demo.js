#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BANNED_STRINGS = [
  'DEMO',
  'TEST',
  '0108',
  'DEMO01',
  'test@example.com',
  'demo-user',
  'sample-data',
  'mock-data',
  'fake-data'
];

const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage'
];

const EXCLUDED_FILES = [
  'check-no-demo.js',
  'seed-demo.sh',
  'package-lock.json',
  '.gitignore'
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  BANNED_STRINGS.forEach(bannedString => {
    if (content.includes(bannedString)) {
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes(bannedString)) {
          violations.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            banned: bannedString
          });
        }
      });
    }
  });

  return violations;
}

function scanDirectory(dir) {
  const violations = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(item)) {
        violations.push(...scanDirectory(itemPath));
      }
    } else if (stat.isFile()) {
      if (!EXCLUDED_FILES.includes(item) && 
          (item.endsWith('.js') || item.endsWith('.ts') || 
           item.endsWith('.tsx') || item.endsWith('.jsx') ||
           item.endsWith('.json') || item.endsWith('.md'))) {
        violations.push(...checkFile(itemPath));
      }
    }
  });

  return violations;
}

function main() {
  console.log('🔍 Checking for demo data in production...');
  
  const violations = scanDirectory(process.cwd());

  if (violations.length > 0) {
    console.error('❌ Demo data found in production code:');
    violations.forEach(violation => {
      console.error(`  ${violation.file}:${violation.line} - "${violation.banned}"`);
      console.error(`    ${violation.content}`);
    });
    process.exit(1);
  } else {
    console.log('✅ No demo data found. Production ready!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, scanDirectory, BANNED_STRINGS };