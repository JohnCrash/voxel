import {fetchJson} from './fetch';
import {ScriptManager} from './scriptmanager';

class ItemTemplate_{
    constructor(){
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
    addItemEvent(name,func){
        for(let file in this.itemTemplates){
            let json = this.itemTemplates[file].json;
            if(json){
                json.live = func;
            }
        }
    }
};

//singleton in es6
export let ItemTemplate = new ItemTemplate_();

window.addItemEvent = function(name,func){
    ItemTemplate.addItemEvent(name,func);
}