import {postJson,fetchJson,localJson} from './vox/fetch';
import log from './vox/log';
import EventEmitter from 'events';
import {MessageBox} from './ui/MessageBox';
import MarkdownElement from './ui/MarkdownElement';
import {TextManager} from './ui/TextManager';
import React, {Component} from 'react';
import {AudioManager} from './vox/audiomanager';
import  crypto from 'crypto';
/*global closeLoadingUI,loadingProgressBar*/
/*global THREE*/
//if(window.closeLoadingUI)root.style.display="none";
console.info('Import Global...');
class _Global_ extends EventEmitter{
    constructor(){
        super();
        this.version = '1.0.42';
        this.LevelJson = null;
        this.maxpasslv = null;
        this._debug = window.LOCALHOST;
        this._layout = 'landscape';
        this._btb = 'expand';
        this._character = 'none';
        this._lang = 'zh';
        this._muteMusic = true;
        this._muteSound = true;
        this._userName = 'None';
        this._blocklyskin = "Scratch";
        this._ui = [];
        this._fps = 60;
        //windows,android,ios
        try{
            let plow = navigator.platform.toLocaleLowerCase();
            console.log('PLATFORM : '+plow);
            if( plow.match(/win32/) )
                this._platform = 'windows';
            else if( plow.match(/android|linux/))
                this._platform = 'android';
            else if( plow.match(/ipad|iphone|ios/))
                this._platform = 'ios';
            else this._platform = 'unknow';
        }catch(e){
            this._platform = 'unknow';
        }
        console.log('Global document.addEventListener backbutton');
        document.addEventListener("backbutton", ()=>{
            console.log('===>backbutton');
            this.callTop();
        }, false);
        console.log('Global push game quit');
        try{
            this.push(()=>{
                MessageBox.show("okcancel","游戏退出","你确定要退出游戏吗？",(result)=>{
                    if(result==='ok'){
                        if(window.ljAppObject)
                            window.ljAppObject.back();
                    }
                });
            },'game');    
        }catch(e){
            console.error(e);
        }
        //到后台
        console.log('Global document.addEventListener pause');
        document.addEventListener("pause", (event)=>{ 
            if(this._muteMusic && this._sceneManager){
                console.log('stop music');
                this._sceneManager.stopMusic();
            }
           console.log('pause');
           console.info(new Date().toTimeString());
        }, false);  
        //到前台  
        console.log('Global document.addEventListener resume');   
        document.addEventListener("resume", (event)=>{
           if(this._muteMusic && this._sceneManager){
                console.log('open music');
                this._sceneManager.muteMusic(false); 
           }
           console.log('resume');
           console.info(new Date().toTimeString());
        }, false);
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
        /*
        try{
            console.log('=====INFO=====')
            console.log(cordova);
            console.log(device); 
            console.log(navigator.compass);   
            console.log(navigator.connection);
        }catch(e){
            console.log(e);
        }*/
        /**
         * 新的版本提示
         */
        window.onnewversion = ()=>{
            MessageBox.show('okcancel',undefined,<MarkdownElement text='发现一个新的版本，马上体验。'/>,(result)=>{
                if(result==='ok')
                    window.location.reload();
            }); 
        }
        window.GLOBAL = this; 
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
        console.log('push');
        if(gname!==undefined){
            console.log(this._ui);
            for(let i=0;i<this._ui.length;i++){
                let item = this._ui[i];
                if(item.ganem === gname)return;
            }
        }
        console.log('push ' + gname);
        this._ui.push({cb,gname});
    }
    pop(){
        let a = this._ui.pop();
        let msg = '';
        if(a && a.gname)
            msg = a.gname;
        console.log('pop '+msg);
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
                this.setUIStyle(config.uisyle);
                this.setCurrentLang(config.lang);
                this.setLayout(config.layout);
                this.setCharacter(config.character);
                this.setBlocklySkin(config.skin);
                if(this._uid===144970||this._uid===25911300||this._uid===24321614)
                    this.setDebugMode(true);
                return;
            }
        }
        //无配置默认状态
        this.muteMusic(true);
        this.muteSound(true);
        this.setLayout('landscape');
        this.setCharacter('none');
        this.setBlocklySkin('Scratch');
    }
    //上传
    pushConfig(){
        postJson('/users/config',
        {
            uid:Global.getUID(),
            config : JSON.stringify({
            music : this._muteMusic,
            sound : this._muteSound,
            lang : this._lang,
            layout : this._layout,
            uisyle : this._uiStyle,
            skin : this._blocklyskin,
            character : this._character})
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
        console.log('load main.index....');
        console.log(this.LevelJson);
        if(this.LevelJson){
            if(cb){
                cb(this.LevelJson);
            }
            return;
        }
        fetchJson(`scene/${name}.index`,(json)=>{
            //将视频的关卡配置从login接口返回
            //这里将视频配置信息转移过来
            let loginJson = this.getLoginJson();
            if(loginJson && loginJson.levelvideo){
                json.movie = {};
                for(let a of loginJson.levelvideo){
                    json.movie[a.lv] = a;
                }
            }
            console.log('=========loadLevelJson==========');
            console.info(`scene/${name}.index`);
            console.log(json);
            this.LevelJson = json;
            /**
             * 加载提示结构
             */
            let fetch = (window.LOCALHOST)?localJson:fetchJson;
            let url = 'scene/ui/level_tips/level_tips.json';
            if(this._platform==='ios')
                url += `?p=${this.getRandom()}`;
            fetch(url,(json2)=>{
                this.LevelTips = json2;
                if(cb){
                    cb(json);
                }
            });
        });
    }
    setGameState(b){
        this._ingame = b;
    }
    isMainUI(){
        return !this._ingame;
    }
    /**
     * 打开老师后台
     */
    openTeacherMgr(){
        this._mainFrame.openTeacherMgr();
    }
    openStudensList(clsid,name){
        this._mainFrame.openStudensList(clsid,name);
    }
    openStudentLevel(uid,uname,cls){
        this._mainFrame.openStudentLevel(uid,uname,cls);
    }
    setMainFrame(mframe){
        this._mainFrame = mframe;
    }
    //getMainState(){
    //    return this._mainState;
    //}
    watchStudent(json){
        if(!this._loginJson2){
            this._loginJson2 = this._loginJson;
            this.maxpasslv2 = this.maxpasslv;
            this.maxunlocklv2 = this.maxunlocklv;
            this._uname2 = this._uname;
        }
        //this._mainState = mainState;
        this.setLoginJson(json);
        this.setMaxPassLevel(json.lv+1);
        this.setMaxUnlockLevel(json.olv);
        this.setUserName(json.user);
    }
    unwatchStudent(){
        if(this._loginJson2){
            this.setLoginJson(this._loginJson2);
            this.setMaxPassLevel(this.maxpasslv2+1);
            this.setMaxUnlockLevel(this.maxunlocklv2);
            this.setUserName(this._uname2);
            this._loginJson2 = null;
            this.maxpasslv2 = null;
            this.maxunlocklv2 = null;
            this._uname2 = null;
            this._mainState = null;
        }
    }
    /**
     * 返回提示结构
     */
    getLevelTips(){
        return this.LevelTips;
    }
    /**
     * 取得当前关卡层次图
     */
    levelJson(){
        return this.LevelJson;
    }
    /**
     * 取得当前的crown数量
     */
    getCrowns(){
        let c = 0;
        if(this._loginJson && this._loginJson.lvs){
            for(let lvs of this._loginJson.lvs){
                if(lvs && lvs.rank===1){
                    c++;
                }
            }
        }
        return c;
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
    //取得关卡的段结构
    //level = 0,1,...
    getLevelSegment(level){
        if(this.LevelJson && this.LevelJson.level){
            for(let i = 0 ;i<this.LevelJson.level.length;i++){
                let seg = this.LevelJson.level[i];
                if( seg.rang ){
                    let m = seg.rang.match(/(\d+)-(\d+)/);
                    let b = Number(m[1]);
                    let e = Number(m[2]);
                    if(b <= level && e >= level){
                        return seg;
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
                    let next_unlock_crown = item.unlock_crown?Number(item.unlock_crown):0;
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
                        next_unlock_crown = nextItem.unlock_crown?Number(nextItem.unlock_crown):0;
                    }
                    let next_need_unlock = next_unlock_gold>0?(this.maxunlocklv<=next):false;
                    return Object.assign({current:e,
                        begin,
                        end,
                        nextName,
                        next_begin,
                        next_end,
                        next,
                        next_unlock_gold,
                        next_unlock_crown,
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
    passLevel(lv,rank,blocks,best){
        if(lv > this.maxpasslv){
            this.maxpasslv = lv;
        }
        this.updateCls(this._uid,lv-1);
        this.updateLevelRank(lv-1,rank,blocks,best);
        this.wsPassLevel(lv-1,rank,blocks);
        //在完成关卡后更新我的皇冠数量，以及班级表cls中我的皇冠数量
        let json = this._loginJson;
        if(json){
            json.crown = this.getCrowns();
            for(let o of json.cls){
                if(o.uid=== this.getUID()){
                    o.crown = json.crown;
                }
            }
        }
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
    //主要为了解决ios，不能自动播放的问题
    playMusic(file){
        if(!this.music){
            this.audioListener = new THREE.AudioListener();
            this.music = new THREE.Audio(this.audioListener);    
        }

        this.currentMusicFile = file;
        console.log('GLOBAL PLAY MUSIC:'+file);
        this.stopMusic();
        AudioManager.load(file,(b,buffer)=>{
            if(!b){
                try{
                this.music.setBuffer(buffer);
                //this.music.setLoop(!!this.musicLoop);
                this.music.setVolume(0.2);
                this.music.play();
                }catch(e){}
            }
        });        
    }
    stopMusic(){
        if(this.music){
            try{
                this.music.stop();
            }catch(e){
            }
        }
    }    
    playSound(file){
        if(this._sceneManager && file){
            this._sceneManager.playSound(file);
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
        return this._platform;
    }
    getClsID(){
        return this._clsid;
    }
    /**
     * 设置login信息
     */
    setLoginJson(json){
        this._loginJson = json;
        console.log("================login=================");
        console.log(json);
        console.log("======================================");
        if(json)
            this._clsid = json.clsid || 0;
        //cls做一个时间转换
        if(json && json.cls){
            for(let o of json.cls){
                o.lvdate = new Date(o.lastcommit);
            }
        }
        //将readmsg转换为数组,它可以是"1,2" = [1,2]
        if(json.readmsg && json.message){
            if(typeof json.readmsg === 'string'){
                json.readmsg = json.readmsg.split(',').map((item)=>{
                    try{
                        return Number(item);
                    }catch(e){
                        return 0;
                    }
                });
                let ids = [];
                for(let msg of json.message){
                    ids.push(msg.id);
                }
                //将不在message中的已读标记去掉
                json.readmsg = json.readmsg.filter((value)=>{
                    return ids.includes(value);
                });
            }
        }else{
            json.readmsg = json.readmsg || [];
            json.message = json.message || [];
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
    updateLevelRank(lv,rank,blocks,best){
        if(this._loginJson && this._loginJson.lvs){
            if(!this._loginJson.lvs[lv])
                this._loginJson.lvs[lv] = {};
            this._loginJson.lvs[lv].rank = rank;
            this._loginJson.lvs[lv].blocks = blocks;
            if(best)
                this._loginJson.lvs[lv].best = best;
        }
    }
    getLoginJson(){
        return this._loginJson;
    }
    wsPassLevel(lv,rank,blocks){
        if(this._wsClsLv){
            //通知同班同学我过了一个
            this._wsClsLv.sendMsg({event:'pass',
                uid:this._uid,
                name:this._uname,
                lv,
                cls:this._loginJson.clsid,
                rank,
                blocks
            });
        }
    }
    //初始化websocket
    wsLogin(){
        if(window.LOCALHOST)
            return ;
        /*
        let addr = `ws://${location.host}/clslv`//eslint-disable-line
        if(window.LOCALHOST){ //eslint-disable-line
            addr = `ws://192.168.2.83:3000/clslv`;
        }
        let ws = new WebSocket(addr);
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
        */
    }
    notSupportWebGL(){    
        if(!this._reportDone){
            postJson('/users/report',{errmsg:'NotSupportWebGL',uid:this.getUID(),platform:this._platform},(json)=>{
                if(json.result==='ok'){
                    this._reportDone = true;
                }
            });
        }
        TextManager.load('scene/ui/notgl.md',(iserr,text)=>{
            if(!iserr)
                MessageBox.show('ok',undefined,<MarkdownElement text={text}/>,(result)=>{
                    if(window.ljAppObject)window.ljAppObject.back();
                }); 
        });
    }
    regAppTitle(cb){
        this._appTitle = cb;
    }
    appTitle(t){
        if(this._appTitle)this._appTitle(t);
    }
    //设置界面颜色simple 精简,features 功能
    setCurrentLevelComponent(t){
        this._currentLevelComponent = t;
    }
    getCurrentLevelComponent(){
        return this._currentLevelComponent;
    }
    setUIStyle(s){
        if(s==='simple' || s==='features'){
            this._uiStyle = s;
            if(this._currentLevelComponent){
                this._currentLevelComponent.setUIStyle(s);
            }
        }
    }
    setUIColor(c){
        if(this._currentLevelComponent){
            this._currentLevelComponent.setUIColor(c);
        }
    }
    getUIStyle(){
        if(this._uiStyle)return this._uiStyle;
        return 'simple';
    }
    openLevelTips(from){
        if(this._currentLevelComponent){
            this._currentLevelComponent.Help(from,null);
        }
    }
    isPad(){
        return !(this.getPlatfrom()==='windows' || window.innerWidth < 500);
    }
    //如果有临时代码块
    hasTrash(lv){
        if(this._loginJson){
            return this._loginJson.trashlv === lv && this._loginJson.trash;
        }
    }
    //返回临时代码块
    getTrash(lv){
        if(this.hasTrash(lv)){
            return this._loginJson.trash;
        }
    }
    //设置临时代码块
    setTrash(lv,method){
        if(this._loginJson){
            this._loginJson.trashlv = lv;
            this._loginJson.trash = method;
        }
        postJson('/users/trash',{
            lv,method,uid:this.getUID()
        },(json)=>{
            console.log(json);
        });
    }
    setBlocklySkin(name){
        if(this._blocklyskin != name){
            this._blocklyskin = name;
            if(this._blocklyView ){
                this._blocklyView.useSkin(name);
            }
        }
    }
    getBlocklySkin(){
        return this._blocklyskin?this._blocklyskin:'Scratch';
    }
    /**
     * FIXBUG : blockly
     * closeBlocklyMenu
     */

    getRandom(){
        if(!this._curRandom)
            this._curRandom = Math.random();
        return this._curRandom;
    }
    getCDNURL(url){
        return window.cdndomain?window.cdndomain+url:url;
    }
    getSUM(){
        let md5sum = crypto.createHash('md5');
        md5sum.update(String(this._uid));
        return md5sum.digest('hex').slice(0,6);
    }
    timeString(d){
        let hh = Math.floor(d/3600);
        let mm = Math.floor(d/60)%60;

        return `${dz2(hh)}:${dz2(mm)}:${dz2(d%60)}`;
        
        function dz2(n){
            let d = String(n);
            if(d.length==0)
                return '00';
            else if(d.length==1)
                return 0+d;
            else return d;
        }
    } 
    /**
     * 做个优化确保不是每次调用都请求网络
     */
    lvtips(cb){
        if(this._lvtipscurtime){
            if(this._lvtipscooldown && this._lvtipscooldown>0){
                this._lvtipsjson.cooldown = Math.floor(this._lvtipscooldown - ((new Date())-this._lvtipscurtime)/1000);
            }else{
                this._lvtipsjson.cooldown = 0;
            }
            cb(this._lvtipsjson);
        }else{
            postJson('/users/lvtips',{},(json)=>{
                if(json.result==='ok'){
                    this._lvtipscooldown = json.cooldown;
                    this._lvtipscurtime = new Date();
                    this._lvtipsjson = json;
                    cb(json);
                }
            })    
        }
    }
    /**
     * 重新开始请求/users/lvtips接口
     */
    resetlvtips(){
        this._lvtipscurtime = null;
    }
    /**
     * 测试vox FPS
     */
    setVoxFPS(fps){
        this._fps = (this._fps+fps)/2;
    }
    getVoxFPS(){
        return this._fps;
    }
};

export let Global = new _Global_();
