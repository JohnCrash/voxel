import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MarkdownElement from './ui/MarkdownElement';
import {Global} from './global';

const selectedColor = '#64B5F6';
const unselectColor = '#FFFFFF';

function m() {
    var res = {};
    for (var i = 0; i < arguments.length; ++i) {
      if (arguments[i]) {
        Object.assign(res, arguments[i]);
      };
    }; 
    return res;
}

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
        let HEIGHT = Global.getPlatfrom()==="windows"?250:180;        
        let styles = {
            width:WIDTH,height:HEIGHT,padding:12
        };        
        return <Dialog
            actions={actions}
            modal={true}
            contentStyle={Global.getPlatfrom()!=="windows"?{width:"95%"}:undefined}
            open={open}>
                <MarkdownElement file="scene/ui/select_top.md"/>
                <div style={{display:"inline-flex", display:"-webkit-flex",justifyContent:"center",width:"100%"}}>
                    <div style={m(styles,select==='boy'?{backgroundColor:selectedColor}:{backgroundColor:unselectColor})} onClick={this.onSelect.bind(this,'boy')}>
                        <img style={{width:"100%",height:"100%"}} src='scene/image/boys.png'/>
                    </div>
                    <div style={m(styles,select==='girl'?{backgroundColor:selectedColor}:{backgroundColor:unselectColor})} onClick={this.onSelect.bind(this,'girl')}>
                        <img style={{width:"100%",height:"100%"}} src='scene/image/grils.png'/>
                    </div>
                </div>
                <MarkdownElement file="scene/ui/select_bottom.md"/>
            </Dialog>
    }
};

export default SelectChar;