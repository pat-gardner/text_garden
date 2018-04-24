import React, { Component } from 'react';
import style from './style';
import marked from 'marked';

class Message extends Component {
 rawMarkup() {
 let rawMarkup = marked(this.props.children.toString());
 return { __html: rawMarkup };
 }
 render() {
 return (
 <div style={ style.message }>
 <h3>{this.props.sender}</h3> 
 <span dangerouslySetInnerHTML={ this.rawMarkup() } />
 </div>
 )
 }
}
export default Message;
