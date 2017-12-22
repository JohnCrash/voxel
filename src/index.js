import "babel-polyfill";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider} from 'react-redux';
import { createStore } from 'redux';
import {
    HashRouter as Router,
    Route,
    Switch
  } from 'react-router-dom';
import {Global} from './global';
import Login from './login';
import Main from './main';
import Level from './level';
import reducer from './reducer';
import {MessageBox} from './ui/MessageBox';

console.log('Game Start...');
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

console.log(navigator);
if(navigator.geolocation){
    console.log(navigator.geolocation.getCurrentPosition((pos)=>{
        console.log('YOUR POSITION:');
        console.log(pos);
    }));
}

let root = document.getElementById('root');
//禁止浏览器选择
document.onselectstart = ()=>{return false};

console.log('Platfrom : '+Global.getPlatfrom());
Global.setLayout(window.innerWidth>window.innerHeight?"landscape":"portrait");
Global.closeLoading();
const store = createStore(reducer);
function App(){
    return <Provider  store={store}>
        <MuiThemeProvider>
            <div style={{webkitUserSelect:"none",webkitTouchCallout:"none"}/*禁止ios打开选择*/}>
                <Router>
                    <Switch>
                        <Route path='/main' component={Main}/>
                        <Route path='/login' component={Login} />
                        <Route path='/level/:lv' component={props=><Level level={props.match.params.lv} />}/> 
                    </Switch>
                </Router>
                <MessageBox />
            </div>
        </MuiThemeProvider>
    </Provider>;
}

function render(){
    ReactDOM.render(<App />,root);
}

render();