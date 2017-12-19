var config = require('../config');
const Sql = require('mssql');

var lastDay = 0;

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

doStaLvt();
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
    if(t.getHours()===23 && t.getMinutes()===58 && t.getDay() !== lastDay){
        doStaLv();
        doStaLvt();
        lastDay = t.getDay();
    }
},50*1000);