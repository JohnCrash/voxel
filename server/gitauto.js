/**
 * 监听git文件，自动拉取并重新启动服务器
 */
var config = require('./config');
var fs = require('fs');
var {spawn} = require('child_process');
var tid;

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
    },1000);
}

//监控git仓库，如果发生变化就做git pull操作
fs.watch('/home/voxel/refs/heads',function(eventType, filename){
    console.log(`watch change : ${filename}`);
    timeoutDoGitPull();
});