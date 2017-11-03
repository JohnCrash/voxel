import React, {Component} from 'react';
import VoxView from './voxview';
import BlocklyInterface from './vox/blocklyinterface';
import {TextManager} from './ui/textmanager';
import {Global} from './global';
import en from './lang/en';
import zh from './lang/zh';
import IconButton from 'material-ui/IconButton';
//import CreateIcon from 'material-ui/svg-icons/action/build';
import Dialog from 'material-ui/Dialog';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconDec from 'material-ui/svg-icons/content/remove';
import FlatButton from 'material-ui/FlatButton';
import {CreateIcon} from './ui/myicon';
import cloneDeep from 'clone-deep';

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

//将dom中的id和x,y值给删除掉
function filterDom(dom){
    dom.removeAttribute('id');
    dom.removeAttribute('x');
    dom.removeAttribute('y');
    for(let node of dom.children){
        filterDom(node);
    }
}

const startBlockDrag = Blockly.BlockDragger.prototype.startBlockDrag;
const endBlockDrag = Blockly.BlockDragger.prototype.endBlockDrag;
const startDrag = Blockly.WorkspaceDragger.prototype.startDrag;
const endDrag = Blockly.WorkspaceDragger.prototype.endDrag;

/**
 * FIXBUG : blockly 在处理下拉菜单的时候trimOptions_修改全局的结构
 * 下面修复代码挂住trimOptions_对menuGenerator_做完整的复制。
 */
const trimOptions_ = Blockly.FieldDropdown.prototype.trimOptions_;
Blockly.FieldDropdown.prototype.trimOptions_ = function(){
    this.menuGenerator_ = cloneDeep(this.menuGenerator_);
    trimOptions_.call(this);
}

class BlockView extends Component{
    constructor(props){
        super(props);
        this._freeze = false;
        this.highlightPause = false;
        this.pauseRun = false;
        BlocklyInterface.setCurrentBlockView(this);
        Global.setCurrentBlocklyView(this);
        this.state = {
            tbopen:true,
            toolboxMode:this.props.toolbox,
            openNumInput:false,
            num:1,
        };
    }
    componentDidMount(){
        this.setState({toolboxMode:this.props.toolbox});
        this.toolboxMode = this.props.toolbox;
        if(this.props.file){
            this.load(this.props.file);
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.file!=nextProps.file){
            this.load(nextProps.file);
        }
        if(this.props.toolbox!=nextProps.toolbox){
            this.setState({toolboxMode:nextProps.toolbox});
            this.toolboxMode = nextProps.toolbox;
            this.initWorkspace();
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
        let level_top = file.replace(/(.*)\.toolbox$/,($0,level)=>{
            return `${level}-top.md`;
        });
        //提前加载{level}-top.md
        TextManager.load(level_top,(iserr,text)=>{
        });
    }
    //重新加载界面
    ResetWorkspace(){
        let d = this.toXML();
        this.initWorkspace();
        this.loadXML(d);
    }
    //取得特定类型的块数
    getBlockCountByType(name){
        let blocks = this.workspace.getAllBlocks();
        let count = 0;
        for(let block of blocks){
            if(block.type===name){
                count++;
            }
        }
        return count;
    }
    //打开或者关闭工具条上的块
    enableToolboxBlock(name,b){
        let flyout = this.workspace.getFlyout_();
        if(flyout){
            let blocks = flyout.getWorkspace().getAllBlocks();
            for(let block of blocks){
                if(block.type===name)block.setDisabled(!b);
            }
        }
    }
    //做块数限制做块数限制
    blockLimiteEvent(){
        for(let blockName in this.blockLimits){
            let c = Number(this.blockLimits[blockName]);
            let n = this.getBlockCountByType(blockName);
            if( n >= c ){
                this.enableToolboxBlock(blockName,false);
            }else{
                this.enableToolboxBlock(blockName,true);
            }
        }
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
            //块数限制
            this.blockLimits = {};
            let tree = Blockly.Options.parseToolboxTree(this.toolboxXML);
            for(let i = 0;i < tree.children.length;i++){
                let node = tree.children[i];
                let block_type = node.getAttributeNode('type');
                let limit = node.getAttributeNode('limit');
                if(block_type&&limit&&limit.value){
                    this.blockLimits[block_type.value] = limit.value;
                }
            }            
        }catch(e){
            console.log(e);
        }
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
            return;
        }

