import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import LevelSel from './levelsel';
import Level from './level';

let app;

/**
 * 全局函数为应用指定一个标题
 */
global.appTitle = function(t){
    app.appTitle(t);
}

class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            title : ''
        }
        app = this;
    }
    appTitle(t){
        this.setState({title:t});
    }
    render(){
        let {router} = this.props;
        let content = "未定义的页面";
        switch(router){
            case '':
            case 'main':
            content = [<AppBar key='mainbar' title={this.state.title}/>,<LevelSel key='levelselect' index='main'/>];
            break;
            case 'setting':
            break;
            default:
            {
                let m = router.match(/^level#([^]*)/);
                if(m){
                    content = <Level level={m[1]}/>;
                }
            }
            break;
        }
        return <div>{content}</div>;
    }
};

function App(){
    let route = window.location.hash.substr(1);
    console.log(`ruter "${route}"`);
    return <MuiThemeProvider>
        <Main router={route}/>
    </MuiThemeProvider>;
}

function render(){
    ReactDOM.render(<App />,document.getElementById('root'));
  }
  
  window.addEventListener('hashchange', render);
  render();