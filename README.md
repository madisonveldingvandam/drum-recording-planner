# Drum Mic Planner

A GitHub Pages-ready web app for planning drum microphone layouts. It is a production planning tool, not an acoustic simulator.

The app now has a real project structure, a data layer, saved local projects, fetched catalog/template data, and technical planning outputs for sessions.

## What It Does

- 3D drum-room planner with editable room, kit, mic, and gobo data
- Local project database using IndexedDB
- Versioned JSON data loaded from `public/data/`
- Mic catalog profiles with default body type and pickup pattern
- Template mic packages: Minimal 4 Mic, Glyn Johns, Full Close Mic
- Per-mic channel, target, position, catalog profile, pattern, stand, and notes
- Technical readouts:
  - mic-to-source distance
  - sound arrival time in milliseconds
  - estimated cable length to stage box
  - standard cable pick
  - selected-source 3:1 phase checks
  - overhead L/R distance matching for snare and kick
- Exports:
  - setup JSON
  - share link
  - patch-list CSV
  - session report Markdown
  - viewport PNG

## Data Model

Static reference data lives in:

- `public/data/mic-catalog.json`
- `public/data/setup-templates.json`

Editable user/session data is saved in the browser via IndexedDB under the `drum-mic-planner` database. This keeps GitHub Pages deployment simple and safe: no backend secrets, no database server, and no GitHub token in the browser.

If shared multi-user projects are needed later, add a backend such as Supabase, Firebase, or a small API. GitHub Pages alone cannot securely write shared server data.

## Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Website Target

The intended public URL is:

```text
https://madisonveldingvandam.com/drum-recording-planner
```

For a normal static host that can serve files from that path:

```bash
npm run build:site
```

That writes `dist-site/` with asset URLs rooted at `/drum-recording-planner/`.

## Cargo Site Deployment

The live website currently runs on Cargo. Cargo pages are not a normal local static-site repo, so the most direct Cargo route is to paste a generated custom HTML fragment into Cargo's raw custom HTML/code-injection area:

```bash
npm run build:cargo
```

This writes:

```text
deploy/cargo-custom-html.html
```

Do not paste that file into normal page content. Cargo will store the app as page markup/text there, escape parts of the JavaScript, and the planner will not run.

Paste the file contents into Cargo's raw Custom HTML area. The generated block is path-gated and only mounts on:

```text
https://madisonveldingvandam.com/drum-recording-planner
```

Keep the Cargo page itself empty or remove any previous failed paste from the normal content editor. The custom HTML block creates the app root and covers Cargo's page shell on the planner route.

The Cargo artifact inlines the app bundle and CSS. It also includes fallback mic catalog and setup-template data in the JavaScript bundle, so the planner still works even if Cargo does not host the separate JSON files from `public/data/`.

## Deploy To GitHub Pages

This repo includes `.github/workflows/pages.yml`.

1. Create a GitHub repo.
2. Commit this project.
3. Push to `main`.
4. In GitHub, enable Pages with **GitHub Actions** as the source.
5. The workflow builds with `npm ci` and deploys `dist-site/`.

The workflow uses `npm run build:site`, so the deployed app is configured for `/drum-recording-planner/`.

## Legacy Single-File Version

The previous static single-file app is preserved at:

```text
legacy/v2-single-file.html
```
