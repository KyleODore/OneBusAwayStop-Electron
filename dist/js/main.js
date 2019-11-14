const { app, BrowserWindow } = require('electron');
const $ = jQuery = require('jquery');
// const $ = jQuery = require('jquery')(require("jsdom").jsdom().defaultView);
// var jsdom = require('jsdom');
// $ = jQuery = require('jquery')(new jsdom.JSDOM().window);

const stop = '26965'; // N 40th St & Wallingford Ave N (E bound)
const apiKey = '509c2555-aa5e-4a34-ab64-18e3ec5a827b';
const oneBusStopInfo = 'http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_'+ stop + '.xml?key=' + apiKey;
const testResponse = 'http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_75403.xml?key=TEST';
var today;
var time;
// const { main } = require('electron').remote.require('dist/js/one-bus.js');

let win;

function createWindow() {
  win = new BrowserWindow({
    // 480×320 for raspberry pi screen I am using
    width: 960,
    height: 640,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.webContents.openDevTools();

  win.loadFile('dist/html/index.html');
  
  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

app.on('web-contents-created', main());

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

/* Processing Code */
/*
Method: arrivals-and-departures-for-stop
Get current arrivals and departures for a stop identified by id
http://developer.onebusaway.org/modules/onebusaway-application-modules/current/api/where/methods/arrivals-and-departures-for-stop.html

Method: arrival-and-departure-for-stop
Get info about a single arrival and departure for a stop
http://developer.onebusaway.org/modules/onebusaway-application-modules/current/api/where/methods/arrival-and-departure-for-stop.html

Method: current-time
Retrieve the current system time
http://developer.onebusaway.org/modules/onebusaway-application-modules/current/api/where/methods/current-time.html
*/

function main() {
  
  getCurrTimeString();
  getStopInfo();
  $("#stopInfo").html("Stop Info for Stop (" + stop + ") " + time);
}

function getCurrTimeString() {
  today = new Date();
  time = dateToString(today);
}

function convertToTimeString(specificTime) {
  return dateToString(new Date(specificTime));
}

function dateToString(inputDate) {
  return addTens(inputDate.getHours()) + ":" + addTens(inputDate.getMinutes()) + ":" + addTens(inputDate.getSeconds());
}

function getTimeDiffString(timeArrive) {
  let timeInSec = Math.floor((timeArrive - today.getTime()) / 1000);
  let timeInMin = Math.floor(timeInSec / 60);
  let timeInHour = Math.floor(timeInMin / 60);
  return addTens(timeInHour) + ":" + addTens(timeInMin) + ":" + addTens(timeInSec % 60);
}

function addTens(count) {
  return (count < 10 && count >= 0 ? '0' : '') + count;
}

//handle busses that aren't arriving
function getStopInfo() {
  $.ajax({
    type: "GET",
    url: testResponse,
    dataType: "xml",
    success: function(xml) {
      // var currentTime = new Date($(xml).find('currentTime'));
      $("#busTable > tbody").empty();
      $(xml).find('arrivalAndDeparture').each(function() {
        var routeName = $(this).find('routeShortName').text();
        var stopsAway = $(this).find('numberOfStopsAway').text();
        var arrivalTime = new Date(parseInt($(this).find('predictedArrivalTime').text()));
        var minsAway = new Date(parseInt($(this).find('predictedArrivalTime').text()));
        let response = 
                      "<tr>"
                    + " <td>" + routeName + "</td>"
                    + " <td>" + stopsAway + "</td>"
                    + " <td class=\"time\">" + convertToTimeString(arrivalTime) + "</td>"
                    + " <td class=\"time\">" + getTimeDiffString(minsAway.getTime()) + "</td>"
                    + "</tr>";
        $("#busTable > tbody:last-child").append(response);
        console.log(response);
      });
    },
    error: function() {
      alert("An error occurred while processing data from OneBusAway.");
    }
  });
}