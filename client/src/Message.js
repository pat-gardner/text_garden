import React, { Component } from 'react';
import style from './style';
import marked from 'marked';

const createDOMPurify = require('dompurify');
const jsdom = require('jsdom').jsdom;
const window = jsdom('').defaultView;
const DOMPurify = createDOMPurify(window);

class Message extends Component {
 render() {
   const clean = DOMPurify.sanitize(this.props.children.toString());
 return (
 <div style={ style.message }>
 <h3>{this.props.sender}</h3>
 <p>{clean}</p>
 </div>
 )
 }
}
export default Message;
