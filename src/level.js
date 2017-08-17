import React, {Component} from 'react';
import VoxView from './voxview';
import BlockView from './blockview';

class Level extends Component{
    render(){
        return <div>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"50%",bottom:"30%"}}>
                <VoxView level='water'/>
            </div>
            <div style={{position:"absolute",left:"50%",top:"0px",right:"0px",bottom:"0px"}}>
                <BlockView/>
            </div>
        </div>;
    }
};

export default Level;