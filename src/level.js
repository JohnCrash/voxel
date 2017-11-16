import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import VoxView from './voxview';
import BlockView from './blockview';
import IconButton from 'material-ui/IconButton';
import MarkdownElement from './ui/markdownelement';
import {MessageBox} from './ui/messagebox';
import {IconPlayArrow,IconPause,IconReplay,IconRotateLeft,IconRotateRight,IconHelp,IconStep} from './ui/myicon';
//import IconPlayArrow from 'material-ui/svg-icons/av/play-arrow';
//import IconPause from 'material-ui/svg-icons/av/pause';
//import IconReplay from 'material-ui/svg-icons/av/replay';
//import IconRotateLeft from 'material-ui/svg-icons/image/rotate-left';
//import IconRotateRight from 'material-ui/svg-icons/image/rotate-right';
import IconMenu from 'material-ui/svg-icons/navigation/menu';
//import IconStep from 'material-ui/svg-icons/maps/directions-walk';
//import IconHelp from 'material-ui/svg-icons/action/help';
import AddTest from 'material-ui/svg-icons/content/add';
import RemoveTest from 'material-ui/svg-icons/content/remove';
import BlocklyInterface from './vox/blocklyinterface';
import {ScriptManager} from './vox/scriptmanager';
import {TextManager} from './ui/textmanager';
import {ItemTemplate} from './vox/itemtemplate';
import {fetchJson,postJson} from './vox/fetch';
import {Global} from './global';
import Tops from './tops';
import {
    Redirect
  } from 'react-router-dom';
import MainDrawer from "./drawer";
import PropTypes from 'prop-types';

const redIcon = {color:"#F44336"};

function parserXML(id,text){
    let result;
    let regx = new RegExp(`<xml\\s+id="${id}">([^]*?)<\/xml>`,"g");
    let regx2 = new RegExp(`^<xml id="${id}">([^]*)<\/xml>$`);
    text.replace(regx,(a,t)=>{result = a});
    if(result)
        return result.replace(regx2,(a,b)=>{
            return b;
        });
}

const LOADING = 'loading';
const READY = 'ready';
const ERROR = 'error';

