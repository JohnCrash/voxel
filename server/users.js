var Sql = require('mssql');
var express = require('express');
var multiparty = require('multiparty');
var crypto = require('crypto');
var config = require('./config');
var router = express.Router();

function stripTailSpace(s){
  if(s){
    let result = s;
    s.replace(/\s*(\S*)\s*/,function($1,$2){
      result = $2;
      return $2;
    });
    return result;
  }
  return s;
}
 
function sql(query){
  return new Sql.ConnectionPool(config.sqlserver).connect().then(pool=>{
    return pool.request().query(query);
  });
}

/**
 * cookies => UserInfo
 */
router.use(function(req,res,next){
  let cc = req.cookies.cc;
  if(cc){
    sql(`select * from UserInfo where cookie='${cc}'`).then((result)=>{
      req.UserInfo = result.recordset[0];
      if(req.UserInfo){
        next();
      }else{
        if(req.url!=='/login')
          throw '没有找到用户';
        next();
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

function setCookie(res,cookie){
  res.cookie('cc',cookie);
}
/**
 * 系统登入一个新的用户
 * 登入一个用户需要6类信息
 * 用户ID uid，用户名uname，班级ID cls，学校ID school，身份ID typeid，用户cookie
 */
function login(req,res,uid,uname,cls,school,typeid,cookie){
  let {uid,uname,clsid,schoolid,typeid,cookie} = req.body;
  if(!cookie || !uid || !uname){
    res.json({result:'请从乐教乐学大厅进入'});
    return;
  } 
  sql(`select * from UserInfo where uid=${uid}`).then((result)=>{
    if( result.recordset[0] && 'UserName' in result.recordset[0]){
      let {UserName,lv,config} = result.recordset[0];
      sql(`update UserInfo set lastlogin=getdate() where uid=${uid}`);
      setCookie(res,cookie);
      res.json({
        result:'ok',
        lv,
        config,
        user:UserName
      });
    }else{
      //这里插入一个新的用户
      sql(`insert into UserInfo (cookie,lv,cls,UserName,school,typeid,lastlogin) values ('${cookie}',0,${cls},N'${uname}',${schoolid},${typeid}),getdate()`).then((result)=>{
        setCookie(res,cookie);
        res.json({
          result:'ok',
          lv:0,
          user      
        });
      }).catch((err)=>{
        res.send({result:err});
      });
    }
  }).catch((err)=>{
    res.send({result:err});
  });
}
/**
 * 登录，返回关卡进行状况
 */
router.post('/login',function(req,res){
  if(req.UserInfo){ //已经通过cookie成功登录
    sql(`update UserInfo set lastlogin=getdate() where uid=${req.UserInfo.uid}`);
    let {cookie,UserName,lv,config} = req.UserInfo;
    res.json({
      lv,
      result:'ok',
      config,
      user:stripTailSpace(UserName)
    });
  }else
    login(req,res);
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

/**
 * 保存配置
 */
router.post('/config',function(req,res){
  sql(`update UserInfo set config=N'${req.body.config}' where uid='${req.UserInfo.uid}'`).
  then((result)=>{
    res.json({result:'ok'});
  }).catch((err)=>{
    res.json({result:err});
  });
});

/**
 * 登出
 */
router.post('/logout',function(req,res){
    res.clearCookie('cc');
    res.json({result:'ok'});
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
