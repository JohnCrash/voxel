import React, {Component} from 'react';

class SvgRibbons extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div width='100%' height='100%' viewBox="0 0 800 800" style={{position:'fixed'}}>
            <svg width='800px' height='800px'>
                <g transform="translate(400, 400)">
                    <rect x="-100" y="-100" width="200" height="200" rx="5" ry="5" 
                        style={{fill:"orange",stroke:"black",strokeWidth:'3',strokeDasharray:'10, 5'}}>
                    <animateTransform 
                        attributeType="xml"
                        attributeName="transform" type="rotate"
                        from="0" to="9000"
                        begin="0" dur="500s" 
                        fill="freeze"
                    />
                    </rect>                
                    <line x1="-400" y1="0" x2="400" y2="0" style={{stroke:"black"}} />
                    <line x1="0" y1="-400" x2="0" y2="400" style={{stroke:"black"}} />
                </g>
            </svg>
        </div>;
    }
};

export default SvgRibbons;

