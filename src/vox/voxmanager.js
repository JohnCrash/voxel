/**
 * 场景中要出现的物体
 */
import {fetchBin} from './fetch';
var voxparser = require('./vox').Parser;

class VoxManager_{
    constructor(){
        this.voxs = {};
    }
    reset(){
        this.voxs = {};
    }
    /*
     * 加载成功或者失败都调用cb(iserr),成功cb(false),失败cb(true)
     * 失败可以遍历
     */
    loadVox(files,cb){
        let b = true;
        for(let i=0;i<files.length;i++){
            let file = files[i];
            if(!(this.voxs[file]&&this.voxs[file].vox)){
                b = false;
            }
        }
        if(b){
            cb(false); //全部的文件都存在
            return;
        }
        let count = 0;
        b = false;
        for(let i=0;i<files.length;i++){
            let file = files[i];
            if(!this.voxs[file]){ //还未开始加载
                this.voxs[file] = {cbs:[cb],state:'loading'};
            }else if(this.voxs[file] && this.voxs[file].err){ //重新加载以前失败过的
                this.voxs[file].cbs = [cb];
                this.voxs[file].err = null;
            }else{ //正在加载还未返回，将回调加入到列表中
                this.voxs[file].cbs.push(cb);
                continue;
            }
            count++;
            fetchBin(file,(data)=>{
                this.voxs[file].vox = voxparser(data);
                this.voxs[file].state='ready';
                if(!(--count)){
                    for(let cb of this.voxs[file].cbs){ //调用所有请求该文件的回调
                        cb(b);
                    }
                    this.voxs[file].cbs = undefined;
                }
            },(err)=>{
                this.voxs[file].err = err;
                this.voxs[file].state='error';
                b = true;
                if(!(--count)){
                    for(let cb of this.voxs[file].cbs){ //调用所有请求该文件的回调
                        cb(b);
                    }
                    this.voxs[file].cbs = undefined;
                }
            });
        }
    }
    getVox(file){
        return this.voxs[file] && this.voxs[file].vox;
    }
    getErr(file){
        return this.voxs[file] && this.voxs[file].err;
    }
};

//singleton in es6
export let VoxManager = new VoxManager_();