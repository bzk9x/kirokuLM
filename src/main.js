const { app, BrowserWindow } = require('electron');
const setupWindowControls = require('./windowControls');
const path = require('path');

const { ipcMain } = require('electron');
const os = require('os');
const fs = require('fs');

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

ipcMain.handle('get-user-info', async () => {
  const username = os.userInfo().username;
  let avatarPath = null;
  try {
    const userProfile = process.env.USERPROFILE;
    const possible = [
      path.join(userProfile, 'AppData', 'Roaming', 'Microsoft', 'Windows', 'AccountPictures'),
      path.join(userProfile, 'Pictures'),
      path.join(process.env.PUBLIC || '', 'AccountPictures')
    ];
    
    for (const dir of possible) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => 
          f.toLowerCase().endsWith('.jpg') || 
          f.toLowerCase().endsWith('.jpeg') || 
          f.toLowerCase().endsWith('.png')
        );
        for (const file of files) {
          if (file.includes('User') || file.includes('Profile') || file.includes('Avatar')) {
            const filePath = path.join(dir, file);
            try {
              await fs.promises.access(filePath, fs.constants.R_OK);
              avatarPath = filePath;
              break;
            } catch (e) {
              console.log('File not readable:', filePath);
            }
          }
        }
        if (avatarPath) break;
      }
    }
  } catch (e) {
    console.error('Error getting user avatar:', e);
  }

  if (!avatarPath) {
    avatarPath = path.join(__dirname, 'app', 'res', 'images', 'default_avatar.png');
  }

  return {
    username,
    avatarPath
  };
});

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