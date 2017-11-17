class _ljshell{
    constructor(){
    }
    init(cb){
        if(this._userinfo){
            cb(true);
        }else{
            document.addEventListener('deviceready', ()=>{
                this.lj = window.ljAppObject;
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
            }, false);
            if(window.LOCALHOST){//eslint-disable-line
                setTimeout(()=>{
                    if(!this.lj){
                        this._userInfo = null;
                        cb(false,`没有从乐教乐学大厅进入. (${window.ljAppObject}),(${window.cordova})`);    
                    }
                },2000);
            }
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
    pay(t,cb){
        try{
            this.lj.pay(function(msg,status){
                if(status)
                    if(cb)cb(true);
                else
                    if(cb)cb(false,msg);
            },t);
        }catch(e){
            if(cb)cb(false,"不能正确支付金币，请从乐教乐学大厅进入游戏.");
        }
    }
}

export let ljshell = new _ljshell();