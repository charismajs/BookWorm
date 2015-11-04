/**
 * Created by LuckyJS on 15. 10. 30..
 */
var ip = require('ip');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  server: ip.address(),
  port: process.env.PORT || 9898,
  rootPath: rootPath
};