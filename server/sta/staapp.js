var express = require('express');
var compression = require('compression');
const router = express.Router();
var path = require('path');
var os = require('os');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../config');
const crypto = require('crypto');
const Sql = require('mssql');

var app = express();
function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    }
    // fallback to standard filter function
    return true;//compression.filter(req, res);
}
app.use(compression({filter: shouldCompress}));

var lastDay = 0;
/*
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(config.public));
*/
const SQL = Sql.connect(config.sqlserver);
function sql(query){
  /*
    //老的连接池方式
    return new Sql.ConnectionPool(config.sqlserver).connect().then(pool=>{
      return pool.request().query(query);
    });
  */
  return SQL.then((pool)=>{return pool.request().query(query)});
}

/**
 * 开始进行统计操作
 */
function doStaLv(){
    //做检查看看是不是今天的数据已经在里面了，如果在就不做了
    sql(`select COUNT(*) from StaLv where DATEDIFF(DD,date,GETDATE())=0`).then((result)=>{
        let data = result.recordset;
        if(!(data && data[0])){
            //已经有了数据了
            for(let i=0;i<201;i++){
                setTimeout(()=>{
                    sql(`select count(*) from UserInfo where lv=${i}`).then((result)=>{
                        let data = result.recordset;
                        if(data && data[0]){
                            let count = data[0][''];
                            sql(`insert into StaLv (date,lv,count) values (getdate(),${i},${count})`);
                        }
                    }).catch((err)=>{
                        console.error(err);
                    });    
                },i*200);
            }                    
        }
    }).catch((err)=>{
        console.error(err);
    });
}

/**
 * 启动一个周期进程用来从分析数据
 * 一分钟比较轮询一次，到晚上23:59开始统计
 */
setInterval(function(){
    let t = new Date();
    if(t.getHours()===23 && t.getMinutes()===59 && t.getDay() !== lastDay){
        doStaLv();
        lastDay = t.getDay();
    }
},50*1000);

/**
 * 提取统计数据
 */
app.use('/stalv',function(req,res){
    /**
     * 最近一个星期(7天)的数据
     */
    sql(`select * from StaLv where DateDiff(DD,date,getdate())<=7`).then((result)=>{
        res.json({result:'ok',stalv:result.recordset});
    }).catch((err)=>{
        res.json({result:err});
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    res.send(err.toString());
  });

module.exports = app;