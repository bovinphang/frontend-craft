#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themesPath = path.join(skillDir, "data", "starter-themes.json");
const themes = JSON.parse(fs.readFileSync(themesPath, "utf8"));

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.listThemes) {
  for (const theme of themes) {
    console.log(`${theme.id}\t${theme.name}\t${theme.bestFor}`);
  }
  process.exit(0);
}

const target = path.resolve(process.cwd(), options.target ?? "presentation");
const theme = themes.find((candidate) => candidate.id === options.theme);

if (!theme) {
  fail(`Unknown theme "${options.theme}". Run with --list-themes to see available themes.`);
}

const files = buildFiles(theme);

if (options.dryRun) {
  console.log(`Would create ${files.length} files in ${target}`);
  console.log(`Theme: ${theme.id} (${theme.name})`);
  for (const file of files) console.log(`- ${file.name}`);
  process.exit(0);
}

if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
  fail(`Target directory is not empty: ${target}`);
}

for (const file of files) {
  const fullPath = path.join(target, file.name);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, file.body, "utf8");
}

console.log(`Created web video presentation at ${target}`);
console.log(`Theme: ${theme.id} (${theme.name})`);
console.log("Next:");
console.log("  cd " + path.relative(process.cwd(), target));
console.log("  npm install");
console.log("  npm run dev");

function parseArgs(values) {
  const out = {
    dryRun: false,
    help: false,
    listThemes: false,
    target: undefined,
    theme: themes[0]?.id ?? "editorial-slate",
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") out.help = true;
    else if (value === "--dry-run") out.dryRun = true;
    else if (value === "--list-themes") out.listThemes = true;
    else if (value.startsWith("--theme=")) out.theme = value.slice("--theme=".length);
    else if (value === "--theme") {
      const next = values[index + 1];
      if (!next || next.startsWith("--")) fail("Missing value for --theme.");
      out.theme = next;
      index += 1;
    }
    else if (value.startsWith("--")) fail(`Unknown option: ${value}`);
    else if (!out.target) out.target = value;
    else fail(`Unexpected argument: ${value}`);
  }

  return out;
}

