//CommentForm.js
import React, { Component } from 'react';
import style from './style';

class CreateUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = { user: '', pass: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }
  handleUserChange(e) {
    this.setState({ user: e.target.value });
  }
  handlePassChange(e) {
    this.setState({ pass: e.target.value });
  }
  handleSubmit(e) {

    e.preventDefault();
    let user = this.state.user;
    let pass = this.state.pass;
    if (!user || !pass) {
      alert(user);
      alert(pass);
      return;
    }
    this.props.onCreateUserSubmit({ user: user, pass: pass });
    this.setState({ user: '', pass: '' });
  }

  render() {
    return (
      <form style={ style.loginForm } onSubmit={ this.handleSubmit }>
      <input
      type='text'
      placeholder='Username'
      style={ style.loginFormUser}
      value={ this.state.user }
      onChange={ this.handleUserChange }/>

      <input
      type='password'
      placeholder='Password'
      style={ style.loginFormPass}
      value={ this.state.pass }
      onChange={ this.handlePassChange }/>

      <input
      type='submit'
      value='Create User' />
      </form>
    )
  }
}

export default CreateUserForm;
