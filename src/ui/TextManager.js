import {fetchText} from '../vox/fetch';

class TextManager_{
    constructor(){
        this.texts = {};
    }
    reset(){
        this.texts = {};
    }    
    load(file,cb){
        let s = this.texts[file];
        if(s && s.state==='ready'){
            cb(false,s.text);
        }else if(s && s.state==='loading'){
            s.cbs.push(cb);
        }else{
            s = this.texts[file] = {state:'loading',cbs:[cb]};
            fetchText(file,(text)=>{
                s.text = text;
                s.state = 'ready';
                for(let cbc of s.cbs){
                    cbc(false,text);
                }
                s.cbs = undefined;
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
};

//singleton in es6
export let TextManager = new TextManager_();