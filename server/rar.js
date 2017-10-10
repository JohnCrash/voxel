/**
 * 使用rar对vox进行压缩，并监控vox目录更新压缩
 */
var config = require('./config');
var fs = require('fs');
var {spawn} = require('child_process');
var os = require('os');

function rar(src,tar,path){
    let rarcmd = spawn('C:/Program Files/WinRAR/rar',['a',tar,src],{cwd:path});
    rarcmd.stdout.on('data',(data)=>{
        console.log(data.toString());
    });
    rarcmd.stderr.on('data',(data)=>{
        console.log(data.toString());
    });
    rarcmd.on('close',(code)=>{
        console.log(`rar ${code}`);
    });    
}

function isOld(file,path){
    return new Promise(
        function(resolve, reject){
            let src = `${path}/${file}.vox`;
            let tar = `${path}/${file}.voz`;            
            fs.stat(tar,(err, stats)=>{
                if(err){
                    resolve();
                }else{
                    if(stats.isFile()){
                        fs.stat(src,(err1, stats2)=>{
                            if(err1){
                                reject(`${src} ${err1}`);
                            }else{
                                if(stats2.isFile()){
                                    if(stats.mtime < stats2.mtime){
                                        resolve();
                                    }else{
                                        reject(`${src} is done`);
                                    }
                                }else{
                                    reject(`${src} is not file`);
                                }
                            }
                        });
                    }else{
                        resolve();
                    }
                }
            });
        }
    );
}

function watch(path){
    fs.readdir(path,function(err,files){
        for(let file of files){
            let m = file.match(/(.*)\.vox$/);
            if(m){
                isOld(m[1],path).then(()=>{
                    console.log('rerar!');
                    rar(`${m[1]}.vox`,`${m[1]}.voz`,path);
                }).catch((err)=>{
                    console.log(err);
                });
            }
        }
    });
    fs.watch(path,function(eventType, filename){
        if(filename){
            let m = filename.match(/(.*)\.vox$/);
            if(m){
                rar(`${m[1]}.vox`,`${m[1]}.voz`,path);
            }
        }
    })
}

if(os.platform()==='win32'){
    watch(config.upload+'/scene/vox');
}