import React, {Component} from 'react';
import CircleButton from './ui/circlebutton';
import {Global} from './global';
import PropTypes from 'prop-types';

const style = {
    width: "100%",
    display:'inline-flex',
    flexDirection:'row',
    justifyContent:'center'
};

class LevelOf extends Component{
    constructor(props){
        super(props);
    }

    /**
     * 使用context传递style信息
     */
    getChildContext(){
        let r = Global.getPlatfrom()==="windows"?39:Math.floor((window.innerWidth*0.9-32)/10-12);
        return {
            circleRadius : r
        }
    }    
    render(){
        let bl = [];
        let title = '';
        //this.props.level 当前完成的
        let maxpasslevel = Global.getMaxPassLevel();
       // let maxpasslevelName = Global.levelToLeveName(maxpasslevel);
        let info = Global.appGetLevelInfo(this.props.level);
        if(info){
            /**
             * props.other 是一个数组，表示同班的其他进度
             * [ uid | UserName | lv | lastcommit ]
             * 重新映射为以lv为key的对象
             */
            let others = {};
            if(this.props && this.props.other){
                for(let o of this.props.other){
                    //这里最近的
                    if(!others[o.lv] || (others[o.lv] && others[o.lv].lvdate > o.lvdate))
                        others[o.lv] = o;
                }
            }      
            function lvtoid(lv){
                return others[lv];
            }         
           // let current = info.begin+info.current+1;
            let closed = info.closed;
            title = info.name;
            for(let i=info.begin;i<=info.end;i++){
                let s;
                if(i===maxpasslevel){
                    s = 'current';
                }else if(i>=closed)
                    s = 'closed';
                else if(i<maxpasslevel){
                    s = 'opened';
                }else if(i>maxpasslevel)
                    s = 'unfinished';            
                if(i===info.begin)
                    bl.push(<CircleButton key={i} label={i} bob={lvtoid(i-1)} pos='first' state={s} disable={true}/>);
                else if(i===info.end)
                    bl.push(<CircleButton key={i} label={i} bob={lvtoid(i-1)} pos='last' state={s} disable={true}/>);
                else
                    bl.push(<CircleButton key={i} label={i} bob={lvtoid(i-1)} state={s} disable={true}/>);
            }
        }
        return <div style={style}>
            <div style={{display:"inline-block"}}>{bl}</div>
        </div>
    }
};

LevelOf.defaultProps = {
    other : []
};

LevelOf.propTypes = {
    level : PropTypes.string,
    other : PropTypes.array,
};

LevelOf.childContextTypes = {
    circleRadius : PropTypes.number 
};

export default LevelOf;