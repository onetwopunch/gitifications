'use strict'

var ipc = require('ipc');
var interval = 5 * 1000; //two minutes
var Github = require('./github');
var date = new Date().toISOString();

function checkForNotifications() {
  let gh = new Github()
  gh.notifications(date).then(function(data){
    if (data.length == 0)
      return;

    let message;
    if (data.length == 1) {
      try {
        message = data[0].subject.title
      } catch(e){
        message = "You have " + data.length + " unread Github notifications";
      }
    } else {
      message = "You have " + data.length + " unread Github notifications";
    }

    new Notification('New Github Notification', {
      body: message
    })
    date = new Date().toISOString();
  }).catch( function(err) {
    console.log(err);
  })
}

var interval = setInterval(checkForNotifications, interval);

ipc.on('reset', function() {
  clearInterval(interval);
  interval = setInterval(notify, interval);
})
