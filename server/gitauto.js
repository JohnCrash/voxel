/**
 * 监听git文件，自动拉取并重新启动服务器
 */
var config = require('./config');
var fs = require('fs');
var {spawn} = require('child_process');
var tid,sid; 

function timeoutDoGitPull(){
    if(tid)
        clearInterval(tid);
    tid = setInterval(function(){
        clearInterval(tid);
        tid = null;
        var git = spawn('git',['pull'],{cwd:'/home/release'});
        git.stdout.on('data', (data) => {
            console.log(`git: ${data}`);
          });
        git.stderr.on('data', (data) => {
            console.log(`git error: ${data}`);
        });
    },3000);
}

//监控git仓库，如果发生变化就做git pull操作
fs.watch('/home/voxel/objects',function(eventType, filename){
    timeoutDoGitPull();
});

let www;

function restartWWW(){
    console.log('==========================');
    console.log('RESTART');
    console.log('==========================');
    if(www){
        www.kill('SIGTERM');
    }
    console.log('spawn WWW');
    www = spawn('node',['/home/release/server/www'],{cwd:'/home/release'});
    www.stdout.on('data',(data)=>{
    });
    www.stderr.on('data',(data)=>{
    });
    www.on('close',(code)=>{
        console.log('WWW EXIT! '+code);
    });
}

function timeoutDoResetServer(){
    if(sid)
        clearInterval(sid);
    sid = setInterval(function(){
        clearInterval(sid);
        sid = null;
        restartWWW();
    },3000);
}

//监控server目录，如果发生变化就重新启动node server/wwww
fs.watch('/home/release/server',function(eventType, filename){
    timeoutDoResetServer();
});


restartWWW();