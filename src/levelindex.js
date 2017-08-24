import React from 'react';
import ReactDOM from 'react-dom';
import Level from './level';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function App(){
  let route = window.location.hash.substr(1);
  console.log(`load level "${route}"`);
  return <MuiThemeProvider>
    <Level level={route}/>
  </MuiThemeProvider>;
}

function render(){
  ReactDOM.render(<App />,document.getElementById('root'));
}

window.addEventListener('hashchange', render);
render();
