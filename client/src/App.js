import React, { Component } from 'react';
// import Plot from './Plot.js';
import Garden from './Garden.js';
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
        return fetch('/', { accept: 'application/json' })
        .then(res => res.json());
    }

    render() {
        const arr = [' ', 'A', 'B', ' ', 'C', '', 'D', '', ''];
        return (
            <Garden plots={arr} />
        );
    }
}

export default App;
