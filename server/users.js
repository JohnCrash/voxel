var Sql = require('mssql');
var express = require('express');
var multiparty = require('multiparty');
var crypto = require('crypto');
var config = require('./config');
var router = express.Router();
var fetch = require('node-fetch');

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

function sqlAction(uid,action){
  sql(`insert into UserStream (uid,action,date) values (${uid},N'${action}',getdate())`).then(
      ()=>{}
  ).catch((e)=>{
    console.log(e);
  });
}

function setCookie(res,cookie){
  let key,value;
  cookie.replace(/(.*)=(.*)/,($0,k,v)=>{
    key = k;
    value = v;
    return $0;
  });
  if(key && value)
    res.cookie(key,value);
}
/**
 * cookie => UserInfo
 */
router.use(function(req,res,next){
  let cookie;

  if(req.body.cookie){
    cookie = req.body.cookie;
    setCookie(res,cookie);
  }else{
    cookie = "sc1="+req.cookies.sc1;
  }
  if(cookie){
    sql(`select * from UserInfo where cookie='${cookie}'`).then((result)=>{
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

/**
 * 从'http://api.lejiaolexue.com/rest/userinfo/simple/current'拉取用户信息
 * 取得班级信息
 * http://api.lejiaolexue.com/rest/userzone/zone.ashx?uid=145832&zone=class
 * 成功调用cb(uinfo);失败cb(false,err);
 */
function pullUserInfo(req,cb){
  let {uid,uname,cookie} = req.body;
  try{
    fetch(`http://api.lejiaolexue.com/rest/userzone/zone.ashx?uid=${uid}&zone=class`,{
      method:'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie':cookie,
      }
    }).then(function(responese){
      return responese.json();
    }).then(function(json){
      if(json.result==0){
        if(json.zone&&json.zone[0])
          cb(json.zone[0]);
        else{
          //设置cls = 0 表示没有任何班级，不进行排行
          cb(false,"请绑定一个班级在进入游戏.");
        }
      }else{
        cb(false,json.msg);
      }
    }).catch(function(e){
      cb(false,e.toString());
    });
  }catch(e){
    cb(false,e.toString());
  }
}

/**
 * 回复login
 * 将玩家所在班级的全部信息打包发给玩家
 * uid | uname | lv | lastcommit
 */
function responeseLogin(req,res){
  let {UserName,uid,cookie,lv,olv,config,cls} = req.UserInfo;
  sql(`select uid,UserName,lv,lastcommit from UserInfo where cls=${cls}`).then((result)=>{
    sql(`update UserInfo set lastlogin=getdate() where uid=${uid}`);
    let clss = result.recordset;
    for(let c of clss){
      c.UserName = stripTailSpace(c.UserName);
    }
    //记录动作
    sqlAction(uid,'login');
    res.json({
      result:'ok',
      lv,
      olv,
      config,
      user:stripTailSpace(UserName),
      uid,
      cookie,
      clsid:cls,
      cls:clss
    });
  }).catch((err)=>{
    res.json({result:err});
  });
}
/**
 * 系统登入一个新的用户
 * 登入一个用户需要6类信息
 * 用户ID uid，用户名uname，用户cookie
 */
function login(req,res){
  let {uid,uname,cookie} = req.body;
  if(!cookie || !uid || !uname){
    //res.json({result:'请从乐教乐学大厅进入'});
    //return;
    //暂时允许cookie登录
    if(req.UserInfo && req.UserInfo.cookie){
      responeseLogin(req,res);
    }else{
      //没有通过cookie验证，也没有输入参数
      res.json({result:'请从乐教乐学大厅进入'});
    }
    return;
  }
  if(req.UserInfo && 'uid' in req.UserInfo){
    //从cookie登录
    let dbCookie = req.UserInfo.cookie;
    if(cookie!==dbCookie){
      sql(`update UserInfo set cookie='${cookie}' where uid=${uid}`);
    }
    responeseLogin(req,res);
  }else{
    if(uid){
      //正常使用uid登录
      sql(`select * from UserInfo where uid=${uid}`).then((result)=>{
        req.UserInfo = result.recordset[0];
        if(req.UserInfo && 'uid' in req.UserInfo){
          let dbCookie = req.UserInfo.cookie;
          if(cookie!==dbCookie){
            sql(`update UserInfo set cookie='${cookie}' where uid=${uid}`);
          }          
          responeseLogin(req,res);
        }else{
          //这里插入一个新的用户
          pullUserInfo(
            req,
            function(zone,errmsg){
              if(zone){
                let {zone_id,school_id,role} = zone;
                sql(`insert into UserInfo (uid,cookie,lv,UserName,lastlogin,cls,school,role) values (${uid},'${cookie}',0,N'${uname}',getdate(),${zone_id},${school_id},${role})`).then((result)=>{
                  responeseLogin(req,res);
                }).catch((err)=>{
                  res.send({result:err});
                });
              }else{
                res.send({result:errmsg});
              }
            });          
        }
      }).catch((err)=>{
        res.json({result:err});
      });      
    }else{
      res.json({result:'请从乐教乐学大厅进入(没有cookie参数)'});
    }
  }
}
/**
 * 登录，返回关卡进行状况
 */
router.post('/login',function(req,res){
  login(req,res);
});

function tops(req,res){
  let lname = req.body.lname;
  Promise.all([sql(`select blocks,count from Tops where lname='${lname}'`),
  sql(`select uname,blocks,try,uid from Level where lname='${lname}' and cls='${req.UserInfo.cls}'`)]).then(([data,cls])=>{
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
      sql(`update UserInfo set lv='${lv}',lastcommit=getdate() where uid='${req.UserInfo.uid}'`);
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
    //记录动作
    sqlAction(req.UserInfo.uid,`L${lv}-${blocks}`);
    //Tops是总排行，方法排行，取保留前5
    sql(`select count,blocks from Tops where lname='${lname}'`).then((result)=>{
      let data = result.recordset;
      let maxblocks = -1;
      let hasblock = false;
      let datacount = 0;
      for(let i = 0;i<data.length;i++){
        if(data[i].blocks > maxblocks)
          maxblocks = data[i].blocks;
        if(data[i].blocks == blocks){
          hasblock = true; //你提交的块数已经在排行榜中了
          datacount = data[i].count;
        }
      }
      if(data.length<5 && !hasblock){//插入新的
        return sql(`insert into Tops (lname,lv,blocks,count) values ('${lname}',${lv},${blocks},1)`);
      }else{
        if(hasblock){ //如果是相同的关卡就增加计数
          return sql(`update Tops set count=${datacount+1} where lname='${lname}' and blocks=${blocks}`);
        }else if(blocks<maxblocks){ //更新块
          return sql(`update Tops set count=1,blocks=${blocks} where lname='${lname}' and blocks=${maxblocks}`);
        }//5名以外，忽略不上传
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
 * 解锁关卡
 */
router.post('/unlock',function(req,res){
  //记录动作
  sqlAction(req.UserInfo.uid,`unlock(${req.body.olv})`);
  sql(`update UserInfo set olv=${req.body.olv} where uid='${req.UserInfo.uid}'`).
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
    res.clearCookie('sc1');
    res.json({result:'ok'});
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
