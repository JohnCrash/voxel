var fetch = require('node-fetch');
var crypto = require('crypto');

let url = 'http://localhost:3001';
//let url = 'http://code.app.ljlx.com';
//1-1000
//uid = 1-1000 ,uname = 'test${uid}',cookie = md5(uname)
//虚拟用户
class User{
    constructor(uid){
        this._uid = uid || 1;
        this._uname = `test${this._uid}`;
        var md5sum = crypto.createHash('md5');
        md5sum.update(this._uname);
        this._cookie = 'sc1='+md5sum.digest('hex');      
    }
    api(u,body,cb){
        console.log(`api ${url}${u}`);
        fetch(`${url}${u}`,{
            method:'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie':this._cookie,
            },
            body : JSON.stringify(body)
        }).then((responese)=>{
            return responese.json();
        }).then((json)=>{
            if(json.result!=='ok'){
                console.warn(json);
                console.warn(u);
                console.warn(body);                    
            }
            cb(json);
        }).catch((err)=>{
            console.error(err);
            console.error(u);
            console.error(body);
            cb();
        });
    }
    login(cb){
        this.api('/users/login',
            {uid : this._uid,
            uname : this._uname,
            cookie : this._cookie},(json)=>{
                this._loginJson = json;
                if(cb)cb();
            });
    }
    logout(){

    }
    commit(cb){ //提交
        let lv = this._loginJson.lv+1;
        if(lv > 10){
            lv = Math.floor(lv*Math.random())+1;
            if(lv>60)lv = 60;
        }
        let lname = `L${Math.floor(lv/10)+1}-${lv%10}`;
        let blocks = 5+Math.floor(20*Math.random());
        let total = Math.floor(1000*1000*Math.random());//总用时ms
        let each = Math.floor(total*Math.random());//每次用时
        let body = {
            uid:this._uid,
            lv,
            lname,
            blocks,
            total,
            each,
            method : 'test'
        };
        this.api('/users/commit',body,(json)=>{
            if(json && json.result==='ok' && lv === this._loginJson.lv+1){
                this._loginJson.lv++;
            }
            if(cb)cb();
        });
    }
    config(){ //保存配置
        this.api('/users/config',{
            uid:this._uid,
            config: JSON.stringify({
                music : Math.random()>0.5,
                sound : Math.random()>0.5,
                layout : Math.random()>0.5?"landscape":"proprit",
                uisyle : Math.random()>0.5?"simple":"feacture",
                skin : Math.random()>0.5?"simple":"black",
                character : Math.random()>0.5?"boy":"girl",
            })
        },(json)=>{

        });
    }
    unlock(){ //测试解锁
        this.api('/users/unlock',{},(json)=>{

        })
    }
    bestmethod(){ //取得最佳通过方法
        this.api('/users/levelmethod',{},(json)=>{
            
        })
    }
    crowns(){ //测试皇冠榜

    }
    static(){ //测试静态数据

    }
    ws(){ //测试websocket通信

    }
}

let _exit = false;
function testUser(uid){
    let a = new User(uid);
    a.login(()=>{
        console.log(`user login: ${uid}`);
        /*
        let id = setInterval(()=>{
            if(_exit){
                clearInterval(id);
                return;
            }
            a.commit();
        },Math.random(100) );
        */
        function co(){
            if(_exit){
                console.log(`exit ${uid}`);
                return;
            }
        //    if(Math.random()<0.05)
        //        a.unlock();
        //    if(Math.random()<0.3)
        //        a.config();
            a.commit(co);
        }
        co();
    });    
}

for(let i = 0;i<100;i++){
    setTimeout(()=>{
        testUser(i);
    },i*100);
}

setTimeout(()=>{
    _exit=true;
    console.log('================================');
    console.log('EXIT');
    console.log('================================');
},5*60*1000);