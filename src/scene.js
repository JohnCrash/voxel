/**
 * 游戏关卡对象场景
 */
import Item from 'item';
import Player from 'player';

class Scene{
    constructor(game){
        this.game = game;
        this.lights = [];   //场景中的灯列表
        this.meshs = [];    //场景出现Mesh
        this.items = [];    //场景中物体
        this.players = [];  //场景中玩家包括npc
    }

    /**
     * 删除场景全部的对象
     */
    destroy(){
        clearLight();
        clearMesh();
        clearItem();
        clearPlayer();
    }

    /**
     * 从场景文件创建场景
     */
    loadFromString(str){
        return loadFromJson(JSON.parse(str));
    }

    /**
     * 文件主要包括一下几块
     * camera
     * light
     * mesh
     * item
     * player
     * description
     * script
     * 当加载完全结束是调用cb(true),如果失败调用cb(false)
     */
    loadFromJson(json,cb){
        this.loadCamera(jsom.camera);
        this.loadLight(jsom.light);
        //这个是一个异步加载函数,只有当加载完成或者失败才调用回调
        this.loadMesh(jsom.mesh,(b)=>{
            var c;
            var d;
            if(b){
                c = this.loadItem(jsom.item);
                d = this.loadPlayer(json.player);
            }
            cb && cb(c&&d);
        });
    }

    loadCamera(camera){
        this.game.camera.position = camera.position;
        this.game.camera.rotation = camera.rotation;
        return true;
    }

    /**
     * { type ('spot|direct|hemi'),
     *  color , skyColor , groundColor ,intensity }
     */
    loadLight(lights){
        this.clearLight();
        for(let i=0;i<lights;i++){
            var light = lights[i];
            var lgt;
            switch(light.type){
                case 'spot':
                    lgt = this.game.addSpotLight(light);
                case 'direct':
                    lgt = this.game.addDirectionaLight(light);
                case 'hemi':
                    lgt = this.game.addHemiSphereLight(light.skyColor,light.groundColor,light.intensity);
                    break;
            }
            if(lgt)this.lights.push(lgt);
        }
        return true;
    }

    /**
     * 当全部加载结束后调用cb
     */
    loadMesh(meshs,cb){
        this.clearMesh();
        for(let i=0;i<meshs.length;i++){
            this.meshs.push(new ItemMesh(meshs[i],count_cb,error_cb));
        }
        var count = meshs.length;
        function count_cb(file){
            !(--count) && cb && cb(true);
        }    
        function error_cb(err,file){
            cb && cb(false);
        }
    }

    loadItem(items){
        this.clearItem();
        for(let i=0;i<items.length;i++){
            this.items.push(new Item());
        }
        return true;
    }

    loadPlayer(players){
        this.clearPlayer();
        for(let i=0;i<players.length;i++){
            this.players.push(new Item());
        }        
        return true;
    }

    clearLight(){
        for(let i=0;i<this.lights.length;i++){
            this.game.scene.remove(this.lights[i]);
        }
        this.lights = [];
    }

    clearMesh(){
        this.meshs = [];        
    }

    clearItem(){
        for(let i=0;i<this.items.length;i++){
            this.items[i].remove();
        }
        this.items = [];
    }

    clearPlayer(){
        for(let i=0;i<this.players.length;i++){
            this.players[i].remove();
        }
        this.players = [];
    }
    /**
     * 见场景当前状态保存下来
     */
    saveAsString(){
    }
};

export default Scene;