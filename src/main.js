const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const path = require('path');

let windows = [];
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
}

function createDesktopWindow(display) {
  const { x, y, width, height } = display.bounds;

  const win = new BrowserWindow({
    x,
    y,
    width,
    height,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    fullscreen: false,
    autoHideMenuBar: true,
    backgroundColor: '#0b0d10',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Electron 44 removed the old setAlwaysOnBottom API.
  win.setIgnoreMouseEvents(false);
  win.loadFile(path.join(__dirname, 'index.html'));

  win.on('closed', () => {
    windows = windows.filter((item) => item !== win);
  });

  return win;
}

function createWindows() {
  windows.forEach((win) => {
    if (!win.isDestroyed()) win.close();
  });
  windows = screen.getAllDisplays().map(createDesktopWindow);
}

if (gotSingleInstanceLock) {
  app.whenReady().then(() => {
    if (process.platform === 'win32') {
      app.setLoginItemSettings({ openAtLogin: true, openAsHidden: false });
    }

    createWindows();
    screen.on('display-added', createWindows);
    screen.on('display-removed', createWindows);
    screen.on('display-metrics-changed', createWindows);
    globalShortcut.register('CommandOrControl+Shift+Q', () => app.quit());
  });

  app.on('second-instance', () => {
    // A second launch reuses the existing desktop instance.
  });
}

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
