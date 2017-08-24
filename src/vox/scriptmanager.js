/**
 * 实现一个简单前端动态加载脚本功能
 */
class ScriptManager_{
    constructor(){
        this.scripts = {};
        this.scriptNode = [];
    }
    /**
     * 将脚本节点全部清空
     */
    reset(){
        this.scripts = {};
        let head = document.getElementsByTagName('head')[0];
        if(head){
            for(let node of this.scriptNode){
                head.removeChild(node);
            }
            this.scriptNode = [];
        }
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
            this.scriptNode.push(script);
        }
    }
};

//singleton in es6
export let ScriptManager = new ScriptManager_();