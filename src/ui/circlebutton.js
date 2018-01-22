import React, {Component} from 'react';
import Bob from './bob';
import PropTypes from 'prop-types';
import {KingIcon,MovieIcon} from './myicon';
import { Global } from '../global';
import m from './mix';
//import MovieIcon from 'material-ui/svg-icons/av/play-arrow';

/**
 * opened   已经完成
 * current   当前
 * unfinished 后续关卡
 * closed   关卡还没开放
 */
const opened = {
    normal : {
        borderColor:'rgb(14, 190, 14)',
        color:'rgb(255,255,255)',
        backgroundColor:'rgb(14,190,14)'
    },
    hover : {
        borderColor:'rgb(255,164,0)',
        color:'rgb(255,255,255)',
        backgroundColor:'rgb(255,164,0)'
    }
};

const current = {
    normal : {
        borderColor:'rgb(118, 101, 160)',
        color:'rgb(255,255,255)',
        backgroundColor:'rgb(118, 101, 160)'
    },
    hover : {
        borderColor:'rgb(255,164,0)',
        color:'rgb(255,255,255)',
        backgroundColor:'rgb(255,164,0)'
    }
};

const unfinished = {
    normal : {
        borderColor:'rgb(198, 202, 205)',
        color:'rgb(91, 103, 112)',
        backgroundColor:'rgb(254, 254, 254)'
    },
    hover : {
        borderColor:'rgb(255,164,0)',
        color:'rgb(255,255,255)',
        backgroundColor:'rgb(255,164,0)'        
    }
};

const closed = {
    normal : {
        borderColor:'rgb(178, 182, 185)',
        color:'rgb(91, 103, 112)',
        backgroundColor:'rgb(178, 182, 185)'
    },
    hover : {
        borderColor:'rgb(178, 182, 185)',
        color:'rgb(91, 103, 112)',
        backgroundColor:'rgb(178, 182, 185)'        
    }
};

const locked = {
    normal : {
        borderColor:'rgb(198, 202, 205)',
        color:'rgb(91, 103, 112)',
        backgroundColor:'rgb(198, 202, 205)'
    },
    hover : {
        borderColor:'rgb(198, 202, 205)',
        color:'rgb(91, 103, 112)',
        backgroundColor:'rgb(198, 202, 205)'        
    }
}

function cc(state){
    switch(state){
        case 'opened':return opened;
        case 'unfinished':return unfinished;
        case 'current':return current;
        case 'closed':return closed;
        case 'locked':return locked;
    }
}
class CircleButton extends Component{
    constructor(props){
        super(props);
        this.state = {hovered:false,forceState:''};
    }
    handleMouseLeave(){
        this.setState({hovered:false});
    }
    handleMouseEnter(){
        this.setState({hovered:true});
    }
    onClick(){
        if(this.props.onClick)
            this.props.onClick();
    }
    getStyles(){
        let bwidth = this.context.circleRadius+"px";
        let fontSize = this.context.circleRadius/2+"px";
        const style = {
            fontFamily:'sans-serif',
            fontWeight: 'normal',
            width : bwidth,
            height : bwidth,
            borderRadius : bwidth,
            borderStyle:'solid',
            fontSize,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
           // transition:'background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out;',
            marginTop:'3px',
            marginBottom:'3px',
            borderWidth:'2px',
            margin:'4px'
        };
        return style;
    }
    getBgStyles(){
        let barHeight = this.context.circleRadius/3+"px";
        let top = ((this.context.circleRadius+12)/2-this.context.circleRadius/6) + "px";
        const bgstyle = {
            height: barHeight,
            backgroundColor: 'rgb(198, 202, 205)',
            position: 'absolute',
            left:'0px',
            right:'0px',
            top : top
        };        
        return bgstyle;
    }
    changeState(os,s){
        if(this.props.state===os){
            this.setState({forceState:s});
        }
    }
    render(){
        let {link,state,pos,disable,rank,bob,ismovie} = this.props;
        let c = cc(this.state.forceState?this.state.forceState:state);
        let hover = disable?c.normal : (this.state.hovered)?c.hover:c.normal;
        const style = this.getStyles();
        const bgstyle = this.getBgStyles();
        let bhelf = -10+this.context.circleRadius
        let kingoffset = -(this.context.circleRadius/2);
        let w = this.context.circleRadius*5/6;
        /**
         * ios cache bug ,ios 浏览器会缓存图片
         * Global.getRandom() 确保每次启动的随机数相同，避免重复加载
         */
        let userlogo = `http://image-static.lejiaolexue.com/userlogo/${bob?bob.uid:0}_99.jpg?p=${Global.getRandom()}`;
        return <div style={m({display: 'inline-block',position: 'relative',verticalAlign:"bottom"},bob?{marginTop:this.context.circleRadius*5/4+12}:{marginTop:"10px"})}>
            <div style={m(bgstyle,pos==='first'&&{left:bhelf},pos==='last'&&{right:bhelf})}></div>
            {bob?<Bob icon={userlogo} text={bob.UserName} color={bob.uid===Global.getUID()?'#E57373':'#00BCD4'} />:undefined}
            {rank==1?<div style={{position:"absolute",top:kingoffset+"px",left:"6px"}}>
                <KingIcon style={{width:this.context.circleRadius+"px",height:"100%",color:rank==1?"#ffe800":"silver"}}/>
            </div>:undefined}
            <a onClick={this.onClick.bind(this)} style={{position:'relative',textDecoration: 'none',cursor:"pointer"}}>
                <div style={m(style,hover)}
                    onMouseLeave = {this.handleMouseLeave.bind(this)}
                    onMouseEnter = {this.handleMouseEnter.bind(this)}
                >
                    {ismovie?<MovieIcon style={{width:w+"px",height:w+"px",color:state=="current"||state=="opened"?"#FFFFFF":(state=="locked"?"rgb(91, 103, 112)":"rgb(91, 103, 112)")}}/>:
                    <span>{this.props.label}</span>}
                </div>
            </a>
        </div>;
    }
};

CircleButton.propTypes={
    label : PropTypes.number,
    bob : PropTypes.object,
    onClick : PropTypes.func,
    state : PropTypes.string,
    pos : PropTypes.string
};

CircleButton.contextTypes = {
    circleRadius : PropTypes.number
};
export default CircleButton;