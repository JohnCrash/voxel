import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LevelSel from './levelsel';

ReactDOM.render(<MuiThemeProvider>
<LevelSel index='main' />
</MuiThemeProvider>,document.getElementById('root'));
