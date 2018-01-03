require('timers');
var async = require("async");
var config = require('../config2');
const Sql = require('mssql');

var lastDay = -1;
var lastHours = -1;

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

/**
 * 开始进行统计操作
 */
function doStaLv(){
    //做检查看看是不是今天的数据已经在里面了，如果在就不做了
    console.log('doStaLV');
    console.log(new Date().toLocaleString());
    sql(`select COUNT(*) from StaLv where DATEDIFF(DD,date,GETDATE())=0`).then((result)=>{
        let data = result.recordset;
        if(!(data && String(data[0][""])!=='0')){
            //已经有了数据了
            console.log('do...');
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
 * 统计关卡用时
 */
function doStaLvt(){
    console.log('doStaLVT');
    console.log(new Date().toLocaleString());
    sql(`select COUNT(*) from StaLvt where DATEDIFF(DD,date,GETDATE())=0`).then((result)=>{
        let data = result.recordset;
        if(!(data && String(data[0][""])!=='0')){
            //已经有了数据了
            console.log('do stlvt...');
            for(let i=0;i<201;i++){
                setTimeout(()=>{
                    sql(`select AVG(avgms) as avg1,AVG(tms) as avg2 from Level where lv=${i}`).then((result)=>{
                        let data = result.recordset;
                        let avg1 = 0;
                        let avg2 = 0;
                        if(data && data[0]){
                            avg1 = data[0].avg1;
                            avg2 = data[0].avg2;
                        }
                        sql(`insert into StaLvt (date,lv,avg,tms) values (getdate(),${i},${avg1},${avg2})`);
                    }).catch((err)=>{
                        sql(`insert into StaLvt (date,lv,avg,tms) values (getdate(),${i},0,0)`);
                        console.error(err);
                    });    
                },i*200);
            }                    
        }
    }).catch((err)=>{
        console.error(err);
    });    
}

//返回一个sql日期 '2017-12-09 00:00:00'
function sqlDateString(d){
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

function sqlDateToJsDate(d){
    return d.toISOString().replace('T',' ').slice(0,-2);
}

/**
 * 活跃统计
 */
function doStaAU(){
    console.log('doStaAU');
    sql(`select * from StaStreamProgress`).then((result)=>{
        let data = result.recordset;
        let begindate;
        //以小时为基础从UserStream向上查找
        let enddate = new Date();
        enddate.setMinutes(0);
        enddate.setSeconds(0);
        enddate.setMilliseconds(0);
        if(data.length===0){
            //从头开始搜索
            //将以前的数据全部清空重新搜索
            sql(`delete StaAU`).then(()=>{
                return sql(`select min(date) from UserStream`); //查找UserStream的最早时间
            }).then((result)=>{
                if(result.recordset && result.recordset.length>0){
                    console.log('first date: ',result.recordset[0]['']);
                    console.log('canvert to:',sqlDateToJsDate(result.recordset[0]['']));
                    begindate = new Date(sqlDateToJsDate(result.recordset[0]['']));
                    //begindate = result.recordset[0][''];
                    begindate.setMinutes(0);
                    begindate.setSeconds(0);
                    begindate.setMilliseconds(0);
                    console.log('ALL');
                    doit(begindate,enddate);
                }else{
                    console.error(`select min(date) as start from UserStream`);
                    console.error(result);
                }
            }).catch((err)=>{
                console.error(err);
            });
        }else{
            //接着搜索
            if(data && data[0] && data[0].pos){
                console.log('begin : ',data[0].pos);
                console.log('canvert to:',sqlDateToJsDate(data[0].pos));
                begindate = new Date(sqlDateToJsDate(data[0].pos));
                //begindate = data[0].pos;
                begindate.setMinutes(0);
                begindate.setSeconds(0);
                begindate.setMilliseconds(0);
                console.log('PART');
                doit(begindate,enddate);                
            }
        }
        /**
         * 从起始时间一直搜索到结束时间，以小时为片断进行处理
         */
        function doit(begindate,enddate){
            //b-->e
            let total = 0;
            let doone = 0;
            let doerr = 0;
            console.info('doit : ',begindate,enddate);
            function done(b){ //正确做完全部任务b=true,中间有错误b=false
                if(b){
                    //成功完成全部任务,更新时间起点
                    console.log('update StaStreamProgress');
                    sql(`select * from StaStreamProgress`).then((result)=>{
                        if(result && result.recordset && result.recordset.length===1){
                            console.log(`update StaStreamProgress set pos='${sqlDateString(enddate)}' where id=${result.recordset[0].id}`);
                            sql(`update StaStreamProgress set pos='${sqlDateString(enddate)}' where id=${result.recordset[0].id}`).then(()=>{
                                console.log('update to : ',enddate.toLocaleString());
                                console.log('doStaAU update SUCCESS');
                            }).catch((err)=>{
                                console.error(err);
                            });
                        }else{
                            console.log(`insert into StaStreamProgress (pos) values ('${sqlDateString(enddate)}')`);
                            sql(`insert into StaStreamProgress (pos) values ('${sqlDateString(enddate)}')`).then(()=>{
                                console.log('first update to : ',enddate.toLocaleString());
                                console.log('doStaAU first update SUCCESS');
                            }).catch((err)=>{
                                console.error(err);
                            });                            
                        }
                    }).catch((err)=>{
                        console.error(err);
                    });
                }else{
                    //任务失败,删除本次操作的数据
                    console.log('doStaAU FAILED!');
                    let qstr = `delete from StaAU where date<'${sqlDateString(enddate)}' and date>'${sqlDateString(begindate)}'`;
                    console.log(qstr);
                    sql(qstr).then(()=>{
                        console.log('delete success');
                    }).catch((err)=>{
                        console.log(err);
                    });
                }
            }
            function doseg(date,seg){ //处理小时片断流,seg是一个数组
                console.log(date);
                let login = 0;
                let submit = 0;
                let click = 0;
                let slogin = 0;
                let ssubmit = 0;
                let slt = {};
                let sst = {};
                for(let i of seg){
                    if(i.uid===-1 && i.cls===-1){
                        click++;
                    }
                    if(i.action.match(/login (.*)/)){
                        login++;
                        if(!slt[i.uid]){
                            slogin++;
                            slt[i.uid] = true;
                        }
                    }
                    if(i.action.match(/L(\d*)-(\d*)/)){
                        submit++;
                        if(!sst[i.uid]){
                            ssubmit++;
                            sst[i.uid] = true;
                        }
                    }
                }
                slt = null;
                sst = null;
                console.info(login,submit,click);
                sql(`insert into StaAU (date,login,submit,click,type,slogin,ssubmit) values ('${date}',${login},${submit},${click},0,${slogin},${ssubmit})`).then((result)=>{
                }).catch((err)=>{
                    console.error(err);
                });
            }
            console.log(sqlDateString(begindate),"===>",sqlDateString(enddate));
            for(let c = begindate;c<enddate;c.setHours(c.getHours()+1)){
                total++;
                /**
                 * 数据可能很多，使用分钟进行分割
                 */
                let qstr = `select * from UserStream where datediff(hh,date,'${sqlDateString(c)}')=0`;
                console.log(qstr);
                let dateStr = sqlDateString(c);
                sql(qstr).then((seg)=>{
                    doone++;
                    doseg(dateStr,seg.recordset);
                    if(doone===total)done(doerr===0);
                }).catch((err)=>{
                    doone++;
                    doerr++;
                    if(doone===total)done(doerr===0);
                    console.error(qstr);
                    console.error(err);
                });
            }
        }
    }).catch((err)=>{
        console.error(err);
    });
}

/**
 * 留存
 * date是一个日期字符串 2017-12-29
 */
function staExDay3(date,done){
    //calc first
    let days = [];
    let rate = [];
    let task3 = [];
    let d = new Date(date);
    console.log('date : ',date);
    for(let i=0;i<3;i++){
        d.setDate(d.getDate()-1);
        days[i] = sqlDateString(d).slice(0,11)+'00:00:00';
        console.log('date',i,':',days[i]);
    }

    for(let i=0;i<3;i++){
        task3.push((callback)=>{
            let qs = `select uid from UserInfo where datediff(dd,createdate,'${days[i]}')=0`;
            console.log(qs);
            sql(qs).then((result)=>{
                if(result.recordset.length>0){
                    console.log(result.recordset.length,qs);
                    let task = [];
                    let total = result.recordset.length;
                    let c = 0;
                    for(let user of result.recordset){
                        task.push((cb)=>{
                            sql(`select top 1 * from UserStream where uid=${user.uid} and datediff(dd,date,'${date}')=0`).then((R)=>{
                                if(R.recordset && R.recordset.length > 0){
                                    c++;
                                }
                                cb(false);
                            }).catch((err)=>{
                                console.error(err);
                                cb(true);
                            });
                        });
                    }
                    async.series(task,(err,results)=>{
                        if(!err){
                            rate[i] = c/total;
                            callback(false);                            
                        }else{
                            callback(true);
                        }
                    });
                }else{
                    callback(false);
                }
            }).catch((err)=>{
                console.error(err);
                callback(true);
            });
        });
    }
    async.series(task3,(err,results)=>{
        if(!err){
            //将数据更新到StaEx中去
            sql(`insert into StaEx (firstday,secondday,thirdday,date) values (${rate[0]?rate[0]:0},${rate[1]?rate[1]:0},${rate[2]?rate[2]:0},'${date}')`);
            console.log('date');
            console.log(rate[0]);
            console.log(rate[1]);
            console.log(rate[2]);
            if(done)done(false,date);
        }else{
            console.error('failed');
            if(done)done(true,date);
        }
    }); 
}
function doStaEx(){
    //'2017-12-13'
/*
    let task = [];
    for(let i=1;i<=1;i++){
        task.push((cb)=>{
            staExDay3(`2018-1-${i}`,cb);
        });
    }
    async.series(task,(err,results)=>{
        if(!err){
            console.log('DONE!');
        }else{
            console.log('FAILED!');
        }
    });
*/
    staExDay3(sqlDateString(new Date()).split(' ')[0]);
}
//doStaEx();
/**
 * 启动一个周期进程用来从分析数据
 * 一分钟比较轮询一次，到晚上23:58开始统计
 */
setInterval(function(){
    let t = new Date();
    if(t.getHours()===23){
        console.log(t);
        console.log(t.getHours());
        console.log(t.getMinutes());
        console.log(t.getDay());
        console.log(lastDay);    
    }
    //每天执行一次
    if(t.getHours()===23 && t.getMinutes()===58 && t.getDay() !== lastDay){
        doStaLv();
        doStaLvt();
        doStaEx();
        lastDay = t.getDay();
    }
    //每小时执行一次
    if(t.getMinutes()===1 && t.getHours() !== lastHours){
        doStaAU();
        lastHours = t.getHours();
    }
},50*1000);
