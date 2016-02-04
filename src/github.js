'use strict'
const https   = require('https');
const fs      = require('fs');
const Promise = require('bluebird');
const path    = require('path');
const helper = require('./helper');
const credentialsFile = path.join(helper.getRoot(), 'credentials.json');
const request = require('request');

module.exports = class Github {

  getCredentialsFile() {
    return credentialsFile;
  }
  getCredentials(){
    return new Promise( (resolve, reject) => {
      fs.readFile( credentialsFile, (err, data) => {
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

  setCredentials(username, token) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({username: username, token: token});
      fs.writeFile(credentialsFile, data, (err) => {
        if(err)
          return reject(err);
        else
          return resolve();
      });
    })
  }
  validateToken( username, token ) {
    return new Promise( (resolve, reject) => {
      var opts = {
        hostname: 'api.github.com',
        method: 'GET',
        path: '/notifications',
        port: 443,
        headers: { "Authorization": "TOKEN " +token, "User-Agent": username }
      }
      https.request(opts, (res) => {
        return resolve(res.statusCode == 200);
      }).on('error', (err) => {
        return reject(err);
      }).end();
    })
  }
  notifications( since ){
    return new Promise( (resolve, reject) => {
      let token, username;
      this.getCredentials()
      .then( (creds) => {
        token = "TOKEN " + creds.token;
        username = creds.username;
      })
      .then( function() {
        var opts = {
          hostname: 'api.github.com',
          method: 'GET',
          // path: '/notifications?since=' + since,
          path: '/notifications',
          port: 443,
          headers: { "Authorization": token, "User-Agent": username }
        }
        console.log({token: token, username: username});
        https.request(opts, (res) => {
          var response = "";
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
             response += chunk;
          });
          res.on('end', () => {
            console.log("response code: " + res.statusCode);
            var data = JSON.parse(response);
            return resolve(data);
          })
        }).on('error', (err) => {
          return reject(err);
        }).end();
      })
      .catch( function(err ) {
        console.log(err);
      })
    })
  }
}
