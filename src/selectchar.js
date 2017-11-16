import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import VoxElement from './ui/VoxElement';
import MarkdownElement from './ui/MarkdownElement';
import {Global} from './global';

const selectedColor = 0x64B5F6;
const unselectColor = 0xFFFFFF;

class SelectChar extends Component{
    constructor(props){
        super(props);
        this.state = {
            open : false,
            select : "boy",
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.state.open!==nextProps.open)
            this.setState({open:nextProps.open});
    }
    componentDidMount(){
        this.setState({open:this.props.open});
    }
    handleOk(){
        this.setState({open:false});
        Global.setCharacter(this.state.select);
        Global.pushConfig();
        location.href=this.props.link;//eslint-disable-line
    }
    onSelect(c){
        this.setState({select:c});
    }
    render(){
        let actions = [<FlatButton
            label="确定"
            primary={true}
            onClick={this.handleOk.bind(this)}/>];
        let {open,select} = this.state;
        let WIDTH = Global.getPlatfrom()==="windows"?220:140;
        let HEIGHT = Global.getPlatfrom()==="windows"?300:220;        
        let styles = {
            width:WIDTH,height:HEIGHT,marginRight:12,marginLeft:12
        };        
        return <Dialog
            actions={actions}
            modal={true}
            contentStyle={Global.getPlatfrom()!=="windows"?{width:"95%"}:undefined}
            open={open}>
                <MarkdownElement file="scene/ui/select_top.md"/>
                <div style={{display:"inline-flex", display:"-webkit-flex",justifyContent:"center",width:"100%"}}>
                    <div style={styles} onClick={this.onSelect.bind(this,'boy')}>
                        <VoxElement file={'男孩'} bgcolor={select==="boy"?selectedColor:unselectColor}/>
                    </div>
                    <div style={styles} onClick={this.onSelect.bind(this,'girl')}>
                        <VoxElement file={'女孩'} bgcolor={select==="girl"?selectedColor:unselectColor}/>
                    </div>
                </div>
                <MarkdownElement file="scene/ui/select_bottom.md"/>
            </Dialog>
    }
};

export default SelectChar;