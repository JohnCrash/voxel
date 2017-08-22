import React, {Component} from 'react';
import VoxView from './voxview';
var BlockInterface = require('./blocks');

const toolbox = `<xml>
    <block type="controls_if"></block>
    <block type="controls_repeat_ext"></block>
    <block type="logic_compare"></block>
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="text"></block>
    <block type="text_print"></block>
    <block type="forward"></block>
</xml>`;

//document.getElementById('toolbox')

class BlockView extends Component{
    componentDidMount(){
        this.workspace = Blockly.inject(this.blockDiv,
        {toolbox: toolbox});
        this.highlightPause = false;
        this.workspace.addChangeListener((event)=>{
            this.reset();
        });
    }
    /**
     * 向执行环境注入代码
     */
    initFunc(interpreter, scope){
        BlockInterface(interpreter,scope);
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
    /**
     * 
     */
    run(){
        var code = Blockly.JavaScript.workspaceToCode(this.workspace);
        var myInterpreter = new Interpreter(code,this.initFunc.bind(this));
        myInterpreter.run();
    }
    /**
     * 单步执行,代码开始时调用cb('begin'),结束时调用cb('end')
     */
    step(cb){
        if(!this.myInterpreter){
            Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
            Blockly.JavaScript.addReservedWords('highlightBlock');
            var code = Blockly.JavaScript.workspaceToCode(this.workspace);
            this.myInterpreter = new Interpreter(code,this.initFunc.bind(this));
            setTimeout(()=>{
                console.log('ready to execute the following code\n');
                console.log(code);
                this.step();
            },1);
            if(cb)cb('begin');
            return;
        }
        this.highlightPause = false;
        do{
            try{
                var hasMoreCode = this.myInterpreter.step();
            }finally{
                if (!hasMoreCode) {
                    console.log('Program complete');
                    this.workspace.highlightBlock(null);
                    this.myInterpreter = null;
                    if(cb)cb('end');
                    return;
                }
            }
        }while(hasMoreCode && !this.highlightPause);
    }
    /**
     * 重置执行环境
     */
    reset(){
        this.workspace.highlightBlock(null);
        this.myInterpreter = null;
    }
    render(){
        return <div style={{width:"100%",height:"100%"}} ref={ref=>this.blockDiv=ref}></div>;
    }
};

export default BlockView;