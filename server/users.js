const Sql = require('mssql');
const express = require('express');
const multiparty = require('multiparty');
const crypto = require('crypto');
const config = require('./config');
const router = express.Router();
const fetch = require('node-fetch');
const ljlx = require('lxnodemodules').LXGrid;
const Ice = require('ice').Ice;
const {
  LXSliceInvokerAsset,
  LXSliceInvokerLottery,
  LXSliceInvokerUser,
  LXSliceInvokerPush,
  LXReturnHelper
} = ljlx;
const { Asset } = ljlx.Main;

/**
 * 付金币
 * @param {*} num 要付的金币数量 > 0 付，< 0 加金币
 * s 是支付说明
 *             class LXEnumAssetDbCode
      {
                int LXEnumAssetChangeCode_Success = 0;              // 成功
        int LXEnumAssetChangeCode_MoneyNotEnough = 1;      // 余额不足,操作失败 
                int LXEnumAssetChangeCode_DbError = 99;              // Db 操作失败      
                int LXEnumAssetChangeCode_Unknow = 31;            // 未知错误         
      };

            // 资产变更状态码
      enum LXEnumAssetChangeCode
      {
                LXEnumAssetChangeCode_Success = 0,                  // 成功
        LXEnumAssetChangeCode_MoneyNotEnough = 1046001,      // 余额不足,操作失败 
                LXEnumAssetChangeCode_DbError = 1046002,          // Db 操作失败      
                LXEnumAssetChangeCode_Unknow = 10460100            // 未知错误          
      };

            // 业务 资产变更状态码
      enum LXEnumBusinessAssetChangeCode
      {
          LXEnumBusinessAssetChangeCode_NotFound = 1046101,        // 未找到配置项
                LXEnumBusinessAssetChangeCode_ItemAmountUpper = 1046102,  // 单项数额超限
                LXEnumBusinessAssetChangeCode_ItemTimesUpper = 1046103,      // 单项次数超限
                LXEnumBusinessAssetChangeCode_TotalAmountUpper = 1046199  // 总额超限
      };
 */
function payGold(uid,num,cb,s){
  let invoker;
  try{
    invoker = new LXSliceInvokerAsset(config.ljlxconfig);
  }catch(e){
    cb(false,'支付金币系统异常.');
    return ;
  }
  if(invoker){
    try{
      var paras = new Asset.LXAssetParameters();
      paras.app_id = 1126;
      paras.sub_id = 0;
      paras.currecy = Asset.LXEnumCurrecy.LXCurrecy_JINB;
      invoker.AssetChange(paras,
        uid,new Ice.Long(0,Math.abs(num)),
        num>0?Asset.LXEnumAssetChangeState.LXEnumAssetChangeState_Outcome:
          Asset.LXEnumAssetChangeState.LXEnumAssetChangeState_Income,s,'').then((r)=>{
        if (LXReturnHelper.IsLXSucceed(r)) {
          cb(true);
        }else{
          if (r.error == Asset.LXEnumAssetChangeCode.LXEnumAssetChangeCode_MoneyNotEnough._value) {
            // 余额不足
            cb(false,'余额不足');
          }else if(r.error == Asset.LXEnumAssetChangeCode.LXEnumAssetChangeCode_DbError._value){
            cb(false,'支付系统: Db 操作失败');
          }else{
            cb(false,`支付系统: 未知错误 (${r.error})`);
          }          
        }
      },(err)=>{
        cb(false,err.message);
      });
    }catch(e){
      cb(false,e.toString());
    }
  }else{
    cb(false,'支付金币系统暂时不可用.');
  }
}

function UserNotify(uid,msg,cb){
  // 1. 用户推送
  let invoker = new LXSliceInvokerPush(config.ljlxconfig);
  let users = new Array();
  users.push(uid);
  invoker.PushUserMessage(
      1126,	// 应用ID
      users,	// 用户ids
      msg,	// 消息
      '')		// 不用填
      .then((r) => {
          if (LXReturnHelper.IsLXSucceed(r)) {
              cb(true);
              console.log('succeed');
          }
      },
      (e) => {
          cb(false,e);
          console.log('exception:', e);
      });
}

