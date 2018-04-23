var express = require('express');
var db = require('./database.js')();

var app = express();

app.set('port', 5000);

app.get('/api', (req, res) => {
	//console.log('Got a request');
	res.json( {msg: 'You reached the server'} );
});

Crop.create({ name: 'letterA', images: ['.', 'a', 'A'], cooldowm: 10 }, function(err, doc) {
	if (err) console.log(err);
});

app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')) );
