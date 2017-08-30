import {fetchJson} from './fetch';
import {ScriptManager} from './scriptmanager';

class ItemTemplate_{
    constructor(){
        this.itemTemplates = {};
    }
    /**
     * 清空模板
     */
    reset(){
        this.itemTemplates = {};
    }
    load(file,cb){
        let s = this.itemTemplates[file];
        if(s && s.state==='ready'){
            cb(false,s.json);
        }else if(s && s.state==='loading'){
            s.cbs.push(cb);
        }else{
            s = this.itemTemplates[file] = {state:'loading',cbs:[cb]};
            fetchJson(file,(json)=>{
                s.json = json;
                s.state = 'ready';
                if(json.script){
                    ScriptManager.load(json.script,(iserr)=>{
                        if(!iserr){
                            for(let cbc of s.cbs){
                                cbc(false,json);
                            }
                            s.cbs = undefined;                        
                        }
                    });
                }else{
                    for(let cbc of s.cbs){
                        cbc(false,json);
                    }
                    s.cbs = undefined;
                }
            },(err)=>{
                s.state = 'error';
                s.err = err;
                for(let cbc of s.cbs){
                    cbc(true,err);
                }
                s.cbs = undefined;
            });
        }
    }
    getItemTemplate(file){
        return this.itemTemplates[file] && this.itemTemplates[file].json;
    }
    getErr(file){
        return this.itemTemplates[file] && this.itemTemplates[file].err;
    }
    regItemEvent(name,func){
        for(let file in this.itemTemplates){
            let json = this.itemTemplates[file].json;
            if(json){
                if(json.type && json.type === name)
                    json.live = func;
                else if( json.name === name)
                    json.live = func;
            }
        }
    }
};

//singleton in es6
export let ItemTemplate = new ItemTemplate_();

/**
 * 加一个全局函数addItemEvent
 * 此函数用于注册物品的物品的脚本函数
 */
window.regItemEvent = function(name,func){
    ItemTemplate.regItemEvent(name,func);
}