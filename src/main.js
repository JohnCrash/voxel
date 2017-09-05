import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LevelSel from './levelsel';

ReactDOM.render(<MuiThemeProvider>
<LevelSel index="main" current={30} />
</MuiThemeProvider>,document.getElementById('root'));