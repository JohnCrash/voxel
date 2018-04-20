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
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

console.log('Game Start...');
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

let root = document.getElementById('root');
//禁止浏览器选择
document.onselectstart = ()=>{return false};

console.log('Platfrom : '+Global.getPlatfrom());
Global.setLayout(window.innerWidth>window.innerHeight?"landscape":"portrait");
Global.closeLoading();
const store = createStore(reducer);

const client = new ApolloClient({
    link: new HttpLink({ uri: 'graphql' }),
    cache: new InMemoryCache(),
  });

function App(){
    return <ApolloProvider client={client}>
        <Provider  store={store}>
            <MuiThemeProvider>
                <div style={{WebkitUserSelect:"none",WebkitTouchCallout:"none"}/*禁止ios打开选择*/}>
                    <Router>
                        <Switch>
                            <Route path='/main' component={Main}/>
                            <Route path='/login' component={Login} />
                            <Route path='/level/:lv/:opentips' component={props=><Level level={props.match.params.lv} opentips={props.match.params.opentips}/>}/> 
                            <Route path='/level/:lv' component={props=><Level level={props.match.params.lv}/>}/> 
                        </Switch>
                    </Router>
                    <MessageBox />
                </div>
            </MuiThemeProvider>
        </Provider>
    </ApolloProvider>;
}

function render(){
    ReactDOM.render(<App />,root);
}

render();