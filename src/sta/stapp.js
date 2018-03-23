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
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = createStore(reducer);

const client = new ApolloClient({
    link: new HttpLink({ uri: 'graphql' }),
    cache: new InMemoryCache(),
  });

function App(){
    return (
    <ApolloProvider client={client}>
        <Provider  store={store}>
            <MuiThemeProvider>
                <Main />
            </MuiThemeProvider>
        </Provider>
    </ApolloProvider>
    );
}

function render(){
    ReactDOM.render(<App />,root);
}

render();