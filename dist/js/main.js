const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    // 480×320 for raspberry pi screen I am using
    width: 480,
    height: 320,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // win.webContents.openDevTools();

  win.loadFile('dist/html/index.html');
  
  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});