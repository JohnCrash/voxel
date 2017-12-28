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

function sqlDateToJsDate(d){
    return d.toISOString().replace('T',' ').slice(0,-2);
}

/**
 * 通过userstream方向计算用户帐号的创建时间
 */
function calcCreateTime(){
    //遍历全部用户,每次100个用户
    function doeach(data,callback,qqs){
        let task = [];
        for(let user of data){
            task.push((cb)=>{
                let qs = `select top 1 date from UserStream where uid=${user.uid} order by date`;
                sql(qs).then((result)=>{
                    if(result.recordset && result.recordset.length===1){
                        sql(`update UserInfo set createdate='${sqlDateToJsDate(result.recordset[0].date)}' where uid=${user.uid}`);
                    }
                    cb(false,'ok');
                }).catch((err)=>{
                    console.log(err);
                    cb(true,qs);
                });
            });
        }
        async.series(task,(err,results)=>{
            if(!err){
                callback(false,'ok');
                console.log(qqs,'done');
            }else{
                callback(true,'failed');
            }
        });
    }
    
    sql('select count(*) from UserInfo').then((result)=>{
        let part = [];
        if(result.recordset.length===1){
            let num = Number(result.recordset[0][''])+100;
            for(let i = 171501;i<num;i+=100){
                let qs = `select uid from UserInfo where id>=${i} and id<${i+100}`;
                part.push((cb)=>{
                    sql(qs).then((result)=>{
                        doeach(result.recordset,cb,qs);
                    }).catch((err)=>{
                        console.log(err);
                        cb(true,qs);
                    });
                })
            }
            async.series(part,(err,results)=>{
                if(!err){
                    console.log('all ok');
                }else{
                    console.log('failed');
                }
            });    
        }
    }).catch((err)=>{
        console.error(err);
    });
}

calcCreateTime();