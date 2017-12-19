import React, {Component} from 'react';
import SvgIcon from 'material-ui/SvgIcon';

function IconStep(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M32 18v-2h-6.040c-0.183-2.271-0.993-4.345-2.24-6.008h5.061l2.189-8.758-1.94-0.485-1.811 7.242h-5.459c-0.028-0.022-0.056-0.043-0.084-0.064 0.21-0.609 0.324-1.263 0.324-1.944 0-3.305-2.686-5.984-6-5.984s-6 2.679-6 5.984c0 0.68 0.114 1.334 0.324 1.944-0.028 0.021-0.056 0.043-0.084 0.064h-5.459l-1.811-7.242-1.94 0.485 2.189 8.758h5.061c-1.246 1.663-2.056 3.736-2.24 6.008h-6.040v2h6.043c0.119 1.427 0.485 2.775 1.051 3.992h-3.875l-2.189 8.757 1.94 0.485 1.811-7.243h3.511c1.834 2.439 4.606 3.992 7.708 3.992s5.874-1.554 7.708-3.992h3.511l1.811 7.243 1.94-0.485-2.189-8.757h-3.875c0.567-1.217 0.932-2.565 1.051-3.992h6.043z" />
    </SvgIcon>;
}

function EmbedIcon(props){
    return <SvgIcon viewBox="0 0 40 32" {...props}>
        <path d="M26 23l3 3 10-10-10-10-3 3 7 7z"></path>
        <path d="M14 9l-3-3-10 10 10 10 3-3-7-7z"></path>
        <path d="M21.916 4.704l2.171 0.592-6 22.001-2.171-0.592 6-22.001z"></path>
    </SvgIcon>;    
}

function IconRotateLeft(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M8.192 0c-3.554 6.439-4.153 16.259 9.808 15.932v-7.932l12 12-12 12v-7.762c-16.718 0.436-18.58-14.757-9.808-24.238z"></path>
    </SvgIcon>;
}

function IconReplay(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M27.802 5.197c-2.925-3.194-7.13-5.197-11.803-5.197-8.837 0-16 7.163-16 16h3c0-7.18 5.82-13 13-13 3.844 0 7.298 1.669 9.678 4.322l-4.678 4.678h11v-11l-4.198 4.197z"></path>
        <path d="M29 16c0 7.18-5.82 13-13 13-3.844 0-7.298-1.669-9.678-4.322l4.678-4.678h-11v11l4.197-4.197c2.925 3.194 7.13 5.197 11.803 5.197 8.837 0 16-7.163 16-16h-3z"></path>
    </SvgIcon>;
}

function IconPlayArrow(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 9l12 7-12 7z"></path>
        </SvgIcon>;
}

function IconHelp(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M14 22h4v4h-4zM22 8c1.105 0 2 0.895 2 2v6l-6 4h-4v-2l6-4v-2h-10v-4h12zM16 3c-3.472 0-6.737 1.352-9.192 3.808s-3.808 5.72-3.808 9.192c0 3.472 1.352 6.737 3.808 9.192s5.72 3.808 9.192 3.808c3.472 0 6.737-1.352 9.192-3.808s3.808-5.72 3.808-9.192c0-3.472-1.352-6.737-3.808-9.192s-5.72-3.808-9.192-3.808zM16 0v0c8.837 0 16 7.163 16 16s-7.163 16-16 16c-8.837 0-16-7.163-16-16s7.163-16 16-16z"></path>        
        </SvgIcon>;
}

function IconRotateRight(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M14 24.238v7.762l-12-12 12-12v7.932c13.961 0.327 13.362-9.493 9.808-15.932 8.772 9.482 6.909 24.674-9.808 24.238z"></path>
        </SvgIcon>;
}

function IconPause(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM10 10h12v12h-12z"></path>
        </SvgIcon>;
}

function VolumeMediumIcon(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
            <path d="M22.485 25.985c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 4.094-4.094 4.094-10.755 0-14.849-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c2.55 2.55 3.954 5.94 3.954 9.546s-1.404 6.996-3.954 9.546c-0.293 0.293-0.677 0.439-1.061 0.439v0zM17.157 23.157c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.534-2.534 2.534-6.658 0-9.192-0.586-0.586-0.586-1.536 0-2.121s1.535-0.586 2.121 0c3.704 3.704 3.704 9.731 0 13.435-0.293 0.293-0.677 0.439-1.061 0.439z"></path>
            <path d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"></path>
        </SvgIcon>;
}

