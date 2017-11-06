import React, {Component} from 'react';
import {CircleArrowIcon} from './myicon';
import PropTypes from 'prop-types';

const parentWidth = 48; //父节点的宽度
const width = 64;
const iconWidth = Math.floor(width*2/3)+1;

const px = "px"
const style = {
    width : width+px,
    height : width+px,
    position : "absolute",
    borderRadius : width+px,
    overflow : "hidden",
    top : -width+px,
    left : (parentWidth-width)/2+px
};
const svgStyle = {
    width:width+px,
    height:width+px
};
const iconStyle = {
    width:iconWidth+px,
    height:iconWidth+px,
    overflow:"hidden",
    position : "relative",
    borderRadius :iconWidth,
    top : -width+((width-48)/12+1)+px,
    left : Math.floor((width-iconWidth)/2)+px
};
const imgStyle = {
    width : "100%"
};
//<img src = {icon} style={imgStyle} />
class Bob extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let {icon,text} = this.props;
        return <div style={style}>
                <CircleArrowIcon style={svgStyle}/>
                <div style={iconStyle}>
                    <img src = {icon} style={imgStyle} />
                </div>
        </div>;
    }
}

Bob.propTypes = {
    icon : PropTypes.string,
    text : PropTypes.string
};
export default Bob;