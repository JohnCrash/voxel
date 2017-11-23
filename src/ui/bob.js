import React, {Component} from 'react';
import {CircleArrowIcon} from './myicon';
import PropTypes from 'prop-types';

const px = "px"
const imgStyle = {
    width : "100%"
};

class Bob extends Component{
    constructor(props){
        super(props);
    }
    getStyles(){
        let width = this.context.circleRadius+12+12;
        let parentWidth = this.context.circleRadius+12;
        const style = {
            width : width+px,
            height : width+px,
            position : "absolute",
            borderRadius : width+px,
            overflow : "hidden",
            top : -width+px,
            zIndex : 1,
            left : (parentWidth-width)/2+px
        };
        return style;
    }
    getSvgStyles(){
        let width = this.context.circleRadius+12+12;
        const svgStyle = {
            width:width+px,
            height:width+px,
            color:'#00BCD4'
        };
        return svgStyle;
    }
    getIconStyles(){
        let width = this.context.circleRadius+12+12;
        let iconWidth = Math.floor(width*5/6)-6; 
        const iconStyle = {
            width:iconWidth+px,
            height:iconWidth+px,
            overflow:"hidden",
            position : "relative",
            borderRadius :iconWidth,
            top : -(width+1)+px,
            left : Math.floor((width-iconWidth)/2)+px
        };
        return iconStyle;
    }
    render(){
        let {icon,text} = this.props;
        let style = this.getStyles();
        let svgStyle = this.getSvgStyles();
        let iconStyle = this.getIconStyles();
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

Bob.contextTypes = {
    circleRadius : PropTypes.number
};
export default Bob;