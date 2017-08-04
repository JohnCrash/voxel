import {fetchJson} from './fetch';

class ItemTemplate_{
    constructor(){
        this.itemTemplates = {};
    }
    load(file,cb){
        if(this.getItemTemplate(file)){
            cb(false,this.getItemTemplate(file));
            return;
        }
        fetchJson(file,(json)=>{
            this.itemTemplates[file] = {json:json};
            cb(false,json);
        },(err)=>{
            this.itemTemplates[file].err = err;
            cb(true);
        });
    }
    getItemTemplate(file){
        return this.itemTemplates[file] && this.itemTemplates[file].json;
    }
    getErr(file){
        return this.itemTemplates[file] && this.itemTemplates[file].err;
    }
};

//singleton in es6
export let ItemTemplate = new ItemTemplate_();