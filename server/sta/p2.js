require('timers');
var async = require("async");
var config = require('../config2');
const Sql = require('mssql');

//较大的查询需要更长的时间传输
config.sqlserver.connectionTimeout = 150000;

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

function sqlDateString(d){
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

function sqlDateToJsDate(d){
    return d.toISOString().replace('T',' ').slice(0,-2);
}

sql(`select uid from UserInfo where datediff(hh,createdate,GETDATE())<25`).then((result)=>{
    console.log('total : ',result.recordset.length);
    let task = []; 
    let noin = 0;
    let inone = 0;
    let totalTime = 0;
    for(let user of result.recordset){
        task.push((cb)=>{
            sql(`select action,date from UserStream where uid=${user.uid}`).then((R)=>{
                let hasin = false;
                let startTime;
                let endTime;
                for(let i of R.recordset){
                    if(i.action.startsWith('enter 1')){
                        startTime = new Date(i.date);
                    }else if(i.action.startsWith('enter 2')){
                        hasin = true;
                        endTime = new Date(i.date);
                    }else if(i.action.startsWith('exit 1')){
                        hasin = true;
                        endTime = new Date(i.date);
                    }
                }
                if(hasin && startTime && endTime){
                    totalTime += ((startTime-endTime)/1000);
                    inone++;
                }else
                    noin++;
                cb(false);
            }).catch((err)=>{
                console.log(err);
                cb(true); 
            });
        });
    }
    async.series(task,(err,results)=>{
        if(!err){
            console.log('进入第一关的人 : ',inone);
            console.log('一关没进入的人 : ',noin);
            console.log('totalTime : ',totalTime);
            console.log('进入第一关人的平均用时 : ',totalTime/inone,'秒');
            console.log('OK');
        }else{
            console.log('FAILED');
        }
    });
}).catch((err)=>{
    console.log(err);
});