function VolumeMuteIcon(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
            <path d="M30 19.348v2.652h-2.652l-3.348-3.348-3.348 3.348h-2.652v-2.652l3.348-3.348-3.348-3.348v-2.652h2.652l3.348 3.348 3.348-3.348h2.652v2.652l-3.348 3.348 3.348 3.348z"></path>
            <path d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"></path>        
        </SvgIcon>;
}

function CreateIcon(props){
    return <SvgIcon viewBox="0 0 32 32" {...props}>
            <path fill="#999" d="M32 16.076c0 8.837-7.146 16-15.962 16s-15.962-7.163-15.962-16c0-8.837 7.146-16 15.962-16s15.962 7.163 15.962 16z"></path>
            <path fill="#fff" d="M7.373 9.501h17.634v6.309h-17.634v-6.309z"></path>
            <path fill="#fff" d="M7.373 16.652h14.594v6.309h-14.594v-6.309z"></path>
            <path fill="#999" d="M11.717 16.29c0 0.674-0.635 1.22-1.418 1.22s-1.418-0.546-1.418-1.22c0-0.674 0.635-1.22 1.418-1.22s1.418 0.546 1.418 1.22z"></path>
            <path fill="#fff" d="M11.439 22.955c0 0.63-0.527 1.14-1.178 1.14s-1.178-0.51-1.178-1.14c0-0.63 0.527-1.14 1.178-1.14s1.178 0.51 1.178 1.14z"></path>
            <path fill="#fff" d="M11.477 15.768c0 0.63-0.527 1.14-1.178 1.14s-1.178-0.51-1.178-1.14c0-0.63 0.527-1.14 1.178-1.14s1.178 0.51 1.178 1.14z"></path>
            <path fill="#fff" d="M7.373 9.501h17.634v6.309h-17.634v-6.309z"></path>        
        </SvgIcon>;
}

function CircleArrowIcon(props){
    return <SvgIcon viewBox="0 0 768 768" {...props}>
        <path d="M704.458 320.458c0 176.982-143.476 320.458-320.458 320.458s-320.458-143.476-320.458-320.458c0-176.982 143.476-320.458 320.458-320.458s320.458 143.476 320.458 320.458z"></path>
        <path d="M271.873 620.936l114.135-2.066 114.154-1.368-54.691 75.417-55.5 75.081-59.44-73.354z"></path>
        </SvgIcon>;
}    

function KingIcon(props){
//    return <SvgIcon viewBox="0 0 378 512" {...props}>
//        <path d="M35.124 184.799l-24.049-130.372 107.588 48.098 75.945-102.525 72.147 105.058 106.322-60.755-20.252 139.232z"></path>
//    </SvgIcon>;
    return <SvgIcon viewBox="0 0 32 32" {...props}>
            <path fill="#f9ba55" d="M12.128 17.533h-6.186s3.068-4.383 3.068-7.318c0 2.893 3.118 7.318 3.118 7.318z"></path>
            <path fill="#ffee4d" d="M16 4.662v22.804h-6.964v-11.194c6.115-0.595 6.964-11.61 6.964-11.61z"></path>
            <path fill="#f9d53d" d="M9.036 16.272v11.194h-5.129c0.982-9.666-2.431-18.274-2.523-18.508 0.125 0.225 4.146 7.339 7.131 7.339 0.179 0 0.354-0.008 0.52-0.025z"></path>
            <path fill="#f9ba55" d="M7.838 10.363c0 0.673 0.546 1.219 1.219 1.219s1.219-0.546 1.219-1.219v0c0-0.673-0.546-1.219-1.219-1.219s-1.219 0.546-1.219 1.219v0z"></path>
            <path fill="#f9d53d" d="M0.163 9.224c0 0.923 0.748 1.67 1.67 1.67s1.67-0.748 1.67-1.67v0c0-0.923-0.748-1.67-1.67-1.67s-1.67 0.748-1.67 1.67v0z"></path>
            <path fill="#f9ba55" d="M19.874 17.533h6.186s-3.068-4.383-3.068-7.318c0 2.893-3.118 7.318-3.118 7.318z"></path>
            <path fill="#ffee4d" d="M16.003 4.662v22.804h6.964v-11.194c-6.115-0.595-6.964-11.61-6.964-11.61z"></path>
            <path fill="#f9d53d" d="M22.967 16.272v11.194h5.129c-0.982-9.666 2.431-18.274 2.523-18.508-0.125 0.225-4.146 7.339-7.131 7.339-0.179 0-0.354-0.008-0.52-0.025z"></path>
            <path fill="#f9ba55" d="M21.727 10.363c0 0.673 0.546 1.219 1.219 1.219s1.219-0.546 1.219-1.219v0c0-0.673-0.546-1.219-1.219-1.219s-1.219 0.546-1.219 1.219v0z"></path>
            <path fill="#f9d53d" d="M28.499 9.224c0 0.923 0.748 1.67 1.67 1.67s1.67-0.748 1.67-1.67v0c0-0.923-0.748-1.67-1.67-1.67s-1.67 0.748-1.67 1.67v0z"></path>
            <path fill="#f4e958" d="M13.71 4.85c0 1.264 1.025 2.29 2.29 2.29s2.29-1.025 2.29-2.29v0c0-1.264-1.025-2.29-2.29-2.29s-2.29 1.025-2.29 2.29v0z"></path>
        </SvgIcon>;
}

