import fs from 'node:fs';
import path from 'node:path';

const [distDir = 'dist-cargo', outFile = 'deploy/cargo-custom-html.html'] = process.argv.slice(2);
const root = process.cwd();
const distPath = path.resolve(root, distDir);
const outPath = path.resolve(root, outFile);
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing build index: ${indexPath}`);
}

const index = fs.readFileSync(indexPath, 'utf8');
const assetRefs = [...index.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map((match) => match[1]);
const cssRefs = assetRefs.filter((ref) => ref.endsWith('.css'));
const jsRefs = assetRefs.filter((ref) => ref.endsWith('.js'));

if (!jsRefs.length) throw new Error('No JavaScript bundle found in build index');

const readAsset = (ref) => {
  const clean = ref.replace(/^\.\//, '');
  return fs.readFileSync(path.join(distPath, clean), 'utf8');
};

const css = cssRefs.map(readAsset).join('\n\n');
const js = jsRefs
  .map(readAsset)
  .join('\n;\n')
  .replace(/\n\/\/# sourceMappingURL=.*$/gm, '')
  .replace(/<\/script/gi, '<\\/script');

const cargoOverrides = `
#drum-planner-cargo-root {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  width: 100vw;
  height: 100vh;
  background: #e8e9eb;
}

#drum-planner-cargo-root #app {
  width: 100vw;
  height: 100vh;
}

html.drum-planner-cargo-active,
body.drum-planner-cargo-active {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  overflow: hidden !important;
}

body.drum-planner-cargo-active .main_container,
body.drum-planner-cargo-active #site_menu_wrapper,
body.drum-planner-cargo-active [data-loading="page"] {
  display: none !important;
}
`.trim();

const inlineCss = JSON.stringify(`${css}\n\n${cargoOverrides}`);

const html = `<!--
Drum Mic Planner Cargo Custom HTML embed.

Do not paste this into normal Cargo page content. Cargo will treat the app
as text/content there and the planner will not run.

Paste this into Cargo's raw Custom HTML / code injection area. It is path-gated
and only mounts on:
https://madisonveldingvandam.com/drum-recording-planner

Generated from ${distDir}.
-->
<script>
(() => {
  const path = window.location.pathname.replace(/\\/+$/, '').toLowerCase();
  if (path !== '/drum-recording-planner') return;

  const start = () => {
    if (window.__DRUM_PLANNER_STARTED__) return;
    window.__DRUM_PLANNER_STARTED__ = true;
    window.__DRUM_PLANNER_INLINE_DATA__ = true;

    document.documentElement.classList.add('drum-planner-cargo-active');
    document.body.classList.add('drum-planner-cargo-active');

    if (!document.getElementById('drum-planner-inline-style')) {
      const style = document.createElement('style');
      style.id = 'drum-planner-inline-style';
      style.textContent = ${inlineCss};
      document.head.appendChild(style);
    }

    let root = document.getElementById('drum-planner-cargo-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'drum-planner-cargo-root';
      document.body.prepend(root);
    }
    root.innerHTML = '<div id="app"></div>';

${js}
  };

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
</script>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log(`Wrote ${path.relative(root, outPath)}`);
