import React, {Component} from 'react';
import {CircleArrowIcon} from './myicon';
import PropTypes from 'prop-types';

const parentWidth = 48; //父节点的宽度
const width = 48;
const iconWidth = width-16;

const px = "px"
const style = {
    width : width+px,
    height : width+px,
    //position : "absolute",
    borderRadius : width+px,
    overflow : "hidden",
    marginTop : -width+px,
    marginLeft : (parentWidth-width)+px
};
const svgStyle = {
    width:width+px,
    height:width+px
};
const iconStyle = {
    width:iconWidth+px,
    height:iconWidth+px,
    overflow:"hidden",
    borderRadius :iconWidth,
    marginTop:-width+px,
    marginLeft : (parentWidth-width)+px
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