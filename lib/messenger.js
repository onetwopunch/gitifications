'use strict';

const BrowserWindow = require('browser-window')
const path = require('path')

module.exports = class Messenger {
  constructor() {
    this.loaded = false

    this.window = new BrowserWindow({
      show: true,
      width: 0,
      height: 0,
      preload: path.join(__dirname, 'window.js')
    });

    let url = path.join("file://", this.getRoot(), 'index.html');
    console.log(url);
    this.window.loadURL(url);

    // NOTE: Useful in debugging client side errors from window.js
    // this.window.webContents.openDevTools();

    this.onLoad(() => {
      console.log("On Load Called")
      require('power-monitor').on('resume', this.reset.bind(this))
    })
  }

  onLoad(cb) {
    this.window.webContents.on('did-finish-load', cb.bind(this))
  }

  reset() {
    console.log('Resetting timer')
    this.window.webContents.send('reset')
  }
  getRoot() {
    let spl = __dirname.split("/");
    spl.pop();
    return spl.join("/");
  }
}
