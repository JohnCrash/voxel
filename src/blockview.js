import React, {Component} from 'react';
import VoxView from './voxview';
import BlocklyInterface from './vox/blocklyinterface';
import {TextManager} from './ui/textmanager';
import {Global} from './global';
import en from './lang/en';
import zh from './lang/zh';

function parserXML(id,text){
    let result;
    let regx = new RegExp(`<xml\\s+id="${id}">([^]*?)<\/xml>`,"g");
    text.replace(regx,(a,t)=>{result = a});
    return result;
}

function splitXML(s){
    return s.replace(/^<xml xmlns="http:\/\/www.w3.org\/1999\/xhtml">([^]*)<\/xml>$/,(a,b)=>{
        return b;
    });
}

function xmlHead(s){
    return `<xml xmlns="http://www.w3.org/1999/xhtml">${s}</xml>`;
}

class BlockView extends Component{
    constructor(props){
        super(props);
        this._freeze = false;
        this.highlightPause = false;
        this.pauseRun = false;
        BlocklyInterface.setCurrentBlockView(this);
        Global.setCurrentBlocklyView(this);
    }
    componentDidMount(){
        if(this.props.file){
            this.load(this.props.file);
        }else{
            this.toolboxXML = this.props.toolbox;
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.file!=nextProps.file||this.props.layout!=nextProps.layout){
            this.load(nextProps.file);
        }
    }
    load(file){
        TextManager.load(file,(iserr,text)=>{
            if(!iserr){
                this.toolboxXML = parserXML('toolbox',text);
                this.defaultXML = parserXML('default',text);
                BlocklyInterface.blocklyEvent('BlocklyToolboxReady');
            }
          });
    }
    //重新加载界面
    ResetWorkspace(){
        let d = this.toXML();
        this.initWorkspace();
        this.loadXML(d);
    }
    /**
     * 当toolboxXML被载入并且voxview加载结束后在初始化workspace
     */
    initWorkspace(){
        let lang = Global.getCurrentLang();
        switch(lang){
            case 'en':en();break;
            case 'zh':zh();break;
            default: en();
        }
        if(this.workspace)
            this.workspace.dispose();
        try{
            this.workspace = Blockly.inject(this.blockDiv,
                {toolbox: this.toolboxXML,
                    media: 'blockly/media/',
                    trashcan: true,
                    scrollbars: true, 
                    zoom: {
                        //controls: true,
                        //wheel: false,
                        //startScale: 1.1,
                        //maxScale: 1.2,
                        //minScale: 1,
                        //scaleSpeed: 1.2
                    }});
        }catch(e){
            this.workspace = Blockly.inject(this.blockDiv);
            console.log(`Can not inject blocly workspace \n${e}`);
        }
        this.workspace.addChangeListener((event)=>{
            if(this.props.onBlockCount)
                this.props.onBlockCount(this.getBlockCount());
            this.reset();
            if(this.runComplateCB)this.runComplateCB();
            this.runComplateCB = undefined;                        
        });
        if(this.defaultXML){
            let dom = Blockly.Xml.textToDom(this.defaultXML);
            Blockly.Xml.domToWorkspace(dom,this.workspace);
        }
    }
    /**
     * 向执行环境注入代码
     */
    initFunc(interpreter, scope){
        BlocklyInterface.initBlocklyInterface(interpreter,scope);
        var highlightBlockWrapper = (id)=>{
            id = id ? id.toString() : '';
            return interpreter.createPrimitive(this.highlightBlock(id));
        };
        interpreter.setProperty(scope, 'highlightBlock',
            interpreter.createNativeFunction(highlightBlockWrapper));
    }
    highlightBlock(id) {
        this.workspace.highlightBlock(id);
        this.highlightPause = true;
    }
    getBlockCount(){
        if(this.workspace){
            return this.workspace.getAllBlocks().length;
        }else return 0;
    }
    toXML(){
        let dom = Blockly.Xml.workspaceToDom(this.workspace);
        return splitXML(Blockly.Xml.domToText(dom));
    }
    loadXML(xml){
        this.workspace.clear();
        let dom = Blockly.Xml.textToDom(xmlHead(xml));
        Blockly.Xml.domToWorkspace(dom,this.workspace);
    }
    /**
     * t  执行速度ms
     * cb 执行结束回调
     */
    run(t,cb){
        this.runComplateCB = cb;
        this.runID = setInterval(()=>{
            this.step();
        },t||100);
    }
    get freeze(){
        return this._freeze;
    }
    set freeze(v){
        this._freeze = !!v;
    }
    /**
     * 程序是否正在执行
     */
    isRunning(){
        return !!this.myInterpreter;
    }
    pause(){
        this.pauseRun = true;
    }
    continue(){
        this.pauseRun = false;
    }
    setEndCB(cb){
        this.runComplateCB = cb;
    }
    /**
     * 单步执行,代码开始时调用cb('begin'),结束时调用cb('end')
     */
    step(cb){
        if(!this.myInterpreter){
            Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
            Blockly.JavaScript.addReservedWords('highlightBlock');
            window.LoopTrap = 1000;
            //Blockly.JavaScript.INFINITE_LOOP_TRAP to a code snippet which will be inserted into every loop and every function.
            Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if(--window.LoopTrap == 0) throw "Infinite loop.";\n';
            var code = Blockly.JavaScript.workspaceToCode(this.workspace);
            try{
                this.myInterpreter = new Interpreter(code,this.initFunc.bind(this));
            }catch(e){
                console.log('Program error');
                this.reset();
                if(cb)cb('error');
                if(this.runComplateCB)this.runComplateCB('error');
                this.runComplateCB = undefined;
                return;
            }
            setTimeout(()=>{
                console.log('ready to execute the following code\n');
                console.log(code);
                this.step(cb);
            },1);
            if(cb)cb('begin');
            if(this.runComplateCB)this.runComplateCB('begin');
            return;
        }
        if(this.freeze || this.pauseRun)return;
        this.highlightPause = false;
        do{
            try{
                var hasMoreCode = this.myInterpreter.step();
                if(cb)cb('step');
                if(this.runComplateCB)this.runComplateCB('step');                
            }finally{
                if (!hasMoreCode) {
                    console.log('Program complete');
                    this.reset();
                    if(cb)cb('end');
                    if(this.runComplateCB)this.runComplateCB('end');
                    this.runComplateCB = undefined;
                    return;
                }
            }
        }while(hasMoreCode && !this.highlightPause && !this._freeze);
    }
    /**
     * 重置执行环境
     */
    reset(){
        this.workspace.highlightBlock(null);
        this.myInterpreter = null;
        this.pauseRun = false;
        this.freeze = false;
        if(this.runID){
            clearInterval(this.runID);
            this.runID = undefined;
        }
    }
    render(){
        return <div style={{width:"100%",height:"100%"}} ref={ref=>this.blockDiv=ref}></div>;
    }
};

export default BlockView;