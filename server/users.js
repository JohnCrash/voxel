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
    cb(result);
  }).catch(err=>{
    ep(err);
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
 * 提交成绩，返回排名情况
 */
router.post('/commit',function(req,res){
  let cc = req.cookies.cc;
  console.log('commit '+cc);
  if(cc){
    sqlQuery(`select * from UserInfo where cookie='${cc}'`,(result)=>{
      let d = result.recordset[0];
      if(d){
        let lv = req.body.lv;
        if((d.lv+1)>=lv){
          sqlQuery(`update UserInfo set lv='${lv}' where cookie='${cc}'`,(result)=>{
            res.json({result:'ok'});
          },(err)=>{res.json({result:err});});
        }else{
          res.json({result:''});
        }
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

/**
 * 单独返回排名情况
 */
router.post('/tops',function(req,res){
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
