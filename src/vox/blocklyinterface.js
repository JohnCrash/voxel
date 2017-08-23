let currentBlockView;
let injectFunctions = [];
let loadState = 0;

export default class BlocklyInterface{
    /**
     * 设置当前的Blockly对象
     */
    static setCurrentBlockView(v){
        currentBlockView = v;
    }
    /**
     * 当执行异步函数时，先停止blockly的执行
     * 等函数执行完成时调用blocklyContinue
     */
    static blocklyStop(){
        if(currentBlockView)
            currentBlockView.freeze = true;
    }

    static blocklyContinue(){
        if(currentBlockView){
            currentBlockView.freeze = false;
            if(currentBlockView.isRunning())
                currentBlockView.step();
        }
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

    static blocklyEvent(event){
        if(event==='SceneReset'){
            loadState = 0;
        }else if(event==='SceneReady'||event==='BlocklyToolboxReady'){
            //仅当工具条和场景加载完成才开始初始化BlocklyWorkspace
            if(++loadState==2){
                if(currentBlockView){
                    currentBlockView.initWorkspace();
                }
            }
        }
    }
};