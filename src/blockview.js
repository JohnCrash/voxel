import React, {Component} from 'react';
import VoxView from './voxview';

class BlockView extends Component{
    componentDidMount(){
        this.workspace = Blockly.inject(this.blockDiv,
        {toolbox: document.getElementById('toolbox')});
    }
    render(){
        return <div style={{width:"100%",height:"100%"}} ref={ref=>this.blockDiv=ref}></div>;
    }
};

export default BlockView;