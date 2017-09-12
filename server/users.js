var sql = require('mssql');
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
function sqlQuery(query,cb,ep){
  new sql.ConnectionPool(config).connect().then(pool=>{
    return pool.request().query(query);
  }).then(result=>{
    if(cb)cb(result);
  }).catch(err=>{
    if(ep)
      ep(err);
    else
      console.log(err);
  });
}

/**
 * 登录，返回关卡进行状况
 */
router.post('/login',function(req,res){
  let cc = req.cookies.cc;
  if(cc){ //通过cookie登录
    sqlQuery(`select * from UserInfo where cookie='${cc}'`,(result)=>{
      if(result.recordset[0] && result.recordset[0].UserName && result.recordset[0].UserAcount){
        sqlQuery(`update UserInfo set lastlogin=getdate() where UserAcount='${result.recordset[0].UserAcount}'`,()=>{},()=>{});
          let cookie = result.recordset[0].cookie;
          let userName = result.recordset[0].UserName;
          let lv = result.recordset[0].lv;        
          res.json({
            lv,
            result:'ok',
            user:stripTailSpace(userName)
          });
      }else{
        res.json({result:'请重新输入密码'});
      }
    },(err)=>{
      res.send(err);
    });
    return;
  }
  let user = req.body.user;
  let passwd = req.body.passwd;
  if(!(user && passwd)){
    res.json({result:'请输入用户名密码'});
    return;
  } 
  sqlQuery(`select * from UserInfo where UserAcount='${user}'`,(result)=>{
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
          sqlQuery(`update UserInfo set cookie='${cookie}' where UserAcount='${user}'`,(result)=>{},(err)=>{});
        }
        sqlQuery(`update UserInfo set lastlogin=getdate() where UserAcount='${result.recordset[0].UserAcount}'`,()=>{},()=>{});
        res.cookie('cc',cookie);
        res.json({
          lv,
          result:'ok',
          user:stripTailSpace(userName)
        });
      }else{
        res.json({result:'密码不正确'});
      }
    }else{
      res.json({result:'用户名不存在'});
    }
  },(err)=>{
    res.send(err);
  });  
});

/**
 * cookies => UserInfo
 */
router.use(function(req,res,next){
  let cc = req.cookies.cc;
  console.log('cookies cechker ' + cc);
  if(cc){
    sqlQuery(`select * from UserInfo where cookie='${cc}'`,(result)=>{
      req.UserInfo = result.recordset[0];
      if(req.UserInfo){
        next();
      }else{
        res.json({result:'没有找到用户'});
      }
    },(err)=>{
      res.json({result:err});
    });
  }else{
    res.json({result:'请登录再进行游戏'});
  }
});

function tops(req,res){
  let lname = req.body.lname;
  sqlQuery(`select blocks,count from Tops where lname='${lname}'`,(result)=>{
    let data = result.recordset;
    res.json({result:'ok',tops:data});
  },(err)=>{
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
      sqlQuery(`update UserInfo set lv='${lv}' where uid='${req.UserInfo.uid}'`,(result)=>{},(err)=>{res.json({result:err});});
    //提交成绩
    var md5sum = crypto.createHash('md5');
    md5sum.update(method);
    var md5 = md5sum.digest('hex');
    //更新方法
    sqlQuery(`select count from Method where md5='${md5}'`,(result)=>{
      if(result.recordset[0]){
        let count = result.recordset[0].count+1;
        sqlQuery(`update Method set lv=${lv},lname='${lname}',blocks=${blocks},count=${count},method=N'${method}' where md5='${md5}'`);
      }else{
        sqlQuery(`insert into Method (lv,lname,blocks,count,method,md5) values (${lv},'${lname}',${blocks},1,N'${method}','${md5}')`);
      }
    });
    //更新个人成绩
    sqlQuery(`select try,blocks from Level where uid='${req.UserInfo.uid}' and lname='${lname}'`,(result)=>{
      let data = result.recordset[0];
      if(data){
        if(data.blocks>blocks)
          sqlQuery(`update Level set lv=${lv},lname='${lname}',blocks=${blocks},try=${data.try+1},md5='${md5}',uid=${req.UserInfo.uid},cls=${req.UserInfo.cls} where uid='${req.UserInfo.uid}' and lname='${lname}'`);
      }else{
        sqlQuery(`insert into Level (lv,lname,blocks,try,md5,uid,cls) values (${lv},'${lname}',${blocks},1,'${md5}',${req.UserInfo.uid},${req.UserInfo.cls})`);
      }
    });
    //更新排行榜
    sqlQuery(`select count,blocks from Tops where lname='${lname}'`,(result)=>{
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
        sqlQuery(`insert into Tops (lname,lv,blocks,count) values ('${lname}',${lv},${blocks},1)`,(result)=>{tops(req,res);},(err)=>{res.json({result:err});});
      }else{
        if(hasblock){ //增加计数
          sqlQuery(`update Tops set count=${datacount+1} where lname='${lname}' and blocks=${blocks}`,(result)=>{tops(req,res);},(err)=>{res.json({result:err});});
        }else{ //更新块
          sqlQuery(`update Tops set count=1,blocks=${blocks} where lname='${lname}' and blocks=${maxblocks}`,(result)=>{tops(req,res);},(err)=>{res.json({result:err});});
        }
      }
    },(err)=>{
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