class Level extends Component{
    constructor(props){
        super(props);
        BlocklyInterface.setCurrentLevel(this);
        this.state={
            playPause:true,
            levelDesc:'',
            curSelectTest:-1,
            openTops:true,
            isDebug:Global.isDebug(),
            landscape:Global.getLayout()==="landscape",
            blocklytoolbox:Global.getPlatfrom()==='windows'?Global.getBlocklyToolbar():"close", //展开blockly工具条
            switchSize:false,
        }
        TextManager.load(`scene/ui/help.md`,()=>{});
    }
    componentDidMount(){
        this.onGameStart(this.props);
        Global._immLayout = ((layout)=>{
            this.setState({landscape:layout==="landscape"});
        }).bind(this);
        Global._immBlocklytoolbox = ((b)=>{
            this.setState({blocklytoolbox:Global.getPlatfrom()==='windows'?b:"close"});
        }).bind(this);
        Global._immDebug = ((b)=>{
            this.setState({isDebug:b});
        }).bind(this);        
    }    
    componentWillUnmount(){
        Global._immLayout = null;
        Global._immBlocklytoolbox = null;
        Global._immDebug = null;
    }
    Menu(){
        this.drawer.open(true);
    }
    Reset(){
        if(Global.isDebug()){
            //重新加载全部资源
            ItemTemplate.reset();
            TextManager.reset();
            ScriptManager.reset();
        }
        this.voxview.reset();
        this.blockview.reset();
        this.setState({playPause:true});
    }
    RotationRight(){
        this.voxview.RotationRight();
    }
    RotationLeft(){
        this.voxview.RotationLeft();
    }
    /**
     * 当游戏失败时
     */
    onGameOver(event){
        let md;
        let now = Date.now();
        let lj = Global.levelJson();
        switch(event){
            case 'OutOfBounds':
            case 'Dead':
                md = 'scene/ui/gameover.md';
                Global.playSound(lj.failSound);
                break;
            case 'MissionCompleted':
                Global.playSound(lj.successSound);
                this.Tops.open(this.blockview.getBlockCount(),
                this.blockview.toXML(),now-this.btms,now-this.btpms,
                ()=>{this.Reset();});
                this.btpms = now;
                return;
            case 'WrongAction':
                md = 'scene/ui/wrongaction.md';
                Global.playSound(lj.wrongSound);
                break;
            case 'FallDead':
                md = 'scene/ui/falldead.md';
                Global.playSound(lj.fallDeadSound);
                break;
        }
        this.btpms = now;
        MessageBox.show('ok',undefined,<MarkdownElement file={md}/>,(result)=>{
            this.Reset();
        });
    } 
    PlayPause(){
        if(this._ready!==READY)return;

        if(this.needReset){
            this.Reset();
            this.needReset = false;
        }
        if(this.state.playPause){
            this.voxview.readyPromise.then(()=>{
                this.blockview.run(0,(state)=>{//执行完成
                    if(state === 'end'||state === 'error'||state==='nolink'){
                        if(state === 'error'){
                            MessageBox.show('ok',undefined,<MarkdownElement file={'scene/ui/program_error.md'}/>,(result)=>{});
                        }else if(state === 'nolink'){
                            MessageBox.show('ok',undefined,<MarkdownElement file={'scene/ui/link_error.md'}/>,(result)=>{});
                        }else if(state==='end'){
                            Global.playSound(Global.levelJson().failSound);
                        }
                        this.setState({playPause:true});
                        this.needReset = true;
                    }
                });
            });
        }else{
            this.Reset();
        }
        this.setState({playPause:!this.state.playPause});
    }
    Step(){
        if(this._ready!==READY)return;

        if(this.needReset){
            this.Reset();
            this.needReset = false;
        }
        this.blockview.setEndCB((state)=>{
            if(state === 'end'||state === 'error'){
                if(state==='end'){
                    Global.playSound(Global.levelJson().failSound);
                }
                this.needReset = true;
            }
            if(state === 'error'){
                MessageBox.show('ok',undefined,<MarkdownElement file={'scene/ui/program_error.md'}/>,(result)=>{});
            }            
        });
        this.voxview.readyPromise.then(()=>{
            this.blockview.step();
        });
    }
    onGameStart(props){
        if(!this.voxview)return;
        Global.push(()=>{
            MessageBox.show("okcancel","游戏退出","你确定要返回主界面吗？",(result)=>{
                if(result==='ok'){
                    Global.popName('level');
                    location.href='#/main';
                }
            });
        },'level');
        this._ready = LOADING;
//        MessageBox.showLoading('正在加载请稍后...');
        this.loadTest(props.level);
        this.btms = Date.now();
        this.btpms = this.btms;
        if(this.voxview.readyPromise){
            this.voxview.readyPromise.then(()=>{
                TextManager.load(`scene/${props.level}.md`,(iserr,text)=>{
                    //如果voxview ready
                    this.voxview.readyPromise.then(()=>{
                        this._ready = READY;
    //                    MessageBox.closeLoading();
                        setTimeout(()=>{
                            //MessageBox.show('ok',undefined,<MarkdownElement text={text}/>,(result)=>{
                            //    console.log(result);
                            //});    
                            this.Help();
                        },200);
                    });
                });
            }).catch((err)=>{
                this._ready = ERROR;
            });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.level!=this.props.level){
            this.onGameStart(nextProps);
            this.setState({playPause:true,landscape:Global.getLayout()==="landscape"});         
        }
    }
    loadTest(name){
        if(!Global.isDebug())return;
        console.log('LOADTEST '+name);
        fetchJson(`scene/test/${name}.json`,(json)=>{
            this.testXML = [];
            let text = json.workspace;
            for(let i=0;i<100;i++){
                let it = parserXML(`${i}`,text);
                if(it)
                    this.testXML.push(it);
                else break;
            }
            this.forceUpdate();
            if(this.testXML.length>0&&this.testXML[0]){
                setTimeout(()=>{
                    if(this.blockview){
                        this.blockview.loadXML(this.testXML[0]);
                    }
                    this.setState({curSelectTest:0});
                },2000);
            }
        },(err)=>{
            this.testXML = [];
            this.setState({curSelectTest:-1});
            console.log(err);
        });
    }
    SaveTest(){
        let i = 0;
        let file = this.testXML.map(xml=>`<xml id="${i++}">\n${xml}\n</xml>`).join('\n');
        let json = {
            workspace:file
        };
        postJson(`/save?file=scene/test/${this.props.level}.json`,json,(json)=>{
            if(json.result==='ok'){//成功
                console.log('add workspace xml success');
            }else{//失败
                window.alert(json.result);
            }
        });
    }
    AddTest(){
        let xml = this.blockview.toXML();
        this.testXML = this.testXML || [];
        this.testXML.push(xml);
        this.SaveTest();
        this.setState({curSelectTest:this.testXML.length-1});
    }
    RemoveTest(){
        if(this.testXML&&this.testXML[this.state.curSelectTest]){
            this.testXML.splice(this.state.curSelectTest,1);
            let i = this.state.curSelectTest-1;
            if(this.testXML[i]){
                this.blockview.loadXML(this.testXML[i]);
                this.setState({curSelectTest:i});
            }else{
                this.blockview.initWorkspace();
                this.setState({curSelectTest:-1});
            }
            this.SaveTest();
        }
    }
    handleTestChange(event,index,value){
        if(this.testXML[index]){
            this.blockview.loadXML(this.testXML[index]);
            this.setState({curSelectTest:index});
        }
    }
    onBlockCount(count){
        if(this.blockcount)
            this.blockcount.innerText = `${count}×`;
    }
    Help(){
        let type = 'help1';
        if(Global.getMaxPassLevel()<=1)
            type = 'help';
        MessageBox.show(type,undefined,[<MarkdownElement file={`scene/ui/help.md`}/>,
            <MarkdownElement file={`scene/${this.props.level}.md`}/>],(result)=>{
            console.log(result);
        });         
    }
    toolbarEle(){
        let {playPause,curSelectTest,isDebug} = this.state;   
        let tests = [];
        if(this.testXML){
            for(let i=0;i<this.testXML.length;i++)
                tests.push(<MenuItem value={i} key={i} primaryText={`test ${i}`} />);
        }
        let debugTool = isDebug?
        [<IconButton touch={true} key='add' onClick={this.AddTest.bind(this)}>
            <AddTest />
        </IconButton>,
        <IconButton touch={true} key='remove' onClick={this.RemoveTest.bind(this)}>
            <RemoveTest />
        </IconButton> ,                       
        <SelectField
            key = 'test'
            value={curSelectTest}
            onChange={this.handleTestChange.bind(this)}
            maxHeight={200}
            style={{width:'120px'}}>
            {tests}
        </SelectField>]:[];
        let b = Global.getPlatfrom()==='windows';
        return <Toolbar>
                    <ToolbarGroup>
                        <IconButton touch={true} onClick={this.Menu.bind(this)} tooltip={b?"菜单...":undefined} tooltipPosition="top-center">
                            <IconMenu />
                        </IconButton>                          
                    </ToolbarGroup>
                    <ToolbarGroup>
                        {debugTool}
                        <IconButton touch={true} onClick={this.Help.bind(this)} tooltip={b?"打开帮助":undefined} tooltipPosition="top-center">
                            <IconHelp />
                        </IconButton>                        
                        <IconButton touch={true} onClick={this.RotationLeft.bind(this)} tooltip={b?"向左转动视角":undefined} tooltipPosition="top-center">
                            <IconRotateLeft />
                        </IconButton>  
                        <IconButton touch={true} onClick={this.RotationRight.bind(this)} tooltip={b?"向右转动视角":undefined} tooltipPosition="top-center">
                            <IconRotateRight />
                        </IconButton>                                                  
                        <IconButton touch={true} onClick={this.Reset.bind(this)} tooltip={b?"重新开始":undefined} tooltipPosition="top-center">
                            <IconReplay />
                        </IconButton>                                                
                        <IconButton touch={true} onClick={this.Step.bind(this)} tooltip={b?"单步执行你的程序":undefined} tooltipPosition="top-center">
                            <IconStep />
                        </IconButton>                        
                        <IconButton touch={true} onClick={this.PlayPause.bind(this)} iconStyle={redIcon} tooltip={b?"执行你的程序":undefined} tooltipPosition="top-center">
                            {playPause?<IconPlayArrow/>:<IconPause/>}
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>;
    }
    //横屏
    landscape(){
        let {levelDesc,curSelectTest,openTops,blocklytoolbox} = this.state;
        let {level} = this.props;
        return <div>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"50%",bottom:"56px"}}>
                <VoxView file={level} ref={ref=>this.voxview=ref}  layout="landscape"/>
            </div>
            <div style={{position:"absolute",left:"50%",top:"0px",right:"0px",bottom:"0px"}}>
                <div style={{position:"absolute",left:"0px",right:"0px",top:"0px",bottom:"0px"}}>
                <BlockView ref={ref=>this.blockview=ref} 
                    file={`scene/${level}.toolbox`} 
                    onBlockCount={this.onBlockCount.bind(this)}
                    layout="landscape"
                    toolbox={blocklytoolbox} />
                </div>
                <div style={{position:"absolute",right:"12px",top:"12px"}}>
                    <span ref={ref=>this.blockcount=ref} style={{fontSize:"24px",fontWeight:"bold",verticalAlign:"middle"}}>0×</span>
                    <img src="media/title-beta.png" style={{height:"24px",verticalAlign:"middle"}} />
                </div>
            </div>
            <div style={{position:"absolute",display:"flex",flexDirection:"column",left:"0px",right:"50%",bottom:"0px"}}>
                {this.toolbarEle()}
            </div>
            <MainDrawer key="mydrawer" ref={ref=>this.drawer=ref}/>
            <Tops ref={ref=>this.Tops=ref} level={level}/>
        </div>;
    }
    switchSize(){
        //当点击voxview 进行屏幕重新布局
        if(this._ready === READY){
            this.setState({switchSize:!this.state.switchSize},()=>{
                if(this.voxview.game)
                    this.voxview.game.setSize(this.voxview.canvas.clientWidth,this.voxview.canvas.clientHeight);
                //FIXBUG : blockview svgGroup_的父节点没有指定高度
                if(this.blockview && this.blockview.workspace && this.blockview.workspace.svgGroup_){
                    let p = this.blockview.workspace.svgGroup_.parentNode;
                    p.style = "height:100%";
                    //this.blockview.workspace.resize(); //不工作
                    //Blockly.svgResize(this.blockview.workspace); //工作
                    window.dispatchEvent(new Event('resize'));
                }
            });
        }
    }
    //竖屏
    portrait(){
        let {levelDesc,curSelectTest,openTops,blocklytoolbox,switchSize} = this.state;
        let {level} = this.props;
        return <div>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"0px",bottom:switchSize?"40%":"60%"}} onClick={this.switchSize.bind(this)} >
                <VoxView file={level} ref={ref=>this.voxview=ref} layout="portrait" style={{width:"100%",height:"100%"}}/>
            </div>
            <div style={{position:"absolute",left:"0px",top:switchSize?"60%":"40%",right:"0px",bottom:"0px"}}>
                {this.toolbarEle()}
                <div style={{position:"absolute",left:"0px",right:"0px",top:"56px",bottom:"0px"}}>
                <BlockView ref={ref=>this.blockview=ref} 
                    file={`scene/${level}.toolbox`} 
                    onBlockCount={this.onBlockCount.bind(this)}
                    layout="portrait"
                    toolbox={blocklytoolbox} />
                </div>
                <div style={{position:"absolute",right:"12px",top:"78px"}}>
                    <span ref={ref=>this.blockcount=ref} style={{fontSize:"24px",fontWeight:"bold",verticalAlign:"middle"}}>0×</span>
                    <img src="media/title-beta.png" style={{height:"24px",verticalAlign:"middle"}} />
                </div>
            </div>
            <MainDrawer key="mydrawer" ref={ref=>this.drawer=ref}/>
            <Tops ref={ref=>this.Tops=ref} level={level}/>
        </div>;
    }
    render(){
        if(Global.getMaxPassLevel()===null){
            return <Redirect to='/login' />;
        }
        //只有在调试模式
        if(Global.isDebug())
            return this.state.landscape?this.landscape():this.portrait();
        else{
            return window.innerWidth>window.innerHeight?this.landscape():this.portrait();
        }
    }
};

Level.propTypes = {
    level : PropTypes.string
};

export default Level;