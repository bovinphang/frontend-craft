import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'targets.manifest.json');
const args = process.argv.slice(2);
const targetArg = args.includes('--target') ? args[args.indexOf('--target') + 1] : null;

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const targets = manifest.targets.filter((t) => t.enabled && (!targetArg || t.id === targetArg));

if (!targets.length) {
  console.error('No enabled targets matched.');
  process.exit(1);
}

const copySources = ['agents', 'skills', 'commands', 'templates'];

for (const target of targets) {
  const outDir = path.join(root, target.outputDir);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  for (const source of copySources) {
    const src = path.join(root, source);
    const dst = path.join(outDir, source);
    fs.cpSync(src, dst, { recursive: true });
  }

  const metadata = {
    target: target.id,
    adapter: target.adapter,
    generatedAt: new Date().toISOString(),
    sourceRepo: 'bovinphang/frontend-craft'
  };
  fs.writeFileSync(path.join(outDir, 'BUILD_INFO.json'), JSON.stringify(metadata, null, 2));
  console.log(`Built target: ${target.id} -> ${target.outputDir}`);
}
