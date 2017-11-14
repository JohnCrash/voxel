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
                        this._userInfo = JSON.parse(msg);
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
            cb(false,`没有从乐教乐学大厅进入. (${window.ljAppObject}),(${window.cordova})`);
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