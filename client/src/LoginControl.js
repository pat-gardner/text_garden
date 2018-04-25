import React, { Component } from 'react';
import LoginForm from './LoginForm';
import CreateUserForm from './CreateUserForm';
// import style from './style';
import axios from 'axios';

class LoginControl extends Component {
  constructor(props) {
    super(props);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
    this.handleCreateUserButton = this.handleCreateUserButton.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    axios.defaults.withCredentials = true;

    this.state = {
      isLoggedIn: false,
      loginPrompt: true,
      failedAttempt: false
    };
  }
  componentDidMount() {
    axios.post(this.props.url+'checkLoggedIn').then(res=>{
      console.log('User is logged in:' + res.data.result);
      this.setState ({isLoggedIn: res.data.result});
    })
  }
  handleLoginSubmit(data) {
    axios.post(this.props.url+'getuser',data)
    .then(res => {
      if (res.data.result){
        console.log('login succeed')
        this.setState ({isLoggedIn: true});
      }
      else {
          this.setState({failedAttempt: true})
      }
    })
  }
  handleCreateUserButton(){
    this.setState({
        loginPrompt: !this.state.loginPrompt,
        failedAttempt: false
    });
  }
  handleLogout(){
    console.log('logout');
    axios.post(this.props.url+'logout');
    this.setState({
        isLoggedIn: false
    });
  }
  handleCreateUserSubmit(data) {
    axios.post(this.props.url+'createuser', data)
    .then(res=>{
      if(res.data.invalid){
        this.setState({failedAttempt: true});
      }
      else if(!res.data.status){
          this.setState({failedAttempt: true});
      }
      else{
        this.setState ({isLoggedIn: true});
      }
    })
  }
  render() {
    if (this.state.isLoggedIn){
      return(
        <button className="logout" onClick={this.handleLogout}>
        Logout
      </button>
    );
    }
    else{
      if(this.state.loginPrompt){
        return (
            <div>
              <h1>Please log in</h1>
              <LoginForm onLoginSubmit={ this.handleLoginSubmit }/>
              <button className="create_user" onClick={this.handleCreateUserButton}>
                  Create an Account!
              </button>
              {this.state.failedAttempt && <p className='failedAttempt'> Login attempt failed </p>}
            </div>
          );
      }
      else{
        return(
          <div>
            <h1>Create User</h1>
            <CreateUserForm onCreateUserSubmit={ this.handleCreateUserSubmit }/>
            <button className="login_switch" onClick={this.handleCreateUserButton}>
                Login to Pre-existing Account!
            </button>
            {this.state.failedAttempt && <p className='failedAttempt'> User creation failed </p>}
          </div>
        );
      }

    }

  }
}

export default LoginControl
