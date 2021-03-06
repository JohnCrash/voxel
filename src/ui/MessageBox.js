import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import {Global} from '../global';
import BlocklyInterface from '../vox/blocklyinterface';
import CircularProgress from 'material-ui/CircularProgress';

console.info('Import MessageBox...');
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
            style:null,
            snackbarOpen:false,
            snackbarMsg:'',
            openLoading:false,
            contentLoading:'',
            switchContent:-1
            };
    }
    static globalNode = null;
    static globalCB = null;
    static show(type,title,content,result,style){
        MessageBox.globalNode._content = content;
        //根据type类切换到第几页
        let s = 0;
        if(type==='help'){
            s = 1;
        }
        Global.push(MessageBox.globalNode.handleClose.bind(MessageBox.globalNode));
        BlocklyInterface.pause();
        if(!style){
            let r = 9/16;
            try{
                r = window.innerWidth / window.innerHeight;
            }catch(e){}
            if(r<3/4)
                style = {width:"95%"};
        }else{
            if(style==='tips'||style==='tips_again'){
                if(style==='tips_again')type = 'again';
                style = {width:"100%",maxWidth:"100%",top:"0px",position:"fixed",transform:""};
                //点击内容也可以退出
                content = <div onClick={(event)=>{
                    //MessageBox.globalNode.setState({open: false,type:'',title:'',content:''});
                    MessageBox.globalNode.handleClose('cancel');
                }}>{content}</div>;
            }
        }

        MessageBox.globalCB = result;
        MessageBox.globalNode.setState({
            open:true,
            type:type,
            title:title,
            switchContent:s,
            content:(content instanceof Array)?content[s]:content,
            style:style
        });
    }
    static showLoading(msg){
        MessageBox.globalNode.setState({openLoading: true,contentLoading:msg});
    }
    static closeLoading(){
        setTimeout(function() {
            MessageBox.globalNode.setState({openLoading: false});
        },1);
    }
    static close(){
        if(MessageBox.globalNode)
            MessageBox.globalNode.handleClose();
    }
    handleClose(result){
        Global.pop();
        BlocklyInterface.resume();
        MessageBox.globalNode.setState({open: false,type:'',title:'',content:''},()=>{
            if(MessageBox.globalCB){
                MessageBox.globalCB(result);
                MessageBox.globalCB = null;
            }
        });
    }
    static msg(msg){
        if(MessageBox.globalNode){
            MessageBox.globalNode.setState({snackbarOpen:true,snackbarMsg:msg});
        }
    }
    handleRequestClose(){
        MessageBox.globalNode.setState({
            snackbarOpen: false,
        });
    }
    handleSwitch(){
        let s = this.state.switchContent==0?1:0;
        this.setState({
            switchContent:s,
            content:this._content[s]
        });
    }
    render(){
        let actions;
        let bodyStyle,actionsContainerStyle;
        switch(this.state.type){
            case 'okpay':
                actions = [<FlatButton
                    label="兑换金币"
                    primary="secondary"
                    onClick={this.handleClose.bind(this,'pay')}/>,
                <FlatButton
                    label="取消"
                    primary={true}
                    onClick={this.handleClose.bind(this,'ok')}/>];
                break;
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
            case 'help':
                if(this.state.switchContent===1){
                    actions = [<FlatButton
                        label={"界面说明"}
                        primary={true}
                        onClick={this.handleSwitch.bind(this)}/>]; 
                }else{
                    actions = [<FlatButton
                        label="确定"
                        primary={true}
                        onClick={this.handleClose.bind(this,'ok')}/>]; 
                }           
                break;
            case 'again':
                actions = [<FlatButton
                    label="再玩一次"
                    primary={true}
                    onClick={this.handleClose.bind(this,'again')}/>,
                <FlatButton
                    label="下一关"
                    primary={true}
                    onClick={this.handleClose.bind(this,'next')}/>];
                break;
            case 'check':
                actions = [<FlatButton
                    label="以后不再显示"
                    secondary={true}
                    onClick={this.handleClose.bind(this,'noagain')}/>,
                <FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleClose.bind(this,'ok')}/>];
                break;
            case 'ok-center':
                bodyStyle={textAlign:'center',padding:'0px'};
                actionsContainerStyle = bodyStyle;
                actions = [<FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleClose.bind(this,'ok')}/>];               
                break;
            case 'ok':
                actions = [<FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleClose.bind(this,'ok')}/>];            
            default:
                break;
        }
        return <div>
            {this.state.open?
                <Dialog
                title={this.state.title}
                actions={actions}
                modal={false}
                open={this.state.open}
                autoScrollBodyContent={true}
                contentStyle={this.state.style}
                bodyStyle={bodyStyle}
                actionsContainerStyle={actionsContainerStyle}
                repositionOnUpdate={true}
                onRequestClose={this.handleClose.bind(this,'close')}
                >
                {this.state.content}
                </Dialog>:undefined}
            <Dialog
                modal={true}
                open={this.state.openLoading}
            >
                <div style={{textAlign:"center"}}>
                    <CircularProgress/><br/>
                    <span style={{fontSize:"large",margin:"20px"}}>{this.state.contentLoading}</span>
                </div>
            </Dialog>
            <Snackbar open={this.state.snackbarOpen}
                message={this.state.snackbarMsg}
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose.bind(this)}/>
        </div>;
    }
}

export {MessageBox};