import React, {Component} from 'react';
import CircleButton from './circlebutton';

class LevelOf extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let bl = [];
        if(typeof appGetLevelInfo !== 'undefined'){
            let info = appGetLevelInfo(this.props.level);
            if(info){
                let current = info.begin+info.current;
                let closed = info.closed;
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
        return <div>{bl}</div>
    }
};

export default LevelOf;