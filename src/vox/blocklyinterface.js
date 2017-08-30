let currentBlockView;
let currentLevel;
let injectFunctions = [];
let loadState = 0;
let isNotifyDead = false;

export default class BlocklyInterface{
    /**
     * 设置当前的Blockly对象
     */
    static setCurrentBlockView(v){
        currentBlockView = v;
    }
    /**
     * 设置当前关
     */
    static setCurrentLevel(l){
        currentLevel = l;
    }
    /**
     * 当执行异步函数时，先停止blockly的执行
     * 等函数执行完成时调用blocklyContinue
     */
    static blocklyStop(msg){
        if(currentBlockView)
            currentBlockView.freeze = true;
        if(msg)console.log('stop '+msg);
    }

    static blocklyContinue(msg){
        if(currentBlockView){
            currentBlockView.freeze = false;
            if(currentBlockView.isRunning())
                currentBlockView.step();
        }
        if(msg)console.log('continue '+msg);
    }

    static clearInjectBlocklyFunction(){
        injectFunctions = [];
    }
    /**
     * 向Blockly执行环境中注入代码
     */
    static injectBlocklyFunction(name,func){
        injectFunctions.push({name,func});
    }

    static initBlocklyInterface(interpreter, scope){
        for(let o of injectFunctions){
            interpreter.setProperty(scope, o.name,interpreter.createNativeFunction(o.func));
        }
    }

    /**
     * SceneReset 场景重置
     * BlocklyToolboxReady BlocklyToolbox XML加载完成
     * OutOfBounds 角色出界
     * Dead 角色死亡
     */
    static blocklyEvent(event){
        if(event==='SceneReset'){
            loadState = 0;
        }else if(event==='SceneReady'||event==='BlocklyToolboxReady'){
            isNotifyDead = false;
            //仅当工具条和场景加载完成才开始初始化BlocklyWorkspace
            if(++loadState==2){
                if(currentBlockView){
                    currentBlockView.initWorkspace();
                }
            }
        }else if(!isNotifyDead && (event==='OutOfBounds'||event==='Dead')){
            if(currentLevel)
                currentLevel.onGameOver();
            if(currentBlockView){
                currentBlockView.freeze = true;
                currentBlockView.pause();
            }
            isNotifyDead = true;
        }else if(!isNotifyDead && event==='MissionCompleted'){
            if(currentLevel)
                currentLevel.onCompleted();
            if(currentBlockView){
                currentBlockView.freeze = true;
                currentBlockView.pause();
            }
            isNotifyDead = true;
        }else if(!isNotifyDead && event==='WrongAction'){
            if(currentLevel)
                currentLevel.onWrongAction();
            if(currentBlockView){
                currentBlockView.freeze = true;
                currentBlockView.pause();
            }
            isNotifyDead = true;            
        }else if(!isNotifyDead && event==='FallDead'){
            if(currentLevel)
                currentLevel.onFallDead();
            if(currentBlockView){
                currentBlockView.freeze = true;
                currentBlockView.pause();
            }
            isNotifyDead = true;
        }
    }
};