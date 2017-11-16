/**
 * 解锁界面
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MarkdownElement from './ui/MarkdownElement';
import md from './mdtemplate';
import {TextManager} from './ui/TextManager';
import {Global} from './global';
import {postJson} from './vox/fetch';
import {ljshell} from './ljshell';

const UNLOCK = 1;
const UNLOCKING = 2;
const LOCKED = 3;
const LOCKERROR = 4;

class Unlock extends Component{
    constructor(props){
        super(props);
        this.state = {
            open:false,
            step:UNLOCK,
            errmsg:""
        }
        this.unlock_content = "";
        this.unlocking_content = "";
        this.unlockComplete_content = "";
        this.unlockFailed_content = "";
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
        TextManager.load('scene/ui/unlock_failed.md',(iserr,text)=>{
            this.unlockFailed_content = !iserr ? text : "";
        });                 
    }
    //cb(true)成功结束，cb(false)解锁失败
    open(p,cb){
        if(this._cb)return;
        this._p = p;
        this._cb = cb;
        //Global.
        let userinfo = ljshell.getUserInfo();
        this.dict = {
            gold:userinfo?userinfo.gold:-1, //金币数
            unlock_gold:this._p?this._p.unlock_gold:-1, //解锁需要的金币数
            unlock_num:this._p?this._p.seg_end-this._p.seg_begin+1:-1
        };

        this.setState({open:true,step:UNLOCK});
    }
    handleAction(result){
        if(result==='unlock'){
            //处理解锁操作...
            this.setState({step:UNLOCKING}); //加载界面
            ljshell.pay({
                action:"paygold",
                count:this.dict.unlock_gold,
                appid: 1126,
                userid: Global.getUID()
            },(b,msg)=>{
                if(b){
                    //提交结果 FIXME:存在安全风险
                    postJson('/users/unlock',{olv:this._p.seg_end},(json)=>{
                        if(json.result==='ok'){
                            this.setState({step:LOCKED}); //确定界面
                        }else{
                            this.setState({step:LOCKERROR,errmsg:(json&&json.result)?json.result:"解锁失败.."}); //解锁失败        
                        }
                    });        
                }else{
                    this.setState({step:LOCKERROR,errmsg:msg?msg:"解锁失败."}); //解锁失败
                }
            })
        }else if(result==='cancel'){
            this._cb(false);
            this._cb = null;            
            this.setState({open:false});
        }else if(result==='complete'){
            //成功解锁
            Global.setMaxUnlockLevel(this._p.seg_end);
            this._cb(true);            
            this._cb = null;
            this.setState({open:false}); //完成关闭对话
        }else if(result==='failed'){
            this._cb(false);
            this._cb = null;
            this.setState({open:false});
        }
    }
    render(){
        let userinfo = ljshell.getUserInfo();
        let dict = this.dict;
        let ContentElement;
        let actions = [];
        switch(this.state.step){
            case UNLOCK: //是否解锁界面
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
            case UNLOCKING: //解锁中
                actions = [];
                ContentElement = <MarkdownElement text={md(this.unlocking_content,dict)}/>;
                break;
            case LOCKED: //解锁完成确定界面
                dict.unlock_result = true;
                actions = [<FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleAction.bind(this,'complete')}/>];   
                ContentElement = <MarkdownElement text={md(this.unlockComplete_content,dict)}/>;
                break;
            case LOCKERROR: //解锁失败
                actions = [<FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleAction.bind(this,'failed')}/>];
                dict.unlock_result = false;
                dict.errmsg = this.state.errmsg;
                ContentElement = <MarkdownElement text={md(this.unlockFailed_content,dict)}/>;
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