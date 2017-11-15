/**
 * 后台数据统计界面
 */
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
  import reducer from './reducer';
import Main from './main';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = createStore(reducer);

function App(){
    return <Provider  store={store}>
        <MuiThemeProvider>
            <Main />
        </MuiThemeProvider>
    </Provider>;
}

function render(){
    ReactDOM.render(<App />,root);
}

render();