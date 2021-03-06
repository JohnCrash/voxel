var sql = require('mssql');
var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var crypto = require('crypto');
var browserify = require("browserify");
var watchify = require("watchify");
var router = express.Router();
var config = require('./config');

if(config.debug){

  
/**
 * 使用动态编译javascript
 */
router.get(/.*\.js$/,function(req,res,next){
  if(typeof browserify === 'function'){
    var stream = browserify(`src${req.url}`,{debug:true,cache: {}, packageCache: {},plugin: [watchify]})
        .transform("babelify", {presets: ["es2015","es2016","es2017","react","stage-0"]})
        .bundle();
    stream.pipe(res);
    stream.on('error',(err)=>{
      /**
       * javascript在编译的时候发生了错误,这里返回一个报告错误的javascript代码
       * 这段代码负责在浏览器上创建一个节点并显示错误信息
       */
      var msg = err.toString().replace(/\\/g,"/");
      msg = msg.replace(/"/g,"&quot;");
      console.log(msg);
      if(!res.headersSent) //这里仅展示一个错误信息
        res.send(`document.body.innerHTML = "<h2>${msg}</h2>";`);
    });
  }else if(next){
    next();
  }else{
    res.send('error');
  }
});

/**
 * 枚举资源文件
 */
router.get('/list',function(req,res){
  fs.readdir(`${config.upload}/${req.query['dir']}`,function(err,files){
    if(err){
      res.json({err:err});
    }else{
      res.json({files:files});
    }
  });
});

/**
 * 将json保存到指定的文件中，不能覆盖
 */
router.post('/save',function(req,res){
  let filename = config.upload+req.query['file'];

  let json = req.body;
  try{
    let jsonStr = JSON.stringify(json,null,'\t');
    fs.writeFile(filename,jsonStr,(err)=>{
      if(err){
        res.json({result:err.toString()});
      }else{
        res.json({result:'ok'});
      }
    });
  }catch(e){
    res.json({result:e.toString()});
  }
});

/**
 * 读取json文件
 */
router.get('/load',function(req,res){
  let filename = config.upload+req.query['file'];

  fs.readFile(filename,(err,data)=>{
    if(err){
      res.json({result:err.toString()});
    }else{
      let s = data.toString();
      try{
        res.json({result:'ok',content:JSON.parse(s)});
      }catch(e){
        res.json({result:e.toString()});
      }
    }
  });
});


}

module.exports = router;
