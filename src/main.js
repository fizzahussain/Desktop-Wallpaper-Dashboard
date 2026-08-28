const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;

  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    alwaysOnBottom: true,
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: '#0b0d10',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setAlwaysOnBottom(true, 'screen-saver');
  win.loadFile(path.join(__dirname, 'index.html'));

  globalShortcut.register('CommandOrControl+Shift+Q', () => app.quit());
}

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    const loginSettings = { openAtLogin: true };
    if (!app.isPackaged) loginSettings.args = [app.getAppPath()];
    app.setLoginItemSettings(loginSettings);
  }

  createWindow();
});

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
