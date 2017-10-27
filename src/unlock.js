/**
 * 解锁界面
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MarkdownElement from './ui/markdownelement';
import md from './mdtemplate';
import {TextManager} from './ui/textmanager';
import {Global} from './global';
import {postJson} from './vox/fetch';

class Unlock extends Component{
    constructor(props){
        super(props);
        this.state = {
            open:false,
            step:1
        }
        this.unlock_content = "";
        this.unlocking_content = "";
        this.unlockComplete_content = "";
        this.initText();
    }

    initText(){
        TextManager.load('scene/ui/unlock.md',(iserr,text)=>{
            this.unlock_content = !iserr ? text : "";
        });
        TextManager.load('scene/ui/unlocking.md',(iserr,text)=>{
            this.unlocking_content = !iserr ? text : "";
        });
        TextManager.load('scene/ui/unlock_complete.md',(iserr,text)=>{
            this.unlockComplete_content = !iserr ? text : "";
        });           
    }
    //cb(true)成功结束，cb(false)解锁失败
    open(p,cb){
        if(this._cb)return;
        this._p = p;
        this._cb = cb;
        this._err = null;
        this.setState({open:true,step:1});
    }
    handleAction(result){
        if(result==='unlock'){
            //处理解锁操作...
            this.setState({step:2}); //加载界面
            postJson('/users/unlock',{olv:this._p.seg_end},(json)=>{
                this._err = json.result==='ok'?null:json.result;
                setTimeout(()=>{
                    this.setState({step:3}); //确定界面
                },1000);
            });
        }else if(result==='cancel'){
            this._cb(false);
            this._cb = null;            
            this.setState({open:false});
        }else if(result==='complete'){
            //成功解锁
            if(!this._err){
                Global.setMaxUnlockLevel(this._p.seg_end);
                this._cb(true);
            }else{
                this._cb(false);
            }
            
            this._cb = null;
            this.setState({open:false}); //完成关闭对话
        }
    }
    render(){
        let dict = {
            gold:300,
            unlock_gold:100,
            unlock_num:10,
            error_msg:this._err
        };
        let ContentElement;
        let actions = [];
        switch(this.state.step){
            case 1: //是否解锁界面
                actions = [<FlatButton
                    label="取消"
                    primary={true}
                    onClick={this.handleAction.bind(this,'cancel')}/>,            
                    <FlatButton
                    label="解锁"
                    primary={true}
                    onClick={this.handleAction.bind(this,'unlock')}/>];
                ContentElement = <MarkdownElement text={md(this.unlock_content,dict)}/>;
                break;
            case 2: //解锁中
                actions = [];
                ContentElement = <MarkdownElement text={md(this.unlocking_content,dict)}/>;
                break;
            case 3: //解锁完成确定界面
                actions = [<FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleAction.bind(this,'complete')}/>];   
                ContentElement = <MarkdownElement text={md(this.unlockComplete_content,dict)}/>;
                break;
        }
        return <Dialog
            actions={actions}
            modal={true}
            open={this.state.open}
            autoScrollBodyContent={true}
            contentStyle={{width:"95%"}}
        >
            {ContentElement}
        </Dialog>;
    }
}

export default Unlock;