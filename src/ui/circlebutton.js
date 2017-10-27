import React, {Component} from 'react';

/**
 * opened   已经完成
 * current   当前
 * unfinished 后续关卡
 * closed   关卡还没开放
 */
const bwidth = '36px';
const bhelf = '18px';
const style = {
    fontFamily:'sans-serif',
    fontWeight: 'normal',
    width : bwidth,
    height : bwidth,
    borderRadius : bwidth,
    borderStyle:'solid',
    fontSize:'16px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
   // transition:'background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out;',
    marginTop:'3px',
    marginBottom:'3px',
    borderWidth:'2px',
    margin:'4px'
};

const bgstyle = {
    height: '12px',
    backgroundColor: 'rgb(198, 202, 205)',
    position: 'absolute',
    left: '0px',
    right: '0px',
    top: bhelf
};

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

function m() {
    var res = {};
    for (var i = 0; i < arguments.length; ++i) {
      if (arguments[i]) {
        Object.assign(res, arguments[i]);
      };
    }; 
    return res;
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
        this.state = {hovered:false};
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
    render(){
        let {link,state,pos,disable} = this.props;
        let c = cc(state);
        let hover = disable?c.normal : (this.state.hovered)?c.hover:c.normal;
        return <div style={{display: 'inline-block',position: 'relative'}}>
            <div style={m(bgstyle,pos==='first'&&{left:bhelf},pos==='last'&&{right:bhelf})}></div>
            <a onClick={this.onClick.bind(this)} style={{position:'relative',textDecoration: 'none',cursor:"pointer"}}>
                <div style={m(style,hover)}
                    onMouseLeave = {this.handleMouseLeave.bind(this)}
                    onMouseEnter = {this.handleMouseEnter.bind(this)}
                >
                    <span>{this.props.label}</span>
                </div>
            </a>
        </div>;
    }
};

export default CircleButton;