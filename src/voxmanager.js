/**
 * 场景中要出现的物体
 */
import {fetchBin} from './fetch';
var voxparser = require('./vox');

class VoxManager_{
    constructor(){
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
            cb(); //全部的文件都存在
            return;
        }
        let count = 0;
        b = false;
        for(let i=0;i<files.length;i++){
            let file = files[i];
            if(!this.voxs[file]){ //加载还未加载的
                this.voxs[file] = {};
            }else if(this.voxs[file] && this.voxs[file].err){ //重新加载以前失败过的
                this.voxs[file].err = null;
            }else continue;
            count++;
            fetchBin(file,(data)=>{
                this.voxs[file].vox = voxparser(data);
                if(!(--count))
                    cb(b);
            },(err)=>{
                this.voxs[file].err = err;
                b = true;
                if(!(--count))
                    cb(b);
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