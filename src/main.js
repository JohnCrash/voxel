import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import LevelSel from './levelsel';
import Level from './level';
import Login from './login';

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
    componentDidMount(){
    }
    render(){
        let {router} = this.props;
        let content = "未定义的页面";
        let s = router.split('#');
        switch(s[0]){
            case '':
            case 'login':
                content = "正在登录...";
                break;            
            case 'main':
                content = [<AppBar key='mainbar' title={this.state.title}/>,<LevelSel key='levelselect' index='main' current={s[1]} />];
                break;
            case 'setting':
                break;
            case 'level':
                content = <Level level={s[1]}/>;
                break;
            default:
                break;
        }
        return <div>{content}</div>;
    }
};

function App(){
    let route = window.location.hash.substr(1);
    console.log(`ruter "${route}"`);
    return <MuiThemeProvider>
        <div>
        <Main router={route}/>
        <Login />
        </div>
    </MuiThemeProvider>;
}

function render(){
    ReactDOM.render(<App />,document.getElementById('root'));
  }
  
  window.addEventListener('hashchange', render);
  render();