//<SvgIcon viewBox="0 0 1025 1024" {...props}>
//<path d="M853.043113 254.028208h-188.16525l121.790137-92.290087c23.763929-17.925378 28.578173-51.93238 10.755227-75.90117-17.822947-23.968791-51.522657-28.885466-75.184155-10.857657l-209.573272 158.76763-209.573272-158.665199c-23.763929-18.027808-57.463639-13.111133-75.286586 10.857657s-13.008703 57.975793 10.755226 75.90117l121.790137 92.187656H172.288487c-59.409823 0-107.449835 48.552166-107.449835 108.474143v488.79944c0 59.921977 48.142443 108.474142 107.449835 108.474142h680.754626c59.409823 0 107.449835-48.552166 107.449835-108.474142v-488.79944c0-59.819546-48.040012-108.474142-107.449835-108.474143z m-194.720816 372.438132L461.040712 756.246074c-20.998299 13.828148-38.001801 4.609383-38.0018-19.769131V466.36711c0-24.788236 17.105932-33.597279 38.0018-19.871561L658.322297 576.377713c20.998299 13.828148 20.895869 36.260478 0 50.088627z"></path>
function MovieIcon(props){
    return <SvgIcon viewBox="0 0 1024 1024" {...props}>
        <path d="M828.24 438.91H386.69l432.53-136.74c33.71-10.45 52.23-46.53 41.78-80.24l-25.16-80.24C825.4 108 789.31 89.47 755.6 99.91l-584.94 184.7c-33.71 10.45-52.23 46.53-41.78 80.24L154 445.09a57.75 57.75 0 0 0 8.55 17.09A69.38 69.38 0 0 0 145 508.23v349A69.91 69.91 0 0 0 214.81 927h613.43A69.91 69.91 0 0 0 898 857.21v-349c0-38.46-31.34-69.32-69.79-69.32z m-47.48-287.25a14 14 0 0 1 4.75 5.7l25.16 80.24a11 11 0 0 1-7.12 13.77l-39.41 12.34 16.62-112.05z m-151 43.21l66.95-21.37-17.55 116.8-66.95 21.37 17.57-116.8z m-151.46 48l66.95-21.37-17.55 116.76-66.95 21.37 17.57-116.8z m-253.04 191.3l-6.65 1.9a11 11 0 0 1-13.77-7.12l-25.64-79.77a11 11 0 0 1 7.12-13.77l56-17.57-17.06 116.33z m84-26.59l17.57-116.8 66.95-21.37-17.57 116.8-66.95 21.37z m294.41 297.69l-112.53 96.86c-7.12 6.17-16.62 9-26.11 9a49.76 49.76 0 0 1-14.24-2.37C437 804 428 792.63 428 779.81V586.1c0-12.82 9-24.21 22.79-29s29.44-2.37 39.88 6.65l112.53 96.86c14.72 12.35 14.72 32.29 0.47 44.63z"></path>
    </SvgIcon>;
}
export {
    IconStep,
    EmbedIcon,
    IconRotateLeft,
    IconReplay,
    IconPlayArrow,
    IconHelp,
    IconRotateRight,
    IconPause,
    VolumeMediumIcon,
    VolumeMuteIcon,
    CreateIcon,
    CircleArrowIcon,
    KingIcon,
    MovieIcon
};