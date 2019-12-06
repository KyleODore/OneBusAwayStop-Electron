const { app, BrowserWindow } = require('electron');

const stop = '26965'; // N 40th St & Wallingford Ave N (E bound)
const apiKey = '509c2555-aa5e-4a34-ab64-18e3ec5a827b';
const oneBusStopInfo = 'http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_'+ stop + '.xml?key=' + apiKey;
const testResponse = 'http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_75403.xml?key=TEST';
var today;
var time;

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