import React from 'react';
import ReactDOM from 'react-dom';
import Level from './level';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
    <MuiThemeProvider>
      <Level level="water"/>
    </MuiThemeProvider>,
    document.getElementById('root'));