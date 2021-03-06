

const {remote} = require('electron')
// var robot = require ("robot-js");
const ipcMain = require('electron').ipcMain;
console.log(remote, "remote");
const BrowserWindow = remote.BrowserWindow;
console.log(BrowserWindow, "BrowserWindow");
// console.log("remote", remote);
const path = require('path')
const url = require('url');
const ipc = require('electron').ipcRenderer;
// const ipcMain = require('electron').ipcMain;
const { desktopCapturer } = require("electron");
import { takeScreenshot } from "./screencapture";
console.log(ipcMain, 'ipc');

let win;

module.exports = function () {
  return new Promise((resolve, reject) => {

    desktopCapturer.getSources({ types: ["screen"] }, (error, sources) => {
      if (error) throw error;

      takeScreenshot({
        sourceId: sources[0].id.replace("screen:", "")
      }).then(result => {
          win = new BrowserWindow({
            transparent: true,
            frame: false,
            toolbar: true,
          });
          console.log(win, 'winddddd');
          win.setSimpleFullScreen(true);
          win.show();
          console.log(process.cwd(), 'process');
          win.loadURL(path.join('file://', process.cwd(), 'src/screenshot.html'));
          win.webContents.on('did-finish-load', () => {
            win.webContents.send('screenshot', result)
          });
        });
    });
    // win.on('closed', () => {
    //   win = null
    // })
    ipc.on('clickedPixels', (event, message) => {
      const pixels = JSON.parse(message).data;
      console.log(pixels, 'pixels selected');
      let rgbBox = document.getElementById('rgb-color-box');
      let rgbValues = document.getElementById('rgb-values');
      rgbValues.innerHTML = `rgba(${pixels[0]},${pixels[1]}, ${pixels[2]}, ${pixels[3]})`
      rgbBox.style.display = "inline-block";
      rgbBox.style.backgroundColor = `rgba(${pixels[0]},${pixels[1]}, ${pixels[2]}, ${pixels[3]})`;
      resolve(pixels);
    });

  });
}
// export default pick;
