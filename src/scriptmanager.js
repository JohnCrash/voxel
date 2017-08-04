/**
 * 实现一个简单前端动态加载脚本功能
 */
class ScriptManager_{
    constructor(){
        this.scripts = {};
    }
    load(js,cb){
        let s = this.scripts[js];
        if(s && s.state){
            if(s.state==='ready'){
                cb(false,s.module);
            }else if(s.state==='loading'){
                s.cbs.push(cb);
            }
        }else{
            s = this.scripts[js] = {state:'loading',cbs:[cb]};
            let head = document.getElementsByTagName('head')[0];
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = js;
            script.onreadystatechange=function(){
                if(this.readyState==='complete'){
                    s.state = 'ready';
                    for(let i=0;i<s.cbs.length;i++){
                        cb(false,s.module);
                    }
                    s.cbs = undefined;
                }
            }
            script.onload=function(){
                s.state = 'ready';
                for(let i=0;i<s.cbs.length;i++){
                    cb(false,s.module);
                }
                s.cbs = undefined;
            }
            head.appendChild(script);
        }
    }
};

//singleton in es6
export let ScriptManager = new ScriptManager_();