function AreaNotify(id,msg,cb){
  // 2. 地区推送
  // appid, areaid, roles, grades, message, context, member
  let invoker = new LXSliceInvokerPush(config.ljlxconfig);
  let roles = new Array();
  roles.push(1,2,3); // 学生、老师、家长

  let grades = new Array();
  grades.push(1,2,3,4,5,6,7,8,9,10,11,12); // 1-6年级

  invoker.PushAreaMessage(
      1126,		// 应用ID
      id,		// 香港地区 0:全国推送
      roles,      // 身份
      grades,     // 年级
      msg,	// 消息
      '',         // 不用填
      1126)		// APP1133的会员用户
      .then((r) => {
          if (LXReturnHelper.IsLXSucceed(r)) {
              cb(true);
              console.log('succeed');
          }
      },
      (e) => {
          cb(false,e);
          console.log('exception:', e);
      });    
}

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

function resError(res,err){
  if(err && err.message)
    res.json({result:err.message});
  else if(err)
    res.json({result:err});
  else
    res.json({result:'服务器：数据查询错误'});
  console.error(err);
}

function sqlAction(uid,cls,action){
  sql(`insert into UserStream (uid,action,date,cls) values (${uid},N'${action}',getdate(),${cls})`).then(
      ()=>{}
  ).catch((e)=>{
    console.error(e);
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
 * 提取统计数据
 */
router.post('/stalv',function(req,res){
  /**
   * 最近一个星期(7天)的数据
   */
  sql(`select * from StaLv where DateDiff(DD,date,getdate())<=7`).then((result)=>{
    Promise.all([sql(`select COUNT(*) as hasLV from UserInfo where lv>0`),
      sql(`select COUNT(*) as allUser from UserInfo`)]).then(([R,M])=>{
        if(R && M)
          res.json({result:'ok',total:M.recordset,haslv:R.recordset,stalv:result.recordset});
        else
          res.json({result:'ok',stalv:result.recordset});
    }).catch((err)=>{
      res.json({result:err});
    });
  }).catch((err)=>{
      res.json({result:err});
  });
});

router.post('/stalvt',function(req,res){
  /**
   * 最近一个星期(7天)的数据
   */
  sql(`select * from StaLvt where DateDiff(DD,date,getdate())<=7`).then((result)=>{
      res.json({result:'ok',stalv:result.recordset});
  }).catch((err)=>{
      res.json({result:err});
  });
});

router.post('/stalau',function(req,res){
  /**
   * 最近一个星期(dd天)的数据
   */
  let dd = Math.min(req.body.dd || 1,30);
  sql(`select * from StaAU where DateDiff(DD,date,getdate())<=${dd} order by date`).then((result)=>{
      res.json({result:'ok',stalv:result.recordset});
  }).catch((err)=>{
      res.json({result:err});
  });
});

router.post('/staex',function(req,res){
  /**
   * 最近一个星期(dd天)的数据
   */
  let dd = Math.min(req.body.dd || 1,30);
  sql(`select * from StaEx where DateDiff(DD,date,getdate())<=${dd} order by date`).then((result)=>{
      res.json({result:'ok',stalv:result.recordset});
  }).catch((err)=>{
      res.json({result:err});
  });
});

/**
 * 启动程序，在login之前
 */
router.get('/entry',function(req,res){
  let randstr = req.query['q'];
  if(randstr){
    sqlAction(-1,-1,randstr);
  }
  res.send('ok');
});

/**
 * 通知同班同学自己做出了超越
 * t 是下面的一个值
 * 1.进度超越同班同学   p = 我的关卡
 * 2.我解锁，通知没有解锁的 p = 解锁关卡 例如20
 * 3.皇冠数量超越同班同学  p = 我的皇冠数量
 * name 是超越者的名称
 * uids 是超越的uid数组
 */
function notifyClass(t,name,uid,cls,p){
  if(cls && cls!==0 && cls!=='0'){
    let sqlStr;
    name = name.trimRight();
    switch(t){
      case 1:sqlStr = `select uid,notice from UserInfo where lv=${p-1} and cls=${cls} and uid<>${uid}`;break;
      case 2:sqlStr = `select uid,notice from UserInfo where olv<${p+10} and cls=${cls} and uid<>${uid}`;break;
      case 3:sqlStr = `select uid,notice from UserInfo where crown=${p-1} and cls=${cls} and uid<>${uid}`;break;
      default:return;
    }
    sql(sqlStr).then((result)=>{
      let users = result.recordset;
      let msg;
      switch(t){
        case 1:msg = `**${name}**超越了你的关卡进度`;break;
        case 2:msg = `**${name}**解锁了${p+1}-${p+10}的全部关卡`;break;
        case 3:msg = `**${name}**超越了你的皇冠排名`;break;
      }
      if(msg){
        for(let user of users){
          UserNotify(user.uid,'【乐学编程】 '+msg,(b,err)=>{});
          /**
           * {
           *  msg:[];
           * }
           */
          if(user.notice){
            try{
              let s = JSON.parse(user.notice);
              if(s && s.msg){//保留5条
                s.msg.push(msg);
                if(s.msg.length>5){
                  s.msg.splice(0,s.msg.length-5);
                }
              }
              user.notice = JSON.stringify(s);  
            }catch(e){
              user.notice = `{"msg":["${msg}"]}`;
            }
          }else{
            user.notice = `{"msg":["${msg}"]}`;
          }
          //更新同学的通知数据，当同学下回登录将看到这些通知，同时这些通知会被清空
          sql(`update UserInfo set notice=N'${user.notice}' where uid=${user.uid}`).then((result)=>{
          }).catch((err)=>{
            console.error(err);
          });
        }
      }
    }).catch((err)=>{
      console.error(err);
    });
  }
}

/**
 * User gps position
 */
router.post('/postpos',function(req,res){
  let {uid,latitude,longitude,timestamp} = req.body;
  if(uid){
    let q = `insert into UserPos (uid,latitude,longitude,date) values (${uid},${latitude},${longitude},getdate())`;
    sql(q).then(()=>{
    }).catch((err)=>{
      console.error(err);
    });
  }
  res.json({result:'ok'});
});

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
  let uid = req.body.uid;
  if(uid){ //uid 是一个整数查询更快捷
    sql(`select * from UserInfo where uid='${uid}'`).then((result)=>{
      req.UserInfo = result.recordset[0];
      if(req.UserInfo){
        next();
      }else{
        /**
         * FIXBUG : 如果二次登录cookie会发生改变，被踢掉的用户将不能继续提交
         */
        if(req.url!=='/login')
          throw '你的帐号在其他设备上登录，请重新登录游戏。';
        next();
      }
    }).catch((err)=>{
      resError(res,err);
    });
  }else if(cookie){
    sql(`select * from UserInfo where cookie='${cookie}'`).then((result)=>{
      req.UserInfo = result.recordset[0];
      if(req.UserInfo){
        next();
      }else{
        /**
         * FIXBUG : 如果二次登录cookie会发生改变，被踢掉的用户将不能继续提交
         */
        if(req.url!=='/login')
          throw '你的帐号在其他设备上登录，请重新登录游戏。';
        next();
      }
    }).catch((err)=>{
      resError(res,err);
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
          cb({zone_id:0,school_id:0,role:0});
          //cb(false,"请绑定一个班级在进入游戏.");
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
 * 初始化Crown表格
 */
function initCrown(){
  //没有初始化Crown
  sql(`select count(*) from Crown`).then((result)=>{
    if(!(data && data[0])){
      let a = [];
      for(let i=0;i<201;i++)a.push(i);
      let s = `insert into Crown (count) values (${a.join('),(')})`;
      sql(s).then(()=>{
      }).catch((err)=>{
      });    
    }
  }).catch((err)=>{
  });
}
/**
 * 重新计算皇冠数量crown
 * crown 是新的皇冠数，老的皇冠数量放在req.UserInfo.crown中
 */
function reCrown(req,crown){
  let oldcrown = req.UserInfo.crown;

  if(oldcrown===crown)return;

  if(crown > 200 || crown < 0)return; //Crown数不可能超过该200

  //重新统计所有皇冠数量为crown的人数
  sql(`select count(*) from UserInfo where crown=${crown}`).then((result)=>{
    let data = result.recordset;
    if(data && data[0]){
      sql(`update Crown set people=${data[0]['']} where count=${crown}`);
    }
  }).catch((err)=>{
    console.log(err);
  });
/*
  //下面算法有BUG
  sql(`select * from Crown where count=${oldcrown} or count=${crown}`).then((result)=>{
    let data = result.recordset;
    if(!data || (data&&data.length===0)){
      //没有初始化Crown
      let a = [];
      for(let i=0;i<201;i++)a.push(i);
      let s = `insert into Crown (count) values (${a.join('),(')})`;
      sql(s).then(()=>{
        reCrown(req,crown); //在执行一遍
      }).catch((err)=>{
        console.log(err);
      });
    }else if(data.length===2){
      //正常
      let oldPeople,People;
      if(data[0].count === crown){
        People = data[0].people;
        oldPeople = data[1].people;
      }else{
        People = data[1].people;
        oldPeople = data[0].people;        
      }
      //更新统计表，老的人数-1，新的人数+1
      Promise.all([sql(`update Crown set people=${oldPeople-1} where count=${oldcrown}`),
      sql(`update Crown set people=${People+1} where count=${crown}`)]).then(()=>{
          //操作用户数据crown，并且对Crown中的统计进行增减。
          sql(`update UserInfo set crown=${crown} where uid=${req.UserInfo.uid}`);
      }).catch((err)=>{
        console.error(err);  
      });
    }else{
      //Crown表不正常需要重新初始
      console.error(`Table Crown issue.`);
    }
  }).catch((err)=>{
    console.error(err);
  });
  */
}
/**
 * 回复login
 * 将玩家所在班级的全部信息打包发给玩家
 * uid | uname | lv | lastcommit
 */
function responeseLogin(req,res){
  let {UserName,uid,cookie,lv,olv,config,cls,trashlv,trash,readmsg,notice} = req.UserInfo;
  
  //一个简单复用函数
  function done(clss){
    for(let c of clss){
      c.UserName = c.UserName.trimRight();
    }
    /**
     * 这里处理用户每一关的排名情况
     * 首先取得用户关卡完成情况使用sql语句:select lv,blocks from Level where uid=${uid}
     * 然后取得关卡排行情况sql语句:select lv,blocks from Tops
     * 然后根据这两个表就可以计算出用户每一关的排行情况了
     */
    Promise.all([sql(`select lv,blocks from Level where uid=${uid}`),sql(`select lv,blocks from Tops`)]).then(
    ([levelss,topss])=>{
      let levels = levelss.recordset;
      let tops = topss.recordset;
      /**
       *levels 返回的是我的关卡完成情况
        [
          {lv,blocks}
          ...
        ]
       *tops 返回每关卡排行榜
        [
          {lv,blocks}
          ...
        ]
       将结果填充到lvs中
       [
         5, //第一个的排名
         ....
       ]    
       */
      let crown = 0;
      let lvs = [];
      if(levels && tops){
        //将tops做映射成二级数组,第一级是关卡，第二级数组是块数
        let lvtops = [];
        for(let it of tops){
          if(it.lv && it.lv===+it.lv){
            lvtops[it.lv] = lvtops[it.lv]?lvtops[it.lv]:[];
            lvtops[it.lv].push(it.blocks);
          }
        }
        //对二级表进行排序
        for(let it of lvtops){
          if(it)it.sort((a,b)=>a>b);
        }
        let rank = function(lv,blocks){ //关卡，块数返回排名,没有返回0
          let tt = lvtops[lv];
          if(tt){
            for(let i = 0;i<tt.length;i++){
              if(tt[i] >= blocks){
                return i+1;
              }
            }
          }
          return 0;
        }
        let best = function(lv){
          let tt = lvtops[lv];
          if(tt)return tt[0];
        }
        
        for(let it of levels){ //计算每一关的排名
          if(it.lv && it.lv===+it.lv){
            if(lvtops[it.lv]){
              lvs[it.lv] = {rank:rank(it.lv,it.blocks),
                lv:it.lv,
                blocks:it.blocks,
                best:best(it.lv)};
            }
            if(lvs[it.lv] && lvs[it.lv].rank === 1)crown++; //统计皇冠数量
          }
        }
      }
      let platform = req.body.platform;
      let entryrandom = req.body.entryrandom;
      reCrown(req,crown);
      /**
       * 将crown,lastlogin设置好，清除notice通知在看到后就删除
       */
      sql(`update UserInfo set crown=${crown},lastlogin=getdate(),notice=NULL where uid=${uid}`);
      //记录动作
      if(entryrandom)sqlAction(uid,cls,'e'+entryrandom); //将进入和登录结合起来，侦测点击到登录的人数差
      sqlAction(uid,cls,'login '+platform);
      //将关卡的视频配置和通知消息插入到这里
      Promise.all([sql('select * from LevelVideo'),sql('select * from Message order by id desc')]).then(([R,M])=>{
        let levelvideo;
        let message;
        if(R)levelvideo = R.recordset;
        if(M)message = M.recordset;
        res.json({
          result:'ok',
          lv,
          olv,
          config,
          user:UserName.trimRight(),
          uid,
          cookie,
          clsid:cls,
          cls:clss,
          lvs,
          crown,
          trashlv,
          trash,
          readmsg,
          message,
          levelvideo,
          notice
        });
      }).catch((err)=>{
        res.json({result:''});
      });
    }).catch((err)=>{
      res.json({result:err});
    });
  }
  if(cls==='0' || cls==0){//如果cls=0就不要查找了因为这表示所有没有班级的人
    done([]);
  }else{
    sql(`select uid,UserName,lv,lastcommit,crown from UserInfo where cls=${cls}`).then((result)=>{
      done(result.recordset);
    }).catch((err)=>{
      resError(res,err);
    });  
  }
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
                sql(`insert into UserInfo (uid,cookie,lv,UserName,lastlogin,cls,school,role,createdate) values (${uid},'${cookie}',0,N'${uname}',getdate(),${zone_id},${school_id},${role},getdate())`).then((result)=>{
                  //新产生的对象还没有数据
                  req.UserInfo = {
                    UserName:uname,
                    uid,
                    cookie,
                    lv:0,
                    olv:0,
                    cls:zone_id
                  };
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
        resError(res,err);
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
  let cls = req.UserInfo.cls;
  if(cls==='0' || cls===0){
    //不进行排名
    sql(`select blocks,count from Tops where lname='${lname}'`).then((data)=>{
      res.json({result:'ok',
        tops:data.recordset,
        cls:[]});
    }).catch((err)=>{
      resError(res,err);
    });
  }else{
    //正常排名
    Promise.all([sql(`select blocks,count from Tops where lname='${lname}'`),
    sql(`select uname,blocks,try,uid from Level where lname='${lname}' and cls='${req.UserInfo.cls}'`)]).then(([data,cls])=>{
      res.json({result:'ok',
      tops:data.recordset,
      cls:cls.recordset});
    }).catch((err)=>{
      resError(res,err);
    });
  }
}
/**
 * 提交成绩，返回排名情况
 */
const best={
  '1':[3,0],
  '2':[3,0],
  '3':[6,0],
  '4':[9,0],
  '5':[9,0],
  '6':[5,0],
  '7':[8,0],
  '8':[5,0],
  '9':[14,0],
  '10':[9,0],
  '11':[9,0],
  '12':[6,0],
  '13':[5,0],
  '14':[9,0],
  '15':[9,0],
  '16':[7,0],
  '17':[12,0],
  '18':[14,0],
  '19':[8,0],
  '20':[13,0],
  '21':[5,0],
  '22':[9,0],
  '23':[10,0],
  '24':[10,-2],
  '25':[14,-4],
  '26':[11,-2],
  '27':[21,-5],
  '28':[15,0],
  '29':[15,-2],
  '30':[23,-8],
  '31':[5,0],
  '32':[8,0],
  '33':[13,-3],
  '34':[13,-3],
  '35':[14,-5],
  '36':[15,-5],
  '37':[16,-6],
  '38':[11,-1],
  '39':[19,-5],
  '40':[21,-6],
  '41':[5,0],
  '42':[5,0],
  '43':[7,0],
  '44':[11,-3],
  '45':[13,-2],
  '46':[8,0],  
  '47':[11,-2],
  '48':[15,-5],
  '49':[22,-5],
  '50':[16,-5],
  '51':[7,0],
  '52':[7,0],
  '53':[9,0],
  '54':[8,0],
  '55':[9,0],
  '56':[8,0],
  '57':[12,-2],
  '58':[8,0],
  '59':[10,-2],
  '60':[17,-5]  
};
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
        if(data.blocks>blocks){ //块数降低了
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
    sqlAction(req.UserInfo.uid,req.UserInfo.cls,`L${lv}-${blocks}`);
    //Tops是总排行，方法排行，取保留前5
    sql(`select count,blocks from Tops where lname='${lname}'`).then((result)=>{
      let data = result.recordset;
      let maxblocks = -1;
      let hasblock = false;
      let datacount = 0;
      let rank = 1; //计算本次提交的排名
      for(let i = 0;i<data.length;i++){
        if(data[i].blocks > maxblocks)
          maxblocks = data[i].blocks;
        if(data[i].blocks == blocks){
          hasblock = true; //你提交的块数已经在排行榜中了
          datacount = data[i].count;
        }
        if(data[i].blocks<blocks)rank++;
      }
      if(rank===1){
        //新提交的成绩是第一名，需要更新,这样同班同学马上就能看到
        reCrown(req,req.UserInfo.crown+1);
        notifyClass(3,req.UserInfo.UserName,req.UserInfo.uid,req.UserInfo.cls,req.UserInfo.crown+1); //尝试查询被超越的同学
      }
      notifyClass(1,req.UserInfo.UserName,req.UserInfo.uid,req.UserInfo.cls,lv); //尝试查询被超越的同学
      if(best[lv] && best[lv][0]+best[lv][1]>blocks){
        //这里是卡BUG出来的结果，不操作Tops表
        return sql(`select * from Tops where lv=${lv}`);
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
      resError(res,err);
    });
  }else{
    res.json({result:'没有按顺序完成关卡'});
  }
});

/**
 * 已经玩过的关卡取得该关卡的自己的最佳玩法
 * lname 要取的关卡名称
 * 返回：一个json {method}
 */
router.post('/levelmethod',function(req,res){
  let {lname} = req.body;
  sql(`select md5 from Level where uid='${req.UserInfo.uid}' and lname='${lname}'`).then((result)=>{
    let data = result.recordset[0];
    let method = '';
    if(data && data.md5){
      sql(`select method from Method where md5='${data.md5}'`).then((result)=>{
        let m = result.recordset[0];
        if(m && m.method){
          method = m.method;
        }
        res.json({result:'ok',method});
      }).catch((err)=>{
        resError(res,err);});
    }else
      res.json({result:'ok',method});
  }).catch((err)=>{
    resError(res,err);
  });
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
    resError(res,err);
  });
});

const UnlockTable = [
  {lv:21,rang:10,gold:3000,crown:15},
  {lv:31,rang:10,gold:5000,crown:25},
  {lv:41,rang:10,gold:8000,crown:35},
  {lv:51,rang:10,gold:10000,crown:45},
  {lv:61,rang:10,gold:10000,crown:55},
];

function getUnlockTable(lv){
  for(let ut of UnlockTable){
    if(ut.lv===lv+1)return ut;
  }
}
/**
 * 解锁关卡
 */
router.post('/unlock',function(req,res){
  //记录动作
  let {lv,UserName,olv,uid,cls,crown} = req.UserInfo;
  let unlock;
  let {param} = req.body;

  olv = olv ? olv : 21;  
  unlock = olv;
  let unlocktable = getUnlockTable(lv);
  if(param==='crown'){ //皇冠解锁
    if(unlocktable && unlocktable.crown<=crown){
      olv = olv + unlocktable.rang;    
      sql(`update UserInfo set olv=${olv} where uid='${uid}'`).
      then((result)=>{
        sqlAction(uid,cls,`unlock1(${olv})`);
        notifyClass(2,UserName,uid,cls,olv); //通知同班同学，我解锁了
        res.json({result:'ok',olv,unlock});
      }).catch((err)=>{
        resError(res,err);
      });         
    }else{
      res.json({result:'你的皇冠数没有达到要求的条件.'});
    }
    return;
  }else if(param==='gold'){ //金币解锁
    if(unlocktable){
      olv = olv + unlocktable.rang;
      payGold(uid,unlocktable.gold,(b,msg)=>{
        if(b){
          sql(`update UserInfo set olv=${olv} where uid='${uid}'`).
          then((result)=>{
            sqlAction(uid,cls,`unlock2(${olv})`);
            notifyClass(2,UserName,uid,cls,olv); //通知同班同学，我解锁了
            res.json({result:'ok',olv,unlock});
          }).catch((err)=>{
            resError(res,err);
          });
        }else{
          res.json({result: msg});
        }
      },"乐学编程关卡解锁");
      return;
    }
  }

  res.json({result:'解锁失败.'});
});

/**
 * 保存临时操作草稿
 */
router.post('/trash',function(req,res){
  let {lv,method} = req.body;
  if(lv && method){
    sql(`update UserInfo set trashlv=${lv},trash=N'${method}' where uid=${req.UserInfo.uid}`).then((result)=>{
      res.json({result:'ok'});
    }).catch((err)=>{
      resError(res,err);
    });
  }else{
    res.json({result:"arguments invalid"});
  }
});

/**
 * 皇冠排行榜
 */
router.post('/crowns',function(req,res){
  let {uid,cls} = req.UserInfo;
  if(cls !== 0 && cls !== '0'){
    sql(`select * from Crown`).then((result)=>{
      /**
       * 将count = 0 的人数去掉
       */
      let crowns = result.recordset;
      if(crowns){
        for(let i = 0;i<crowns.length;i++){
          if(crowns[i].count == 0){
            crowns[i].people = 0;
            break;
          }
        }
      }
      res.json({result:'ok',crowns});
    }).catch((err)=>{
      resError(res,err);
    });
  }else{
    res.json({result:"ok"});
  }
});

/**
 * 登出
 */
router.post('/logout',function(req,res){
    res.clearCookie('cc');
    res.clearCookie('sc1');
    res.json({result:'ok'});
});
/**
 * 报告错误
 */
router.post('/levelplaytime',function(req,res){
  let {action,lv} = req.body;
  if(action)
    sqlAction(req.UserInfo.uid,req.UserInfo.cls,`${action} ${lv}`);
  res.json({result:'ok'});
});
/**
 * 报告错误
 */
router.post('/report',function(req,res){
  let {errmsg,platform} = req.body;
  if(errmsg==='NotSupportWebGL'){
    sqlAction(req.UserInfo.uid,req.UserInfo.cls,'NotGL '+platform);
  }
  res.json({result:'ok'});
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * 用户读了消息
 */
router.post('/readmsg',function(req,res){
  let {readed} = req.body;
  let {uid,readmsg} = req.UserInfo;
  if(typeof readed !== 'number'){
    res.json({result:'参数错误'});
    return;
  }
  if(readmsg){
    //看看已读的索引是不是已经在列表中了，如果是直接返回
    let readm = readmsg.split(',');
    if(readm.includes(String(readed))){
      res.json({result:'ok'});
      return;
    }
    readmsg += (","+readed);
  }else{
    readmsg = String(readed);
  }
  sql(`update UserInfo set readmsg='${readmsg}' where uid=${uid}`).then((result)=>{
    res.json({result:'ok'});
  }).catch((err)=>{
    resError(res,err);
  });
});
module.exports = router;
