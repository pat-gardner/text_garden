import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {response: 'no response'};

  componentDidMount() {
    this.callApi()
	.then( res => this.setState( {response: res.msg} ) )
	.catch(err => console.log(err) );
  }

  callApi = () => {
	//console.log('Sending req');
	return fetch('/api', { accept: 'application/json' })
		.then(res => res.json());
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.state.response}
	</p>
      </div>
    );
  }
}

export default App;
