'use strict'

var ipc = require('ipc')
var interval = 10000
var Github = require('./github');

function checkForNotifications() {
  let gh = new Github()
  gh.notifications().then(function(data){
    let message = "You have " + data.length + " unread Github notifications"
    new Notification('Github Notification', {
      body: message
    })
  }).catch( function(err) {
    console.log(err);
  })
}

var interval = setInterval(checkForNotifications, interval);

ipc.on('reset', function() {
  clearInterval(interval);
  interval = setInterval(notify, interval);
})