function buildFiles(theme) {
  const tokenCss = renderTokens(theme.tokens);
  return [
    {
      name: "package.json",
      body: JSON.stringify(
        {
          scripts: {
            dev: "vite",
            build: "tsc --noEmit && vite build",
            preview: "vite preview",
          },
          dependencies: {
            react: "latest",
            "react-dom": "latest",
          },
          devDependencies: {
            "@types/react": "latest",
            "@types/react-dom": "latest",
            "@vitejs/plugin-react": "latest",
            typescript: "latest",
            vite: "latest",
          },
        },
        null,
        2,
      ) + "\n",
    },
    {
      name: "index.html",
      body: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Video Presentation</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    },
    {
      name: "tsconfig.json",
      body: JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            useDefineForClassFields: true,
            lib: ["DOM", "DOM.Iterable", "ES2022"],
            allowJs: false,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            module: "ESNext",
            moduleResolution: "Node",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
          },
          include: ["src"],
        },
        null,
        2,
      ) + "\n",
    },
    {
      name: "vite.config.ts",
      body: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`,
    },
    {
      name: "src/main.tsx",
      body: `import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Scene = {
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
};

const scenes: Scene[] = [
  {
    eyebrow: '01 / Hook',
    title: 'Replace this with the first spoken beat',
    body: 'One step equals one idea. Keep it readable in a 1080p recording.',
    detail: 'Use source facts, product states, diagrams, or real assets to make the screen specific.',
  },
  {
    eyebrow: '02 / Proof',
    title: 'Show the evidence, not a generic slide',
    body: 'Turn a claim into a visual: timeline, interface state, metric, map, comparison, or system diagram.',
    detail: 'Advance with Space, ArrowRight, PageDown, or click. Go back with ArrowLeft or PageUp.',
  },
  {
    eyebrow: '03 / Close',
    title: 'End on the idea the viewer should remember',
    body: 'Swap this starter content for your script and outline.',
    detail: 'Controls stay quiet so the stage is clean for recording.',
  },
];

const storageKey = 'fec-web-video-presentation-step-v1';

function App() {
  const [step, setStep] = useState(() => Number(localStorage.getItem(storageKey) ?? 0));
  const current = scenes[Math.min(Math.max(step, 0), scenes.length - 1)];
  const progress = useMemo(() => ((step + 1) / scenes.length) * 100, [step]);

  useEffect(() => {
    localStorage.setItem(storageKey, String(step));
  }, [step]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        setStep((value) => Math.min(value + 1, scenes.length - 1));
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setStep((value) => Math.max(value - 1, 0));
      }
      if (event.key.toLowerCase() === 'r') {
        setStep(0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="viewport" onClick={() => setStep((value) => Math.min(value + 1, scenes.length - 1))}>
      <section className="stage" aria-live="polite">
        <div className="scene-grid">
          <div className="copy">
            <p className="eyebrow">{current.eyebrow}</p>
            <h1>{current.title}</h1>
            <p className="body">{current.body}</p>
          </div>
          <div className="visual" aria-label="Visual evidence placeholder">
            <span>{String(step + 1).padStart(2, '0')}</span>
            <p>{current.detail}</p>
          </div>
        </div>
        <div className="progress" aria-hidden="true">
          <span style={{ width: \`\${progress}%\` }} />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
`,
    },
    {
      name: "src/styles.css",
      body: `${tokenCss}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
}

body {
  background: #111;
  color: var(--stage-fg);
  font-family: var(--font-body);
}

.viewport {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.stage {
  width: min(100vw - 48px, calc((100vh - 48px) * 16 / 9));
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  background: var(--stage-bg);
  color: var(--stage-fg);
  box-shadow: var(--shadow);
}

.scene-grid {
  height: 100%;
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 72px;
  align-items: center;
  padding: 96px;
}

.eyebrow {
  color: var(--accent);
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 26px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(48px, 6vw, 104px);
  line-height: 0.96;
  letter-spacing: 0;
  margin: 0;
  text-wrap: balance;
}

.body {
  color: var(--muted-fg);
  font-size: 32px;
  line-height: 1.35;
  margin: 36px 0 0;
  max-width: 820px;
  text-wrap: pretty;
}

.visual {
  min-height: 560px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
  display: grid;
  align-content: space-between;
  padding: 42px;
}

.visual span {
  color: var(--accent-2);
  font-family: var(--font-display);
  font-size: 132px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.visual p {
  margin: 0;
  color: var(--muted-fg);
  font-size: 26px;
  line-height: 1.4;
}

.progress {
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 28px;
  height: 3px;
  background: color-mix(in srgb, var(--line) 70%, transparent);
  opacity: 0;
  transition: opacity 160ms ease;
}

.stage:hover .progress,
.stage:focus-within .progress {
  opacity: 1;
}

.progress span {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width var(--step-duration) ease;
}

@media (prefers-reduced-motion: reduce) {
  .progress,
  .progress span {
    transition: none;
  }
}
`,
    },
    {
      name: "README.md",
      body: `# Web Video Presentation

Generated with Frontend Craft.

- 16:9 browser recording stage
- Step-driven scenes
- Keyboard and click navigation
- Theme tokens in \`src/styles.css\`

Replace the starter scenes in \`src/main.tsx\` with your script and outline.
`,
    },
  ];
}

function renderTokens(tokens) {
  return `:root {
  --stage-bg: ${tokens.stageBg};
  --stage-fg: ${tokens.stageFg};
  --muted-fg: ${tokens.mutedFg};
  --accent: ${tokens.accent};
  --accent-2: ${tokens.accent2};
  --panel: ${tokens.panel};
  --line: ${tokens.line};
  --shadow: ${tokens.shadow};
  --font-display: ${tokens.fontDisplay};
  --font-body: ${tokens.fontBody};
  --radius: ${tokens.radius};
  --step-duration: ${tokens.stepDuration};
}`;
}

function printHelp() {
  console.log(`Usage:
  node skills/fec-web-video-presentation/scripts/create-video-presentation.mjs [target] [--theme=<id>] [--dry-run]
  node skills/fec-web-video-presentation/scripts/create-video-presentation.mjs --list-themes
`);
}

function fail(message) {
  console.error(`[create-video-presentation] ${message}`);
  process.exit(1);
}
