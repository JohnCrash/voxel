import React, {Component} from 'react';
//import { DefaultPlayer as Video } from 'react-html5video';
//import 'react-html5video/dist/styles.css';
//import ReactPlayer from 'react-player'

class LevelVideo extends Component{
    onEnded=(event)=>{
        if(this.props.onEnded){
            this.props.onEnded(true);
        }
    }
    onCanPlay=(event)=>{
        if(this._video)this._video.play();
    }
    onError=(event)=>{
        if(this.props.onEnded){
            this.props.onEnded(false);
        }
    }
    onPlaying=(event)=>{
        console.log('===>onPlaying');
    }
    render(){
        //return <ReactPlayer url='media/test.mp4' playing />
        let {open,src,poster} = this.props;
        return <div style={{position:"fixed",
                display:open?"block":"none",
                zIndex:9999,
                top:0,
                width:"100%",
                height:"100%",
                backgroundColor:"black"}}>
            <video autoplay="autoplay"
                width="100%" height="100%" 
                poster={poster}
                src={src}
                ref={ref=>this._video=ref}
                loop={false}
                onError={this.onError.bind(this)}
                onCanPlay={this.onCanPlay.bind(this)}
                onEnded={this.onEnded.bind(this)}
                onPlaying={this.onPlaying.bind(this)}>
                Your browser does not support the video tag.
            </video>
        </div>;
        /*
        return (
            <Video autoPlay loop muted
                id = 'video'
                width="100%"
                height="100%"
                controls={['PlayPause', 'Seek', 'Time', 'Volume']}
                poster="http://sourceposter.jpg"
                onCanPlayThrough={() => {
                    // Do stuff
                }}>
                <source src="media/test.mp4" type="video/mp4" />
            </Video>
        ); */  
    }
}

export default LevelVideo;