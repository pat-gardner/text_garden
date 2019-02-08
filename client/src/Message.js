import React, { Component } from 'react';
import style from './style';

const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');

const window = (new JSDOM('')).window;
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
