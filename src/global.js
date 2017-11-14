import {postJson,fetchJson} from './vox/fetch';
import Log from './vox/log';
import EventEmitter from 'events';
import {MessageBox} from './ui/messagebox';

//if(window.closeLoadingUI)root.style.display="none";
class _Global_ extends EventEmitter{
    constructor(){
        super();
        this.LevelJson = null;
        this.maxpasslv = null;
        this._debug = false;
        this._layout = 'landscape';
        this._btb = 'expand';
        this._character = 'none';
        this._muteMusic = true;
        this._muteSound = true;
        this._userName = 'None';
        this._ui = [];

        document.addEventListener("backbutton", ()=>{
            this.callTop();
        }, false);
        this.push(()=>{
            MessageBox.show("okcancel","游戏退出","你确定要退出游戏吗？",(result)=>{
                if(result==='ok'){
                    if(window.ljAppObject)
                        window.ljAppObject.back();
                }
            });
        },'game');
        /*
        if(window.native && native.quit){
            native.onBack = ()=>{
                this.callTop();
            }
            if(native.registerOnBack)
                native.registerOnBack(true);            
            this.push(()=>{
                MessageBox.show("okcancel","游戏退出","你确定要退出游戏吗？",(result)=>{
                    if(result==='ok'){
                        native.quit();
                    }
                });
            },'game');
        }*/    
    }
    /**
     * 当有加载界面时,加载界面提供这几个函数
     * closeLoadingUI 关闭加载界面
     * loadingProgressBar 进度条函数
     */    
    closeLoading(){
        if(window.closeLoadingUI){
            setTimeout(()=>{
                console.log('call closeLoadingUI()');
                let root = document.getElementById('root');
                root.style.display="";
                if(window.closeLoadingUI)closeLoadingUI();
            },200);
        }
    }
    loadingBar(b){
        if(window.loadingProgressBar)loadingProgressBar(b);
    }
    //gname代表全局名称，如果堆中已经有gname将忽略此次压入操作
    push(cb,gname){
        if(gname!==undefined){
            for(let item of this._ui){
                if(item.ganem === gname)return;
            }
        }
        console.log('push ' + gname);
        this._ui.push({cb,gname});
    }
    pop(){
        let a = this._ui.pop();
        console.log('pop '+a.gname);
    }
    popName(gname){
        console.log('popName '+gname);
        if(gname!==undefined){
            for(let i=0;i< this._ui.length;i++){
                let item = this._ui[i];
                if(item.gname === gname){
                    this._ui.splice(i,1);
                    console.log('Done popName '+gname);
                    return;
                }
            }
        }
    }
    callTop(){
        if(this._ui.length>0){
            let a = this._ui[this._ui.length-1];
            console.log('callTop '+a.gname);
            a.cb();
        }else{
            console.log('callTop ui.length <= 0');
        }
    }
    isDebug(){
        return this._debug;
    }
    setDebugMode(b){
        this._debug = b;
        if(this._immDebug){
            this._immDebug(b);
        }
    }
    setUserInfo(uid,uname,cookie){
        this._uid = Number(uid);
        this._uname = uname;
        this._cookie = cookie;
    }
    getUID(){
        return this._uid;
    }
    getCookie(){
        return this._cookie;
    }
    getUserName(){
        return this._uname;
    }
    setUserName(name){
        this._uname = name;
    }
    loadConfig(jsonStr){
        if(jsonStr){
            let config = JSON.parse(jsonStr);
            if(config){
                this.muteMusic(config.music);
                this.muteSound(config.sound);
                this.setLayout(config.layout);
                this.setCharacter(config.character);
                this.setDebugMode(config.debug);
                return;
            }
        }
        //无配置默认状态
        this.muteMusic(true);
        this.muteSound(true);
        this.setLayout('landscape');
        this.setCharacter('none');
    }
    //上传
    pushConfig(){
        postJson('/users/config',
        {
            uid:Global.getUID(),
            config : JSON.stringify({
            music : this._muteMusic,
            sound : this._muteSound,
            layout : this._layout,
            character : this._character,
            debug : this._debug})
        },
        (json)=>{
            if(json.result!=='ok'){
                log(json.result);
            }
        });
    }
    /**
     * 加载当前关卡层次
     */
    loadLevelJson(name,cb){
        if(this.LevelJson){
            if(cb){
                cb(this.LevelJson);
            }
            return;
        }
        fetchJson(`scene/${name}.index`,(json)=>{
            if(cb){
                cb(json);
            }
            this.LevelJson = json;
        });        
    }
    /**
     * 取得当前关卡层次图
     */
    levelJson(){
        return this.LevelJson;
    }
    //将关卡映射为关卡名称
    levelToLeveName(level){
        if(this.LevelJson && this.LevelJson.level){
            for(let i = 0 ;i<this.LevelJson.level.length;i++){
                let seg = this.LevelJson.level[i];
                if( seg.rang ){
                    let m = seg.rang.match(/(\d+)-(\d+)/);
                    let b = Number(m[1]);
                    let e = Number(m[2]);
                    if(b <= level && e >= level){
                        return `L${i+1}-${level-b+1}`;
                    }
                }
            }
        }
    }
    /**
     * 根据当前关卡名称得到本关卡的信息
     * @param {*} level 当前关卡名称例如:L3-1
     * current 当前段的当前关
     * next     全局的下一关(1,2,3,....
     * begin    全局本段开始(51
     * end      全局本段结束(-59
     * nextName 下一关名称 'L5-1'
     * unlock   需要解锁的金币数量"100",或者undefined
     * closed   全局未开放关卡
     */
    appGetLevelInfo(level){
        if(!level || !this.LevelJson)return null;
        
            let m = level.match(/L(\d+)-(\d+)/);
            if(m){
                let b = Number(m[1])-1;
                let e = Number(m[2])-1;
                let item = this.LevelJson.level[b]; //当前关卡
                if(!item)return null;
                m = item.rang.match(/(\d+)-(\d+)/);
                if(m){
                    let begin = Number(m[1]);
                    let end = Number(m[2]);
                    let nextName;
                    let next = begin + e + 1;
                    let next_unlock_gold = item.unlock?Number(item.unlock):0;
                    let next_begin = begin;
                    let next_end = end;
                    if(e<end-begin){
                        nextName = `L${b+1}-${e+2}`; //next还在当前段中
                    }else if(this.LevelJson.level[b+1]){
                        nextName = `L${b+2}-${1}`; //进行到下一段了
                        let nextItem = this.LevelJson.level[b+1];
                        let nm = nextItem.rang.match(/(\d+)-(\d+)/);
                        next_begin = Number(nm[1]);
                        next_end = Number(nm[2]);
                        next_unlock_gold = nextItem.unlock?Number(nextItem.unlock):0;
                    }
                    let next_need_unlock = next_unlock_gold>0?(this.maxunlocklv<next):false;
                    return Object.assign({current:e,
                        begin,
                        end,
                        nextName,
                        next_begin,
                        next_end,
                        next,
                        next_unlock_gold,
                        next_need_unlock,
                        closed:this.LevelJson.closed,
                        total:this.LevelJson.total},this.LevelJson.level[b]);
                }
            }
            return null;        
    }
    /**
     * 设置最大解锁的关卡
     */
    setMaxUnlockLevel(olv){
        this.maxunlocklv = olv;
    }
    getMaxUnlockLevel(){
        return this.maxunlocklv;
    }
    /**
     * 设置当前通的最远的关
     */
    setMaxPassLevel(lv){
        this.maxpasslv = lv;
    }
    getMaxPassLevel(lv){
        return this.maxpasslv;
    }
    /**
     * 通了本关
     */
    passLevel(lv){
        if(lv > this.maxpasslv){
            this.maxpasslv = lv;
        }
        this.updateCls(this._uid,lv-1);
        this.wsPassLevel(lv-1);
    }
    setCurrentSceneManager(sceneManager){
        this._sceneManager = sceneManager;
    }
    setCurrentBlocklyView(view){
        this._blocklyView = view;
    }
    initAudio(){
        if(this._sceneManager){
            this._sceneManager.muteMusic(!this._muteMusic);
            this._sceneManager.muteSound(!this._muteSound);
        }        
    }
    isMusic(){
        return this._muteMusic;
    }
    isSound(){
        return this._muteSound;
    }
    muteMusic(b){
        this._muteMusic = b;
        if(this._sceneManager){
            this._sceneManager.muteMusic(!this._muteMusic);
        }
    }
    muteSound(b){
        this._muteSound = b;
        if(this._sceneManager){
            this._sceneManager.muteSound(!this._muteSound);
        }        
    }
    setCurrentLang(lang){
        this._lang = lang;
        if(this._blocklyView){
            this._blocklyView.ResetWorkspace();
        }
    }
    getCurrentLang(){
        return this._lang;
    }
    setLayout(layout){
        this._layout = layout;
        if(this._immLayout){
            this._immLayout(layout);
        }
    }
    getLayout(){
        return this._layout;
    }
    setBlocklyToolbar(m){
        this._btb = m;
        if(this._immBlocklytoolbox){
            this._immBlocklytoolbox(m);
        }
    }
    getBlocklyToolbar(){
        return this._btb;
    }
    //设置角色
    setCharacter(c){
        this._character = c;
    }
    getCharacter(){
        return this._character;
    }
    getPlatfrom(){
        return window.platfrom;
    }
    /**
     * 设置login信息
     */
    setLoginJson(json){
        this._loginJson = json;
        //cls做一个时间转换
        if(json && json.cls){
            for(let o of json.cls){
                o.lvdate = new Date(o.lastcommit);
            }
        }
    }
    //更新cls表中自己的关卡进度
    updateCls(uid,lv){
        if(this._loginJson){
            let json = this._loginJson;
            for(let o of json.cls){
                if(o.uid===uid && o.lv < lv){
                    o.lv = lv;
                    return true;
                }
            }
        }
        return false;
    }
    getLoginJson(){
        return this._loginJson;
    }
    wsPassLevel(lv){
        if(this._wsClsLv){
            //通知同班同学我过了一个
            this._wsClsLv.sendMsg({event:'pass',
                uid:this._uid,
                name:this._uname,
                lv,
                cls:this._loginJson.clsid
            });
        }
    }
    //初始化websocket
    wsLogin(){
        let ws = new WebSocket(`ws://${location.host}/clslv`);
        this._wsClsLv = ws;
        ws.sendMsg = function(t){
            try{
                this.send(JSON.stringify(t));
            }catch(e){
                console.log(e);
            }
        }
        ws.reciveMsg=function(event){
            try{
                return JSON.parse(event.data);
            }catch(e){
                console.log(e);
            }            
        }
        ws.onopen = (event)=>{
            ws.sendMsg({event:'login',
                uid:this._uid,
                name:this._uname,
                lv:this.maxpasslv,
                cls:this._loginJson.clsid});
        }
        ws.onmessage = (event)=>{
            let t = ws.reciveMsg(event);
            if(t){
                this.emit('ws',t);
                switch(t.event){
                    case 'pass'://处理班级其他同学关卡
                        {
                            if(this.updateCls(t.uid,t.lv)){
                                this.emit('clslv'); //更新关卡列表
                            }
                            let levelName = Global.levelToLeveName(t.lv);
                            MessageBox.msg(`${t.name} 过了 ${levelName}`);
                        }                        
                        break;
                    case 'enter':
                        MessageBox.msg(`${t.name} 进入游戏`);
                        break;
                    case 'exit':
                        MessageBox.msg(`${t.name} 退出游戏`);
                        break;
                }
            }
        }
        ws.onclose = ()=>{
            this._wsClsLv = null;
            ws = null;
        }
        ws.onerror = (event)=>{
            this._wsClsLv = null;
            ws = null;
        }
    }
};

export let Global = new _Global_();
