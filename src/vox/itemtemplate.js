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
    searchLiveByScript(script){
        for(let k in this.itemTemplates){
            let t = this.itemTemplates[k];
            if(t.json.script===script)
                return t.json.live;
        }
        return null;
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
                            //fixbug: 脚本每次加载给对应的模板设置live函数
                            // 但是第二次脚本加载将不执行注册函数(脚本已经缓冲)
                            if(s.json.script&&!s.json.live){
                                s.json.live = this.searchLiveByScript(s.json.script);
                            }
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