var config = require('../config');
const Sql = require('mssql');

var lastDay = -1;
var lastMin = -1;

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
                    begindate = new Date(result.recordset[0]['']);
                    begindate.setMinutes(0);
                    begindate.setSeconds(0);
                    begindate.setMilliseconds(0);
                    console.info('ALL');
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
                begindate = new Date(data[0].pos);
                begindate.setMinutes(0);
                begindate.setSeconds(0);
                begindate.setMilliseconds(0);
                console.info('PART');
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
                    sql(`select * from StaStreamProgress`).then((result)=>{
                        if(result && result.recordset && result.recordset.length===1){
                            sql(`update StaStreamProgress set pos='${enddate.toLocaleString()}' where id=${result.recordset[0].id}`).then(()=>{
                                console.info('update to : ',enddate.toLocaleString());
                                console.info('doStaAU update SUCCESS');
                            }).catch((err)=>{
                                console.error(err);
                            });
                        }else{
                            sql(`insert into StaStreamProgress (pos) values ('${enddate.toLocaleString()}')`).then(()=>{
                                console.info('first update to : ',enddate.toLocaleString());
                                console.info('doStaAU first update SUCCESS');
                            }).catch((err)=>{
                                console.error(err);
                            });                            
                        }
                    }).catch((err)=>{
                        console.error(err);
                    });
                }else{
                    //任务失败,删除本次操作的数据
                }
            }
            function doseg(date,seg){ //处理小时片断流,seg是一个数组
                console.info(date);
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
            for(let c = begindate;c<=enddate;c.setHours(c.getHours()+1)){
                total++;

                let qstr = `select * from UserStream where datediff(hh,date,'${c.toLocaleString()}')=0`;
                let dateStr = c.toLocaleString();
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
        lastDay = t.getDay();
    }
    //每小时执行一次
    if(t.getMinutes()===1 && t.getMinutes() !== lastMin){
        doStaAU();
        lastMin = t.getMinutes();
    }
},50*1000);