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

class Level extends Component{
    constructor(props){
        super(props);
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
        this.voxview.reset();
        this.blockview.reset();
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
    PlayPause(){
        if(this.state.playPause){
            this.blockview.run(0,()=>{
                this.setState({playPause:true});
            });
        }else{
            this.blockview.reset();
        }
        this.setState({playPause:!this.state.playPause});
    }
    Step(){
        this.blockview.step();
    }
    render(){
        let {playPause,volumeOnOff,levelDesc} = this.state;
        return <div>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"50%",bottom:"30%"}}>
                <VoxView file={this.props.level} ref={ref=>this.voxview=ref}/>
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