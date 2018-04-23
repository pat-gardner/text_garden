var express = require('express');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://gardenu:gardenp@ds014368.mlab.com:14368/garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );
var Schema = mongoose.Schema;

app.set('port', 5000);

app.get('/api', (req, res) => {
	//console.log('Got a request');
	res.json( {msg: 'You reached the server'} );
});

var exampleSchema = new Schema({
	myArr: [],
	date: Date
});
var exampleModel = mongoose.model('exampleModel', exampleSchema);

exampleModel.create({myArr: [1,2,"hey"], date: new Date}, (err, instance) => {
	console.log("Saved a thing!");
});

app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')) );
