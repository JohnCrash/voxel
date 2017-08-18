import React, {Component, PropTypes} from 'react';
import marked from 'marked';
import {TextManager} from './textmanager';
//require('./mui-github-markdown.css');

const styles = {
  root: {
    marginTop: 20,
    marginBottom: 20,
    padding: '0 10px',
  },
};

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
        dangerouslySetInnerHTML={{__html: marked(this.state.text)}}
      />
    );
    /* eslint-enable */
  }
}

export default MarkdownElement;
