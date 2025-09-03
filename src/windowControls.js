const { ipcMain, BrowserWindow } = require('electron');

function setupWindowControls(win) {
  ipcMain.on('window-minimize', () => {
    win.minimize();
  });
  ipcMain.on('window-maximize', () => {
    win.maximize();
  });
  ipcMain.on('window-unmaximize', () => {
    win.unmaximize();
  });
  ipcMain.on('window-close', () => {
    win.close();
  });

  win.on('maximize', () => {
    win.webContents.send('window-maximized');
  });
  win.on('unmaximize', () => {
    win.webContents.send('window-unmaximized');
  });
}

module.exports = setupWindowControls;