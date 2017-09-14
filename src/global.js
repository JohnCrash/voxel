import {fetchJson} from './vox/fetch';

class _Global_{
    constructor(){
        this.LevelJson = null;
        this.maxpasslv = 0;
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
    /**
     * 根据当前关卡名称得到本关卡的信息
     * @param {*} level 当前关卡名称例如:L3-1
     * current 当前段的当前关
     * next     全局的下一关
     * begin    全局本段开始
     * end      全局本段结束
     * nextName 下一关名称
     * closed   全局未开放关卡
     */
    appGetLevelInfo(level){
        if(!level || !this.LevelJson)return null;
        
            let m = level.match(/L(\d+)-(\d+)/);
            if(m){
                let b = Number(m[1])-1;
                let e = Number(m[2])-1;
                m = this.LevelJson.level[b].rang.match(/(\d+)-(\d+)/);
                if(m){
                    let begin = Number(m[1]);
                    let end = Number(m[2]);
                    let nextName;
                    let next = begin + e + 1;
                    if(e<end-begin){
                        nextName = `L${b+1}-${e+2}`;
                    }else if(this.LevelJson.level[b+2]){
                        nextName = `L${b+2}-${1}`;
                    }
                    return Object.assign({current:e,
                        begin,
                        end,
                        nextName,
                        next,
                        closed:this.LevelJson.closed},this.LevelJson.level[b]);
                }
            }
            return null;        
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
};

export let Global = new _Global_();
