var sql = require('mssql');
var express = require('express');
var multiparty = require('multiparty');
var crypto = require('crypto');

var router = express.Router();

/**
 * 登录，返回关卡进行状况
 */
router.post('/login',function(req,res){
});

/**
 * 提交成绩，返回排名情况
 */
router.post('/commit',function(req,res){
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
