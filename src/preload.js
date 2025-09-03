const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  unmaximize: () => ipcRenderer.send('window-unmaximize'),
  close: () => ipcRenderer.send('window-close'),
  onMaximized: (callback) => ipcRenderer.on('window-maximized', callback),
  onUnmaximized: (callback) => ipcRenderer.on('window-unmaximized', callback)
});