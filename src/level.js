import React, {Component} from 'react';
import VoxView from './voxview';
import BlockView from './blockview';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import MarkdownElement from './ui/markdownelement';
import {MessageBox} from './ui/messagebox';
import IconPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import IconPause from 'material-ui/svg-icons/av/pause';
import IconVolumeOff from 'material-ui/svg-icons/av/volume-off';
import IconVolumeOn from 'material-ui/svg-icons/av/volume-up';
import IconReplay from 'material-ui/svg-icons/av/replay';
import IconRotateLeft from 'material-ui/svg-icons/image/rotate-left';
import IconRotateRight from 'material-ui/svg-icons/image/rotate-right';
import IconMenu from 'material-ui/svg-icons/navigation/menu';
import IconStep from 'material-ui/svg-icons/maps/directions-walk';
import AddTest from 'material-ui/svg-icons/content/add';
import RemoveTest from 'material-ui/svg-icons/content/remove';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import BlocklyInterface from './vox/blocklyinterface';
import {ScriptManager} from './vox/scriptmanager';
import {TextManager} from './ui/textmanager';
import {ItemTemplate} from './vox/itemtemplate';
import {fetchJson,postJson} from './vox/fetch';
import Tops from './tops';

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

class Level extends Component{
    constructor(props){
        super(props);
        BlocklyInterface.setCurrentLevel(this);
        this.state={
            playPause:true,
            volumeOnOff:true,
            levelDesc:'',
            curSelectTest:-1,
            openTops:true
        }
    }
    Menu(){
        MessageBox.show('ok',undefined,<MarkdownElement file={`scene/${this.props.level}.md`}/>,(result)=>{
            console.log(result);
        },{width:"100%",maxWidth: 'none'});
    }
    Reset(){
        //重新加载全部资源
        ItemTemplate.reset();
        TextManager.reset();
        ScriptManager.reset();

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
    VolumeOnOff(){
        if(this.state.volumeOnOff){
            //off
        }else{
            //on
        }
        this.setState({volumeOnOff:!this.state.volumeOnOff});
    }
    /**
     * 当游戏失败时
     */
    onGameOver(event){
        let md;
        switch(event){
            case 'OutOfBounds':
            case 'Dead':
                md = 'scene/gameover.md';
                break;
            case 'MissionCompleted': 
                this.Tops.open();
                return;
            case 'WrongAction':
                md = 'scene/wrongaction.md';
                break;
            case 'FallDead':
                md = 'scene/falldead.md';
                break;
        }
        MessageBox.show('ok',undefined,<MarkdownElement file={md}/>,(result)=>{
            this.Reset();
        });
    } 
    PlayPause(){
        if(this.state.playPause){
            this.blockview.run(0,()=>{
                this.setState({playPause:true});
                //this.Reset();
            });
        }else{
            this.Reset();
        }
        this.setState({playPause:!this.state.playPause});
    }
    Step(){
        this.blockview.step();
    }

    componentDidMount(){
        this.loadTest(this.props.level);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.level!=this.props.level){
            this.loadTest(nextProps.level);
        }
    }
    loadTest(name){
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
                    this.blockview.loadXML(this.testXML[0]);
                    this.setState({curSelectTest:0});
                },600);
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
    render(){
        let {playPause,volumeOnOff,levelDesc,mute,curSelectTest,openTops} = this.state;
        let {level} = this.props;

        let tests = [];
        if(this.testXML){
            for(let i=0;i<this.testXML.length;i++)
                tests.push(<MenuItem value={i} key={i} primaryText={`test ${i}`} />);
        }
        return <div>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"50%",bottom:"30%"}}>
                <VoxView file={level} ref={ref=>this.voxview=ref} mute={!volumeOnOff}/>
            </div>
            <div style={{position:"absolute",left:"50%",top:"0px",right:"0px",bottom:"0px"}}>
                <BlockView ref={ref=>this.blockview=ref} file={`scene/${level}.toolbox`}/>
            </div>
            <div style={{position:"absolute",display:"flex",flexDirection:"column",left:"0px",top:"70%",right:"50%",bottom:"0px"}}>
                <Toolbar>
                    <ToolbarGroup>
                        <IconButton touch={true} onClick={this.Menu.bind(this)}>
                            <IconMenu />
                        </IconButton>                          
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconButton touch={true} onClick={this.AddTest.bind(this)}>
                            <AddTest />
                        </IconButton>
                        <IconButton touch={true} onClick={this.RemoveTest.bind(this)}>
                            <RemoveTest />
                        </IconButton>                        
                        <SelectField
                            value={curSelectTest}
                            onChange={this.handleTestChange.bind(this)}
                            maxHeight={200}
                            style={{width:'120px'}}
                        >
                            {tests}
                        </SelectField>
                        <IconButton touch={true} onClick={this.RotationLeft.bind(this)}>
                            <IconRotateLeft />
                        </IconButton>  
                        <IconButton touch={true} onClick={this.RotationRight.bind(this)}>
                            <IconRotateRight />
                        </IconButton>                                                  
                        <IconButton touch={true} onClick={this.VolumeOnOff.bind(this)}>
                            {volumeOnOff?<IconVolumeOn />:<IconVolumeOff />}
                        </IconButton>
                        <IconButton touch={true} onClick={this.Reset.bind(this)}>
                            <IconReplay />
                        </IconButton>                                                
                        <IconButton touch={true} onClick={this.PlayPause.bind(this)}>
                            {playPause?<IconPlayArrow />:<IconPause />}
                        </IconButton>
                        <IconButton touch={true} onClick={this.Step.bind(this)}>
                            <IconStep />
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <div style={{width:"100%",height:"100%",overflowY: "auto"}}>
                    <MarkdownElement file={`scene/${level}.md`}/>
                </div>
            </div>
            <MessageBox/>
            <Tops ref={ref=>this.Tops=ref} level={level}/>
        </div>;
    }
};

export default Level;