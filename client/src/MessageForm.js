import React, { Component } from 'react';
import style from './style';

class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = { target: '', message: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTargetChange = this.handleTargetChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }
  handleTargetChange(e) {
    this.setState({ target: e.target.value });
  }
  handleMessageChange(e) {
    this.setState({ message: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    let target = this.state.target;
    let message = this.state.message;
    if (!target || !message) {
      alert('fail to send message');
      return;
    }
    this.props.onSendMessageSubmit({ target: target, message: message });
    this.setState({ target: '', message: '' });
  }

  render() {
    return (
      <form style={ style.loginForm } onSubmit={ this.handleSubmit }>
      <input
      type='text'
      placeholder='Target'
      style={ style.loginFormUser}
      value={ this.state.target }
      onChange={ this.handleTargetChange }/>

      <input
      type='text'
      placeholder='Message'
      style={ style.loginFormPass}
      pattern = "[a-zA-Z ]+"
      value={ this.state.message }
      onChange={ this.handleMessageChange }/>

      <input
      type='submit'
      value='Send Message' />
      </form>
    )
  }
}

export default MessageForm;
