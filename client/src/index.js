import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LoginControl from './LoginControl.js';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <div> <LoginControl url='/' />
    <App /> </div>,
    document.getElementById('root')
);
