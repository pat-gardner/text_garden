const express = require('express');
const app = express();

app.set('port', 5000);

app.get('/api', (req, res) => {
	console.log('Got a request');
	res.json( {msg: 'You reached the server'} );
});

app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')) );
