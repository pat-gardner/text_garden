import React from 'react';
import ReactDOM from 'react-dom';
import GardenHome from './GardenHome';
import LoginControl from './LoginControl'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
 <LoginControl
 url='http://localhost:3001/api/'/>,
 document.getElementById('root')
);
