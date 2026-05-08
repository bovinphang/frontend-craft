#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'targets.manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

for (const target of manifest.targets) {
  const artifactDir = path.join(root, target.artifactPath);
  await mkdir(artifactDir, { recursive: true });

  const metadata = {
    target: target.id,
    minCompatibleVersion: target.minCompatibleVersion,
    conversionRules: target.conversionRules,
    source: manifest.defaults.source,
    generatedFrom: 'targets.manifest.json'
  };

  await writeFile(
    path.join(artifactDir, 'target.generated.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8'
  );
}

console.log(`Generated ${manifest.targets.length} target artifacts from targets.manifest.json`);
