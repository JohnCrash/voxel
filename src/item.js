/**
 * 场景中要出现的物体
 */
import {fetchBin} from 'fetch';
var voxparser = require('vox');

var type = 'ItemMesh';

class ItemMesh{
    constructor(file,cb,errcb){
        this.type = type;
        this.file = file;
        this.meshs = [];
        this.sizes = [];
        this.AABB = {};
        this.ready = false;
        fetchBin(file,(data)=>{
            var vox = this.vox = voxparser(data);
            var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0});
            for(let i=0;i<vox.getModelNum();i++){
                this,meshs.push(vox.getModelMesh(i,material));
                this.sizes.push(vox.getModelSize(i));
            }
            //计算AABB盒子
            this.ready = true;
            cb && cb(file);
        },(err)=>{
            errcb && errcb(err,file);
            console.log(`load '${file}' failed`);
        });
    }
    getMesh(i){
        return this.meshs[i||0];
    }
    getMeshNum(){
        return this.meshs.length;
    }
    getAABB(){
        return this.AABB;
    }
    createItem(){
    }
};