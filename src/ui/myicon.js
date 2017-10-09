import React, {Component} from 'react';
import SvgIcon from 'material-ui/SvgIcon';

function CreateIcon(props){
    return <SvgIcon viewBox="0 0 512 512" {...props}>
        <path d="M497.358 304.897l-164.764 38.608-63.984 168.601-84.885-157.452-168.116-13.676 112.302-135.919-39.918-177.054 154.292 73.448 143.445-95.749-16.945 181.313z" />
    </SvgIcon>;
}

export {
    CreateIcon
};