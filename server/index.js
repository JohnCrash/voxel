var sql = require('mssql');
var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var crypto = require('crypto');
var fs = require("fs");
var browserify = require("browserify");
var router = express.Router();

const config = {
  user:'sa',
  password:'123456',
  server:'192.168.2.15',
  database:'ep_tiku',
};
const upload = 'public/';       //上传路径
const images_host = 'images/';  //外部访问路径相对或者绝对

function sqlQuery(query,cb,ep){
  new sql.ConnectionPool(config).connect().then(pool=>{
    return pool.request().query(query);
  }).then(result=>{
    cb(result);
  }).catch(err=>{
    ep(err);
  });
}

/**
 * 使用动态编译javascript
 */
router.get(/.*\.js$/,function(req,res){
  var stream = browserify(`src${req.url}`)
      .transform("babelify", {presets: ["es2015"]})
      .bundle();
  stream.pipe(res);
  stream.on('error',(err)=>{
    /**
     * javascript在编译的时候发生了错误,这里返回一个报告错误的javascript代码
     * 这段代码负责在浏览器上创建一个节点并显示错误信息
     */
    var msg = err.toString().replace(/\\/g,"/");
    res.send(`document.body.innerHTML = "<h2>${msg}</h2>";`);
  });
});

/**
 * 使用动态编译javascript
 */
router.get(/.*\.appcache$/,function(req,res){
  res.send('ok');
});

module.exports = router;
