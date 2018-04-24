var express = require('express');
var mongoose = require('mongoose');
var db = require('./database.js')();

mongoose.connect('mongodb://pat:patpass@ds255889.mlab.com:55889/fake_garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );

var app = express();

app.set('port', 5000);

app.get('/api', (req, res) => {
	//console.log('Got a request');
	res.json( {msg: 'You reached the server'} );
});

app.get('/updateGarden', (req, res) => {
	//TODO: dynamic response based on session and DB
	var username = "pat"; //TODO: change to session.user

	User.findOne({ username: username })
		.populate('inventory')
		.populate(plots.crop)
		.exec(function(err, user) {
			console.log(user.plots);
			let result = user.plots.map( (plot, i) => {
				return plot.crop.images[plot.growth];
			})
		});

	res.json([
		"A", " ", "B",
		" ", "C", "D",
	  	"E", " ", " "
	]);
});


app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')) );
