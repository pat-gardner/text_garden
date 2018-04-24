import React, { Component } from 'react';
import LoginForm from './LoginForm';
import CreateUserForm from './CreateUserForm';
import style from './style';
import axios from 'axios';

class LoginControl extends Component {
  constructor(props) {
    super(props);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
    axios.defaults.withCredentials = true;
  }
  handleLoginSubmit(data) {
    axios.post(this.props.url+'getuser',data)
    .then(res => {
      if (res.data.result){
        console.log('login succeed')
        /*TODO*/
      }
    })

  }
  handleCreateUserSubmit(data) {
    axios.post(this.props.url+'createuser', data)
    .catch(err => {
      console.error(err);
    });
  }
  render() {
    return (
      <div>
        <div>
          <h1>Please log in</h1>
          <LoginForm onLoginSubmit={ this.handleLoginSubmit }/>
        </div>
        <div>
          <h1>Create User</h1>
          <CreateUserForm onCreateUserSubmit={ this.handleCreateUserSubmit }/>
        </div>
      </div>
    );
  }
}

export default LoginControl
