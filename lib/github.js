'use strict'
var https   = require('https');
var fs      = require('fs');
var Promise = require('bluebird');
var path    = require('path');

module.exports = class Github {
  getRoot() {
    let spl = __dirname.split("/");
    spl.pop();
    return spl.join("/");
  }
  getCredentials(){
    return new Promise( (resolve, reject) => {
      fs.readFile(path.join(this.getRoot(), 'credentials.json'), (err, data) => {
        try {
          let res = JSON.parse(data);
          resolve(res);
          reject(err);
        } catch( e ) {
          reject(err);
        }
      });
    })
  }
  notifications(){
    return new Promise( (resolve, reject) => {
      let token, username;
      this.getCredentials()
      .then( (creds) => {
        token = "TOKEN " + creds.token;
        username = creds.username;
      })
      .then( function() {
        var options = {
          hostname: 'api.github.com',
          method: 'GET',
          path: '/notifications?all=true',
          port: 443,
          headers: { "Authorization": token, "User-Agent": username }
        }
        console.log({token: token, username: username});
        https.request(options, (res) => {
          var response = "";
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
             response += chunk;
          });
          res.on('end', () => {
            var data = JSON.parse(response);
            resolve(data);
          })
        }).on('error', (err) => {
          reject(err);
        }).end();
      })
      .catch( function(err ) {
        console.log(err);
      })
    })
  }
}
