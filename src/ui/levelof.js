import React, {Component} from 'react';
import CircleButton from './circlebutton';

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
    render(){
        let bl = [];
        let title = '';
        if(typeof appGetLevelInfo !== 'undefined'){
            let info = appGetLevelInfo(this.props.level);
            if(info){
                let current = info.begin+info.current;
                let closed = info.closed;
                title = info.name;
                for(let i=info.begin;i<=info.end;i++){
                    let s;
                    if(i===current){
                        s = 'current';
                    }else if(i>=closed)
                        s = 'closed';
                    else if(i<current){
                        s = 'opened';
                    }else if(i>current)
                        s = 'unfinished';            
                    if(i===info.begin)
                        bl.push(<CircleButton key={i} label={i} pos='first' state={s} disable={true}/>);
                    else if(i===info.end)
                        bl.push(<CircleButton key={i} label={i} pos='last' state={s} disable={true}/>);
                    else
                        bl.push(<CircleButton key={i} label={i} state={s} disable={true}/>);
                }
            }
        }
        return <div style={style}>{bl}</div>
    }
};

export default LevelOf;