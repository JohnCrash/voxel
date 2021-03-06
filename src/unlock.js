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
import { setTimeout } from 'timers';
import { MessageBox } from './ui/MessageBox';
import mix from './ui/mix';

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
        TextManager.load('scene/ui/unlock2.md',(iserr,text)=>{
            this.unlock_content2 = !iserr ? text : "";
        });        
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
        TextManager.load('scene/ui/pay.md',(iserr,text)=>{
            this.unlock_pay = !iserr ? text : "";
        });                      
    }
    //cb(true)成功结束，cb(false)解锁失败
    open(p,cb){
        if(this._cb)return;
        this._p = p;
        this._cb = cb;
        let userinfo = ljshell.getUserInfo();
        this.dict = {
            gold:userinfo?userinfo.gold:0, //金币数
            unlock_gold:this._p?this._p.unlock_gold:-1, //解锁需要的金币数
            unlock_num:this._p?this._p.seg_end-this._p.seg_begin+1:-1,
            unlock_crown:this._p?this._p.unlock_crown:-1//解锁需要的皇冠条件
        };

        this.setState({open:true,step:UNLOCK});
    }
    handleAction(result,param){
        if(result==='unlock'){
            //处理解锁操作...
            let unlock_it=()=>{
                this.setState({step:UNLOCKING}); //加载界面
                postJson('users/unlock',{param},(json)=>{
                    if(json.result==='ok'){
                        //这里做一个动画
                        if(this.props.changeButtonState){
                            let i = 0;
                            let to = ()=>{
                                if(i++ < 10){
                                    this.props.changeButtonState(json.unlock+i-1,'locked','unfinished');
                                    setTimeout(to,100);
                                }else{
                                    this.setState({open:true,step:LOCKED}); //确定界面
                                }
                            };
                            this.setState({open:false});
                            to();
                        }else
                            this.setState({step:LOCKED}); //确定界面
                    }else{
                        this.setState({step:LOCKERROR,errmsg:(json&&json.result)?json.result:"解锁失败.."}); //解锁失败        
                    }
                });
            }
            if(param==='gold'){
                //金币支付再次确认
                MessageBox.show('okcancel',"支付确认",`你确定要使用${this.dict.gold}金币来解锁后续10关吗？`,(result)=>{
                    if(result==='ok'){
                        unlock_it();
                    }});
            }
            else
                unlock_it();
        }else if(result==='cancel'){
            if(this._cb)this._cb(false);
            this._cb = null;            
            this.setState({open:false});
        }else if(result==='complete'){
            //成功解锁
            Global.setMaxUnlockLevel(this._p.seg_end);
            if(this._cb)this._cb(true);            
            this._cb = null;
            this.setState({open:false}); //完成关闭对话
        }else if(result==='failed'){
            if(this._cb)this._cb(false);
            this._cb = null;
            this.setState({open:false});
        }else if(result==='pay'){
            if(ljshell && ljshell.pay){
                console.log('====> paygold');
                ljshell.pay({action:'paygold',
                count:2000,
                autopay:1,
                appid:1126,
                userid:Global.getUID()},(b)=>{
                });
            }
            if(this._cb)this._cb(false);
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
                    onClick={this.handleAction.bind(this,'cancel')}/>];
            //        ,                
            //        <FlatButton
            //        label="解锁"
            //        primary={true}
            //        onClick={this.handleAction.bind(this,'unlock')}/>

            //    if(Global.getMaxPassLevel()-1 === Global.getLoginJson().crown)
            //        ContentElement = <MarkdownElement text={md(this.unlock_content2,dict)}/>;
            //    else
            //        ContentElement = <MarkdownElement text={md(this.unlock_content,dict)}/>;
                if(dict){
                    let bgstyle = {border:'3px dashed black',borderRadius:'8px',padding:'20px',textAlign:'center',margin:'16px'};
                    dict.crown = Global.getCrowns(); //当前的皇冠数量
                    ContentElement = <div><b style={{fontSize:'xx-large'}}>解锁后续{dict.unlock_num}个关卡</b>
                        <div style={{display:'flex',flexDirection:'column',marginTop:'32px'}}>
                            <div style={bgstyle} 
                                onClick={dict.crown>=dict.unlock_crown?this.handleAction.bind(this,'unlock','crown'):()=>{
                                    this.crown_cond.style.display = 'block';
                                }}><b style={mix({fontSize:'xx-large'},dict.crown>=dict.unlock_crown?{color:'#3cb371'}:{})}><img style={{width:'48px',verticalAlign:'bottom'}} src={Global.getCDNURL('scene/image/crown.png')}/>免费解锁</b>
                                <div style={{color:'#1e90ff'}}>需要{dict.unlock_crown}皇冠</div>
                                <div>当前你有{dict.crown}皇冠</div>
                                <div ref={ref=>{this.crown_cond=ref;}} style={{color:'red',display:'none'}}>未达到解锁条件</div>
                            </div>
                            <div style={bgstyle} 
                                onClick={dict.gold>=dict.unlock_gold?this.handleAction.bind(this,'unlock','gold'):()=>{
                                    this.gold_cond.style.display = 'block';
                                }}><b style={mix({fontSize:'xx-large'},dict.gold>=dict.unlock_gold?{color:'#3cb371'}:{})}>金币解锁</b>
                                <div style={{color:'#1e90ff'}}>需要{dict.unlock_gold}金币</div>
                                <div>当前你有{dict.gold}金币</div>
                                <div ref={ref=>{this.gold_cond=ref;}} style={{color:'red',display:'none'}}>未达到解锁条件</div>
                            </div>
                        </div>
                    </div>;
                }
                break;
            case UNLOCKING: //解锁中
                actions = [];
                ContentElement = <MarkdownElement text={md(this.unlocking_content,dict)}/>;
                break;
            case LOCKED: //解锁完成确定界面
                dict.unlock_result = true;
                dict.errmsg = '';
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