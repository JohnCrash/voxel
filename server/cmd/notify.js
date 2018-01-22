const config = require('../config');
var process = require('process');
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
    grades.push(1,2,3,4,5,6); // 1-6年级

    console.log(`AreaNotify ${id} ${msg}`);
    invoker.PushAreaMessage(
        1126,		// 应用ID
        id,		// 香港地区 0:全国推送
        roles,      // 身份
        grades,     // 年级
        msg,	// 消息
        '',         // 不用填
        0)		// APP1133的会员用户
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

function Help(){
    console.log(`
    notify用于向用户推送消息(小红点)
        向单个用户发送消息
        notify -u 122345 '乐学编程小明在第17关超过了你'
        向地区发送消息 0 表示全国
        notify -a 0 '乐学编程有一个新的版本'
    `);
}
//去掉字符前后的'或者"
function stripString(s){
    if((s[0]==="'" && s[s.length-1]==="'") || (s[0]==='"'&& s[s.length-1]==='"')){
        return s.slice(1,-1);
    }else return s;
}
switch(process.argv[2]){
    case '-u':
        if(typeof process.argv[3] === 'string' && typeof process.argv[4] === 'string'){
            let msg = stripString(process.argv[4]);
            UserNotify(Number(process.argv[3]),msg,(b,err)=>{
                if(b)console.log('发送成功!');
            });
        }else{
            console.log('语法错误!');
        }
        break;
    case '-a':
        if(typeof process.argv[3] === 'string' && typeof process.argv[4] === 'string'){
            let msg = stripString(process.argv[4]);
            AreaNotify(Number(process.argv[3]),msg,(b,err)=>{
                if(b)console.log('发送成功!');
            });
        }else{
            console.log('语法错误!');
        }
        break;
    case '-h':
    default:
        Help();
    break;
}
