const { app, BrowserWindow } = require('electron');
const setupWindowControls = require('./windowControls');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('src/app/layout/screen_main.html');
  setupWindowControls(win);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('Kiroku is running')