# Desktop Wallpaper Dashboard

A local-first Windows desktop dashboard that turns the desktop into an editable workspace.

## Features

- Windows-inspired dark desktop interface
- Persistent sticky notes and task checklist
- Draggable notes with saved positions
- Custom wallpaper selection with persistent local storage
- Wallpaper readability overlay
- Live clock and date
- Borderless, fullscreen, always-on-bottom desktop behavior
- Windows startup launch configuration
- Windows NSIS installer
- Automated Windows installer builds through GitHub Actions

## Development

```bash
npm install
npm start
```

Create a Windows installer locally with:

```bash
npm run dist
```

The packaged installer is generated in `dist/`.

## Project Structure

- `src/main.js` — Electron main process and Windows desktop integration
- `src/index.html` — dashboard structure
- `src/styles.css` — dark desktop visual system
- `src/renderer.js` — dashboard interactions
- `src/notes.js` — persistent sticky-note state
- `src/tasks.js` — persistent task state
- `src/settings.js` — wallpaper preferences
- `.github/workflows/windows-build.yml` — automated Windows builds

## Release

Every push to `main` triggers a Windows build in GitHub Actions. The generated `.exe` installer is uploaded as a workflow artifact.
