/**
 * 从UserStream计算付款情况
 */
const async = require("async");
const config = require('../config2');
const Sql = require('mssql');

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

/**
 * 通过userstream 计算每天的解锁人数
 */
 //某一天的全部用户流
function eachUserStream(date,each,done){
    sql(`select action from UserStream where DATEDIFF(DD,'${date}',date)=0`).then(result=>{
        result.recordset.forEach(element => {
            each(date,element);
        });
        done(false,date);
    }).catch((err)=>{
        console.error(err);
        done(true,err);
    })
}

//从某一天开始一直到今天
function eachDayToday(date){
    let d = new Date(date);
    let today = new Date();
    let task = [];
    for(;d<today;d.setDate(d.getDate()+1)){
        let dd = d.toISOString().slice(0,10);
        let sta = {date:dd,unlock:0,tips:0,distriblv:{}};
        task.push((cb)=>{
            eachUserStream(dd,(date,element)=>{
                if(element.action[0] === 'g'){
                    //提示解锁
                    let m = element.action.match(/goldtips\((\d+)\)/);
                    if(m && m[1]){
                        sta.tips += 300;
                        sta.distriblv[m[1]] = sta.distriblv[m[1]]?sta.distriblv[m[1]]+300:300;
                    }else{
                        m = element.action.match(/g\((\d+)\-(\d+)\)/);
                        if(m && m[1] && m[2]){
                            sta.tips += m[2];
                            sta.distriblv[m[1]] = sta.distriblv[m[1]]?sta.distriblv[m[1]]+m[2]:m[2];
                        }
                    }
                }else if(element.action[0] === 'u'){
                    //通过解锁
                    let m = element.action.match(/unlock2\((\d+)\)/);
                    if( m && m[1] ){
                        sta.unlock += 3000;
                    }else{
                        m = element.action.match(/u\((\d+)\-(\d+)\)/);
                        if(m && m[1] && m[2]){
                            sta.unlock += m[2];
                        }
                    }
                }
            },(err,date)=>{
                if(!err){
                    cb(false,'ok');
                    //将数据写入到数据库中
                    sql(`insert into DayIncome (date,unlock,tips) values ('${date}',${sta.unlock},${sta.tips})`);
                    for(let lv in sta.distriblv){
                        sql(`exec Update_DistribLv ${lv},${sta.distriblv[lv]}`);
                    }
                    console.log(sta);
                }else
                    cb(true,err);
            });    
        });
    }
    async.series(task,(err,results)=>{
        if(!err){
            console.log('done');
        }else{
            console.error(err);
        }
    });
}

eachDayToday('2017-12-01');
//eachDayToday('2018-02-28');