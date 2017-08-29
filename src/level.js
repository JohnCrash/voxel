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
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import BlocklyInterface from './vox/blocklyinterface';
import {ScriptManager} from './vox/scriptmanager';
import {TextManager} from './ui/textmanager';
import {ItemTemplate} from './vox/itemtemplate';

class Level extends Component{
    constructor(props){
        super(props);
        BlocklyInterface.setCurrentLevel(this);
        this.state={
            playPause:true,
            volumeOnOff:true,
            levelDesc:'',
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
    onGameOver(){
        MessageBox.show('ok',undefined,<MarkdownElement file={`scene/gameover.md`}/>,(result)=>{
            this.Reset();
        });
    }
    /**
     * 当游戏过关
     */    
    onCompleted(){
        MessageBox.show('ok',undefined,<MarkdownElement file={`scene/missioncompleted.md`}/>,(result)=>{
            this.Reset();
        });
    }
    /**
     * 当游戏失败,错误的动作用
     */
    onWrongAction(){
        MessageBox.show('ok',undefined,<MarkdownElement file={`scene/wrongaction.md`}/>,(result)=>{
            this.Reset();
        });
    } 
    PlayPause(){
        if(this.state.playPause){
            this.blockview.run(0,()=>{
                this.setState({playPause:true});
            });
        }else{
            this.Reset();
        }
        this.setState({playPause:!this.state.playPause});
    }
    Step(){
        this.blockview.step();
    }
    render(){
        let {playPause,volumeOnOff,levelDesc,mute} = this.state;
        return <div>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"50%",bottom:"30%"}}>
                <VoxView file={this.props.level} ref={ref=>this.voxview=ref} mute={!volumeOnOff}/>
            </div>
            <div style={{position:"absolute",left:"50%",top:"0px",right:"0px",bottom:"0px"}}>
                <BlockView ref={ref=>this.blockview=ref} file={`scene/${this.props.level}.toolbox`}/>
            </div>
            <div style={{position:"absolute",display:"flex",flexDirection:"column",left:"0px",top:"70%",right:"50%",bottom:"0px"}}>
                <Toolbar>
                    <ToolbarGroup>
                        <IconButton touch={true} onClick={this.Menu.bind(this)}>
                            <IconMenu />
                        </IconButton>                          
                    </ToolbarGroup>
                    <ToolbarGroup>
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
                    <MarkdownElement file={`scene/${this.props.level}.md`}/>
                </div>
            </div>
            <MessageBox/>
        </div>;
    }
};

export default Level;