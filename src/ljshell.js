/**
 * NAVTIVE 界面
 */
if(window.native){
    if(native.quit){
        native.onBack = function(){
            Global.callTop();
        }
        if(native.registerOnBack)
            native.registerOnBack(true);
        Global.push(()=>{
            MessageBox.show("okcancel","游戏退出","你确定要退出游戏吗？",(result)=>{
                if(result==='ok'){
                    native.quit();
                }
            },undefined,true);
        },true);
    }
}

class _ljshell{
    constructor(){
        this.lj = window.ljAppObject;
    }
    init(cb){
        if(this._userinfo){
            cb(true);
        }else if(this.lj){
            let n = 0;
            this.lj.userinfo((msg,status)=>{
                if(status){
                    try{
                        this._userInfo = JSON.stringify(msg);
                    }catch(e){
                        cb(false,"userinfo "+e.toString());
                    }
                    if((++n)===1)cb(true);
                }else{
                    this._userInfo = null;
                    cb(false,`userinfo 返回错误 ${status}`);
                }
            });
        }else{
            this._userInfo = null;
            cb(false,`没有从乐教乐学大厅进入. (${window.ljAppObject})`);
        }
    }
    getUserInfo(){
        return this._userInfo;
    }
    getNickName(){
        return this._nickName;
    }
    exit(){
        this.lj.back();
    }
}

export let ljshell = new _ljshell();