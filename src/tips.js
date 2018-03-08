import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import {Global} from './global';
import BlocklyInterface from './vox/blocklyinterface';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {postJson} from './vox/fetch';
import IconLock from 'material-ui/svg-icons/action/lock';
import IconTimer from 'material-ui/svg-icons/image/timer';
import {CoinIcon} from "./ui/myicon";
import level from './level';
import MarkdownElement from './ui/MarkdownElement';
import {MessageBox} from './ui/MessageBox';
import ConfirmButton from './ui/confirm-button';

const titleStyle = {
    fontWeight : 'bold',
    margin : '3px'
};

const timeStyle = {
    color : 'white',
    width:'130px',
    margin:'3px'
};

const goldStyle = {
    width:'96px',
    margin:'3px'
};

const unlockStyle = {
    width:130+96+6+'px',
    margin:'3px'
};

const dialogStyle = {
    width:"100%",maxWidth:"100%",top:"0px",position:"fixed",transform:""
};
const tips = [
    {title:'最优解法',gold:3000,unlock:'72小时',tiplv:0},
    {title:'完整答案',gold:1000,unlock:'24小时',tiplv:1},
    {title:'部分解法',gold:300,unlock:'6小时',tiplv:2},
    {title:'一点思路',gold:100,unlock:'3分钟',tiplv:3}
];
/**
 * 状态
 * lv       关卡
 * tipbit   有4个位分别表示，一点提示，部分答案，全部答案，最优解 |0|0|0|0|
 * tipcd    0,1,2,3 分别代表,最优解(0),全部答案(1),部分答案(2),一点提示(3)，正在倒计时
 * cooldown 冷却倒计时(单位秒)
 */
class Tips extends Component{
    constructor(props){
        super(props);
        this.state = {
            open:false,
            lv:0,
            tipbit:0,
            tipcd:-1,
            cooldown:-1,
            hasright:false,
            showlv:-1
        };
    }
    componentWillMount(){
        this._id = setInterval(()=>{
            let {tipcd,tipbit,cooldown} = this.state;
            if(tipcd===+tipcd && cooldown-1>=0){
                if(cooldown-1<=0)
                    this.setState({tipbit:tipbit|(1<<tipcd),
                        tipcd:-1,
                        hasright:true,
                        showlv:5-(tipcd+1)});    
                this.setState({cooldown:cooldown-1});
            }
        },1000);
    }
    componentWillUnmount(){
        clearInterval(this._id);
    }
    initCooldown(json,tiplv){
        /**
         * lv,tipcd,tipbit,cooldown,hasright,cdate
         */
        BlocklyInterface.pause();
        Global.push(this.handleClose);
        let {lv,tipcd,tipbit,cooldown,hasright} = json;
        //tipcd = 1;
        //cooldown = 89;
        //tipbit = 1<<2;
        //hasright = false;
        let showlv;
        if(tiplv===+tiplv){
            showlv = 5-(tiplv+1);
        }else{
            for(let i=0;i<4;i++){
                if(tipbit&(1<<i)){
                    showlv = 5-(i+1);
                    break;
                }
            }            
        }

        this.setState({
            open:true,
            lv,
            tipcd,
            tipbit,
            cooldown,
            hasright,
            showlv
        });
    }
    /**
     * 打开提示
     */
    open(lv){
        if(this.state.open)return;
        postJson('/users/lvtips',{lv},(json)=>{
            if(json.result==='ok'){
                this.initCooldown(json);
            }
        })
    }
    handleClose=()=>{
        Global.pop();
        BlocklyInterface.resume();
        this.setState({open:false});
    }
    onUnlock(tiplv,gold){
        let lv = this.state.lv;
        Global.resetlvtips();
        postJson('/users/opentips',{lv,tiplv,gold},(json)=>{
            if(json.result==='ok'){
                postJson('/users/lvtips',{lv},(json)=>{
                    if(json.result==='ok'){
                        if(!gold)
                            localStorage.coolv='';
                        this.initCooldown(json);
                    }else{
                        MessageBox.show('ok',undefined,<MarkdownElement text={json.result}/>,()=>{});
                    }
                });
            }else{
                MessageBox.show('ok',undefined,<MarkdownElement text={json.result}/>,()=>{});
            }
        });
    }
    render(){
        let {open,lv,tipbit,tipcd,cooldown,showlv,hasright} = this.state;
        let levelTips = Global.getLevelTips();
        let tipsrc;
        if(showlv>=0 && levelTips && levelTips[lv]){
            tipsrc = 'scene/ui/level_tips/img/'+levelTips[lv][`tip_${showlv}`];
        }
        let actions = [<FlatButton
            label="确定"
            primary={true}
            onClick={this.handleClose}/>];
        return <Dialog
            open={open}
            modal={false}
            contentStyle={dialogStyle}
            autoScrollBodyContent={true}
            actions={actions}
            onRequestClose={this.handleClose}
        >
            <div style={{textAlign:'center'}}>
                {tips.map((item,index)=>{
                    if(tipbit&(1<<item.tiplv)){
                        //已经解锁
                        let cur = showlv===5-(item.tiplv+1);
                        return <div key={index}>
                            <span style={titleStyle}>{item.title}</span>
                            <RaisedButton label={cur?'已打开':'可查看'} onClick={()=>{
                                this.setState({showlv:5-(item.tiplv+1)});
                            }} backgroundColor={cur?"#59BEC7":"#66BB6A"} labelColor='#FFFFFF' style={unlockStyle}/>
                        </div>;
                    }else if(tipcd==item.tiplv && cooldown>0){
                        //正在倒计时
                        return <div key={index}>
                            <span style={titleStyle}>{item.title}</span>
                            <RaisedButton label={Global.timeString(cooldown)} backgroundColor="#EF9A9A" labelColor='#FFFFFF' style={timeStyle} icon={<IconTimer color='#FFFFFF'/>}/>
                            <ConfirmButton onClick={this.onUnlock.bind(this,item.tiplv,true)} label={item.gold} style={goldStyle} icon={<CoinIcon  color='gold'/>}/>
                        </div>;
                    }else{
                        //未解锁也没有计时
                        return <div key={index}>
                            <span style={titleStyle}>{item.title}</span>
                            <ConfirmButton onClick={this.onUnlock.bind(this,item.tiplv,false)} disabled={!hasright} label={item.unlock} backgroundColor="#29B6F6" labelColor='#FFFFFF' style={timeStyle} icon={<IconLock color='#FFFFFF'/>}/>
                            <ConfirmButton onClick={this.onUnlock.bind(this,item.tiplv,true)} label={item.gold} style={goldStyle} icon={<CoinIcon color='gold'/>}/>
                        </div>;
                    }
                }).reverse()}
                <font color='#DC143C' size='2'><b>倒计时解锁，同一时间只能解锁一个帮助提示！</b></font>
                {tipsrc?
                [<hr />,
                <div>
                    <img width='100%' src={tipsrc}/>
                </div>]:undefined}
            </div>
        </Dialog>
    }
};

export default Tips;