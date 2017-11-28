import React, {Component} from 'react';

const FixStyle = {
    position : 'fixed',
    right : '12px',
    top : '16px',
    zIndex : 1100,
};

class FloatButton extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return <div style={FixStyle}>
            <img {...this.props} />
        </div>;
    }
}

export default FloatButton;