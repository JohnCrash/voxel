/**
 * 监听git文件，自动拉取并重新启动服务器
 */
var config = require('./config');
var fs = require('fs');
var {spawn} = require('child_process');
var tid,tid2;

function timeoutDoGitPull(){
    if(tid)
        clearInterval(tid);
    tid = setInterval(function(){
        clearInterval(tid);
        tid = null;
        console.log('------------Git Pull---------------');
        var git = spawn('git',['pull'],{cwd:'/home/release'});
        git.stdout.on('data', (data) => {
            console.log(`git: ${data}`);
          });
        git.stderr.on('data', (data) => {
            console.log(`git error: ${data}`);
        });
    },1000);
}

//监控git仓库，如果发生变化就做git pull操作
fs.watch('/home/voxel/refs/heads',function(eventType, filename){
    console.log(`watch change : ${filename}`);
    timeoutDoGitPull();
});

function timeoutDoServerReset(){
    if(tid2)
        clearInterval(tid2);
    tid2 = setInterval(function(){
        clearInterval(tid2);
        tid2 = null;
        console.log('------------Server Restart--------------');
        var pm2 = spawn('pm2',['restart','www']);
        pm2.stdout.on('data', (data) => {
            console.log(`pm2: ${data}`);
        });
        pm2.stderr.on('data', (data) => {
            console.log(`pm2 error: ${data}`);
        });
    },1000);
}
//如果服务器代码发生变化
fs.watch('/home/release/server',function(eventType, filename){
    console.log(`watch change : ${filename}`);
    timeoutDoServerReset();
});