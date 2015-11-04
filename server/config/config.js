/**
 * Created by LuckyJS on 15. 10. 30..
 */
var ip = require('ip');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
var serverPath = path.normalize(rootPath + '/server/');
var clientPath = path.normalize(rootPath + '/public/');

module.exports = {
  server: ip.address(),
  port: process.env.PORT || 9898,
  path: {
    root: rootPath,
    server: serverPath,
    client: clientPath
  }
};