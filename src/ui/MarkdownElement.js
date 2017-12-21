import React, {Component, PropTypes} from 'react';
import marked from 'marked';
import {TextManager} from './TextManager';
//require('./mui-github-markdown.css');

const styles = {
  root: {
    marginTop: 20,
    marginBottom: 20,
    padding: '0 10px',
  },
};

/**
 * 将字符串s中的<img src=""/>中的src加上cdndomain
 */
function filter(s){
  if(window.cdndomain && s){
    return s.replace(/<img src="(.*?)"/g,($0,$1)=>{
      return '<img src="'+window.cdndomain+$1+'"';
    });
  }else return s;
}

class MarkdownElement extends Component {

  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    text: '',
  };

  constructor(props){
    super(props);
    this.state={
      text : ''
    }
  }
  componentWillMount() {
    if(this.props.file){
      TextManager.load(this.props.file,(iserr,text)=>{
        if(!iserr)
          this.setState({text});
      })
    }else if(this.props.text){
      this.setState({text:this.props.text});
    }
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function(code, lang) {
        return require('highlight.js').highlight(lang, code).value;
      },
    });
  }
  componentWillReceiveProps(nextProps){
    if(this.props.file!=nextProps.file){
      TextManager.load(nextProps.file,(iserr,text)=>{
        if(!iserr)
          this.setState({text});
      })
    }else if(this.props.text!=nextProps.text){
      this.setState({text:nextProps.text});
    }
  }
  render() {
    const {
      style,
      text,
    } = this.props;

    /* eslint-disable react/no-danger */
    return (
      <div
        style={Object.assign({}, styles.root, style)}
        className="markdown-body"
        dangerouslySetInnerHTML={{__html: filter(marked(this.state.text))}}
      />
    );
    /* eslint-enable */
  }
}

export default MarkdownElement;
