var Sql = require('mssql');
var express = require('express');
var multiparty = require('multiparty');
var crypto = require('crypto');

var router = express.Router();

const config = {
  user:'abc',
  password:'123456',
  server:'192.168.2.83',
  database:'voxel',
};

function stripTailSpace(s){
  if(s){
    let result = s;
    s.replace(/([^\S]*)\S*/,function($1){
      result = $1;
      return $1;
    });
    return result;
  }
  return s;
}

function sql(query){
  return new Sql.ConnectionPool(config).connect().then(pool=>{
    return pool.request().query(query);
  });
}

/**
 * cookies => UserInfo
 */
router.use(function(req,res,next){
  let cc = req.cookies.cc;
  console.log('cookies cechker ' + cc);
  if(cc){
    sql(`select * from UserInfo where cookie='${cc}'`).then((result)=>{
      req.UserInfo = result.recordset[0];
      if(req.UserInfo){
        next();
      }else{
        throw '没有找到用户';
      }
    }).catch((err)=>{
      res.json({result:err});
    });
  }else{
    if(req.url!=='/login')
      res.json({result:'请登录再进行游戏'});
    else next();
  }
});

function login(req,res,user,passwd){
  if(!(user && passwd)){
    res.json({result:'请输入用户名密码'});
    return;
  } 
  sql(`select * from UserInfo where UserAcount='${user}'`).then((result)=>{
    if( result.recordset[0] && 'UserPwd' in result.recordset[0]){
      let pwd = stripTailSpace(result.recordset[0].UserPwd);
      if(pwd===passwd){
        let cookie = result.recordset[0].cookie;
        let userName = result.recordset[0].UserName;
        let lv = result.recordset[0].lv;
        if(!cookie){//产生一个新的cookie
          var md5sum = crypto.createHash('md5');
          md5sum.update(user+passwd);
          cookie = md5sum.digest('hex');
          sql(`update UserInfo set cookie='${cookie}' where UserAcount='${user}'`);
        }
        sql(`update UserInfo set lastlogin=getdate() where UserAcount='${result.recordset[0].UserAcount}'`);
        res.cookie('cc',cookie);
        res.json({
          result:'ok',
          lv,
          user:stripTailSpace(userName)
        });
      }else throw'密码不正确';
    }else throw '用户名不存在';
  }).catch((err)=>{
    res.send({result:err});
  });
}
/**
 * 登录，返回关卡进行状况
 */
router.post('/login',function(req,res){
  if(req.UserInfo){ //通过cookie登录
    sql(`update UserInfo set lastlogin=getdate() where UserAcount='${req.UserInfo.UserAcount}'`);
    let cookie = req.UserInfo.cookie;
    let userName = req.UserInfo.UserName;
    let lv = req.UserInfo.lv;
    res.json({
      lv,
      result:'ok',
      user:stripTailSpace(userName)
    });
  }else
    login(req,res,req.body.user,req.body.passwd);
});

function tops(req,res){
  let lname = req.body.lname;
  Promise.all([sql(`select blocks,count from Tops where lname='${lname}'`),
  sql(`select uname,blocks,try from Level where lname='${lname}' and cls='${req.UserInfo.cls}'`)]).then(([data,cls])=>{
    res.json({result:'ok',
    tops:data.recordset,
    cls:cls.recordset});
  }).catch((err)=>{
    res.json({result:err});
  });
}
/**
 * 提交成绩，返回排名情况
 */
router.post('/commit',function(req,res){
  let lv = req.body.lv;
  let method = req.body.method;
  let blocks = req.body.blocks;
  let lname = req.body.lname;
    
  if(method && (req.UserInfo.lv+1)>=lv){
    //更新用户做到第几关了
    if(req.UserInfo.lv+1==lv)
      sql(`update UserInfo set lv='${lv}' where uid='${req.UserInfo.uid}'`);
    //提交成绩
    var md5sum = crypto.createHash('md5');
    md5sum.update(method);
    var md5 = md5sum.digest('hex');
    //更新方法
    sql(`select count from Method where md5='${md5}'`).then((result)=>{
      if(result.recordset[0]){
        let count = result.recordset[0].count+1;
        sql(`update Method set count=${count} where md5='${md5}'`);
      }else{
        sql(`insert into Method (lv,lname,blocks,count,method,md5) values (${lv},'${lname}',${blocks},1,N'${method}','${md5}')`);
      }
    });
    //更新个人成绩
    sql(`select try,blocks,tms,avgms from Level where uid='${req.UserInfo.uid}' and lname='${lname}'`).then((result)=>{
      let data = result.recordset[0];
      let avgms = req.body.each;
      let tms = req.body.total;
      if(data){
        if(data.blocks>blocks){
          avgms += data.avgms;
          avgms /= 2;
          tms += data.tms;
          sql(`update Level set blocks=${blocks},md5='${md5}',try=${data.try+1},tms=${tms},avgms=${avgms} where uid='${req.UserInfo.uid}' and lname='${lname}'`);
        }
      }else{
        sql(`insert into Level (lv,lname,blocks,try,md5,uid,cls,uname,tms,avgms) values (${lv},'${lname}',${blocks},1,'${md5}',${req.UserInfo.uid},${req.UserInfo.cls},'${req.UserInfo.UserName}',${tms},${avgms})`);
      }
    });
    //更新排行榜
    sql(`select count,blocks from Tops where lname='${lname}'`).then((result)=>{
      let data = result.recordset;
      let maxblocks = -1;
      let hasblock = false;
      let datacount = 0;
      for(let i = 0;i<data.length;i++){
        if(data[i].blocks > maxblocks)
          maxblocks = data[i].blocks;
        if(data[i].blocks == blocks){
          hasblock = true;
          datacount = data[i].count;
        }
      }
      if(data.length<5 && !hasblock){//插入新的
        return sql(`insert into Tops (lname,lv,blocks,count) values ('${lname}',${lv},${blocks},1)`);
      }else{
        if(hasblock){ //增加计数
          return sql(`update Tops set count=${datacount+1} where lname='${lname}' and blocks=${blocks}`);
        }else if(blocks<maxblocks){ //更新块
          return sql(`update Tops set count=1,blocks=${blocks} where lname='${lname}' and blocks=${maxblocks}`);
        }//未上榜
      }
    }).then((result)=>{
      tops(req,res);
    }).catch((err)=>{
      res.json({result:err});
    });
  }else{
    res.json({result:'没有按顺序完成关卡'});
  }
});

/**
 * 单独返回排名情况
 */
router.post('/tops',function(req,res){
  tops(req,res);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
