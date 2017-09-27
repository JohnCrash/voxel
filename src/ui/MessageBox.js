import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Global} from '../global';

/**
 * type
 * YESNO,OK,OKCANCEL
 */
class MessageBox extends Component{
    constructor(props){
        super(props);
        MessageBox.globalNode = this;
        this.state = {
            type: 'ok',
            open: false,
            title:'',
            content:'',
            style:null};
    }
    static globalNode = null;
    static globalCB = null;
    static show(type,title,content,result,style){
        if(!style){
            if(Global.getPlatfrom()==='android')
                style = {width:"95%"};
        }
        if(MessageBox.globalNode.state.open){
            MessageBox.globalNode.handleClose();
            setTimeout(function() {
                MessageBox.globalCB = result;
                MessageBox.globalNode.setState({
                    open:true,
                    type:type,
                    title:title,
                    content:content,
                    style:style
                });                
            }, 1000);
        }else{
            MessageBox.globalCB = result;
            MessageBox.globalNode.setState({
                open:true,
                type:type,
                title:title,
                content:content,
                style:style
            });
        }
    }
    handleClose(result){
        this.setState({open: false,type:'',title:'',content:''});
        if(MessageBox.globalCB){
            MessageBox.globalCB(result);
            MessageBox.globalCB = null;
        }
    }
    render(){
        let actions;
        switch(this.state.type){
            case 'okcancel':
                actions = [<FlatButton
                        label="取消"
                        primary={true}
                        onClick={this.handleClose.bind(this,'cancel')}/>,
                    <FlatButton
                        label="确定"
                        primary={true}
                        onClick={this.handleClose.bind(this,'ok')}/>];
                break;
            case 'yesno':
                actions = [<FlatButton
                                label="否"
                                primary={true}
                                onClick={this.handleClose.bind(this,'no')}/>,
                            <FlatButton
                                label="是"
                                primary={true}
                                onClick={this.handleClose.bind(this,'yes')}/>];
                break;
            case 'ok':
            default:
                actions = [<FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleClose.bind(this,'ok')}/>];
                break;
        }
        return <div>
            <Dialog
            title={this.state.title}
            actions={actions}
            modal={true}
            open={this.state.open}
            autoScrollBodyContent={true}
            contentStyle={this.state.style}
            onRequestClose={this.handleClose.bind(this,'close')}
            >
            {this.state.content}
            </Dialog>
        </div>;
    }
}

export {MessageBox};