        this.workspace.addChangeListener((event)=>{
            this.blockLimiteEvent();

            if(this.toolboxMode!=="expand"){
                let flyout = this.workspace.getFlyout_();
                if(flyout)flyout.setVisible(false);
            }
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
        let _this = this;
        Blockly.WorkspaceDragger.prototype.startDrag = function(){
            BlocklyInterface.pause();
            startDrag.call(this);
        }
        Blockly.WorkspaceDragger.prototype.endDrag = function(currentDragDeltaXY){
            BlocklyInterface.resume();
            endDrag.call(this,currentDragDeltaXY);
        }
        if(this.toolboxMode!=="expand"){            
            let trashcan = this.workspace.trashcan;
            _this.setState({tbopen:true});
            if(trashcan)
                trashcan.svgGroup_.style.opacity=0;
            this.workspace.svgBackground_.onmousedown = function(e){
                let flyout = _this.workspace.getFlyout_();
                if(flyout)
                    flyout.setVisible(false);
            }
            //设置拖动挂钩监视块的拖动
            Blockly.BlockDragger.prototype.startBlockDrag = function(xy){
                BlocklyInterface.pause();
                startBlockDrag.call(this,xy);
                trashcan.svgGroup_.style.opacity=0.4;
                _this.setState({tbopen:false});
            }
            
            Blockly.BlockDragger.prototype.endBlockDrag = function(e,xy){
                BlocklyInterface.resume();
                endBlockDrag.call(this,e,xy);
                trashcan.svgGroup_.style.opacity=0;
                setTimeout(()=>{ //有个合上垃圾桶的过程
                    trashcan.svgGroup_.style.opacity=0;
                    _this.setState({tbopen:true});
                },400);
            }

            let flyout = this.workspace.getFlyout_();
            if(flyout){
                flyout.setVisible(false);
            }
            let metrics = this.workspace.getMetrics();
            let w = metrics.contentWidth - metrics.viewWidth;
            let h = metrics.contentHeight - metrics.viewHeight;
            this.workspace.scrollbar.set(w-4,h-12);
            this.workspace.scrollbar.setContainerVisible(false);
            this.workspace.updateScreenCalculationsIfScrolled();
            this.workspace.deleteAreaToolbox_ = null;
        }else{//恢复挂钩
            //拖放优化，当开始拖放的时候暂停刷新
            Blockly.BlockDragger.prototype.startBlockDrag = function(xy){
                BlocklyInterface.pause();
                startBlockDrag.call(this,xy);
            }
            Blockly.BlockDragger.prototype.endBlockDrag = function(e,xy){
                BlocklyInterface.resume();
                endBlockDrag.call(this,e,xy);
            }
        }
        //定制一个数字块输入对话栏
        if(Global.getPlatfrom()!=='windows'){
            Blockly.FieldTextInput.prototype.showEditor_ = function(opt_quietInput){
                _this.fieldTextInput = this;
                Global.push(_this.handleClose.bind(_this));
                _this.setState({openNumInput: true,num:Number(this.getValue())});
            }
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
        filterDom(dom);
        return splitXML(Blockly.Xml.domToText(dom));
    }
    loadXML(xml){
        this.workspace.clear();
        let dom = Blockly.Xml.textToDom(xmlHead(xml));
        Blockly.Xml.domToWorkspace(dom,this.workspace);
    }
    checkLink(){
        let blocks = this.workspace.getAllBlocks();
        for(let i =0;i<blocks.length;i++){
            if( !blocks[i].getParent() && blocks[i].type!=="when_start" ){
                return false;
            }
        }
        return true;
    }
    /**
     * t  执行速度ms
     * cb 执行结束回调
     */
    run(t,cb){
        if(!this.checkLink()){
            cb('nolink');
            return;
        }
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
        if(!this.checkLink()){
            cb('nolink');
            return;
        }        
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
    //打开创建对话栏
    openFlyOut(){
        if(this.workspace){
            let flyout = this.workspace.getFlyout_();
            if(flyout){
                if(flyout.isVisible_){
                    flyout.setVisible(false);
                }else{
                    flyout.setVisible(true);
                    this.workspace.deleteAreaToolbox_ = null;
                }
            }
        }
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
    add(){
        this.setState({num:this.state.num+1});
    }
    dec(){
        this.setState({num:this.state.num-1});
    }
    handleClose(result){
        Global.pop();
        if(result==='ok'){
            this.fieldTextInput.setValue(this.state.num);
        }
        this.setState({openNumInput: false});
    }    
    render(){
        let {openNumInput,num} = this.state;
        return <div style={{width:"100%",height:"100%"}} ref={ref=>this.blockDiv=ref}>
                {this.state.toolboxMode!=="expand"?<IconButton
                    onClick={this.openFlyOut.bind(this)}
                    iconStyle={{width:48,height:48,color:"#BDBDBD"}}
                    style={{display:this.state.tbopen?"inline-block":"none",
                    position:"absolute",
                    right:"12px",bottom:"12px",width:96,height:96,padding:24}}>
                    <CreateIcon />
                </IconButton>:undefined}
                <Dialog open={openNumInput} modal={true} contentStyle={{width:"200px"}}>
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <IconButton touch={true} onClick={this.dec.bind(this)}>
                            <IconDec />
                        </IconButton>
                        <div style={{fontSize:"xx-large",margin:"12px"}}>{num}</div>
                        <IconButton touch={true} onClick={this.add.bind(this)}>
                            <IconAdd />
                        </IconButton>                        
                    </div>
                    <br/>
                    <div style={{display:"flex",justifyContent:"center"}}>
                        <FlatButton
                            label="取消"
                            primary={true}
                            onClick={this.handleClose.bind(this,'cancel')}/>
                        <FlatButton
                            label="确定"
                            primary={true}
                            onClick={this.handleClose.bind(this,'ok')}/>                        
                    </div>
                </Dialog>
        </div>;
    }
};

export default BlockView;