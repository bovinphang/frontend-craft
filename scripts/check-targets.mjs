#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'targets.manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const missing = [];
for (const target of manifest.targets) {
  const artifactFile = path.join(root, target.artifactPath, 'target.generated.json');
  try {
    await access(artifactFile);
  } catch {
    missing.push(`${target.id}: ${path.relative(root, artifactFile)}`);
  }
}

if (missing.length > 0) {
  console.error('Missing target artifacts:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`All ${manifest.targets.length} targets have generated artifacts.`);
