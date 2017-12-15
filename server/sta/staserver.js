/**
 * 对用户数据进行统计
 * 1.关卡数据StaLv ,以天为单位，统计每关卡的用户数量
 * 2.用户使用的平台分布
 */
const { spawn } = require('child_process');
var app = require('./staapp');
var http = require('http');

var port = 3321;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

server.listen(port);