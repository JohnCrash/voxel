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
import {MessageBox} from './ui/messagebox';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


let root = document.getElementById('root');
/**
 * NAVTIVE 界面
 */
if(window.native){
    if(native.quit){
        native.onBack = function(){
            Global.callTop();
        }
        if(native.registerOnBack)
            native.registerOnBack(true);
        Global.push(()=>{
            MessageBox.show("okcancel","游戏退出","你确定要退出游戏吗？",(result)=>{
                if(result==='ok'){
                    native.quit();
                }
            },undefined,true);
        },true);
    }
}

console.log('Platfrom : '+Global.getPlatfrom());
Global.setLayout(window.innerWidth>window.innerHeight?"landscape":"portrait");
Global.closeLoading();

const store = createStore(reducer);
function App(){
    return <Provider  store={store}>
        <MuiThemeProvider>
            <div>
                <Router>
                    <Switch>
                        <Route path='/main' component={Main}/>
                        <Route path='/login/:uid/:uname/:cookie' 
                            component={props=><Login uid={props.match.params.uid} uname={props.match.params.uname} cookie={props.match.params.cookie}/>}/>
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