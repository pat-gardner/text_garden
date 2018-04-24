var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

require('./database.js')();

mongoose.connect('mongodb://pat:patpass@ds255889.mlab.com:55889/fake_garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );

var growCrops = require('./gameTimers.js');
setInterval(growCrops, 1000);

var app = express();

app.set('port', 5000);
const NUM_PLOTS = 9;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	secret: 'a4f8071f-c873-4447-8ee2',
	cookie: { maxAge: 3600*24*7, secure: false},
	resave: false,
	saveUninitialized: true
}));
/*
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
*/

app.get('/api', (req, res) => {
	//console.log('Got a request');
	res.json( {msg: 'You reached the server'} );
});

app.get('/users', function(req, res) {
	User.find(function(err, users) {
		if (err) {
			res.send(err);
		}
		res.json(users)
	});
});

app.post('/getuser', function(req, res) {
	User.findOne({'username': req.body.user}, function(err, user) {
		if (err) {
			res.send(err);
		}
		if(user == null) {
			res.json({result: false});
			return;
		}
		bcrypt.compare(req.body.pass, user.password, function(err, result){
			if(err) {
				res.send({"result": false});
			}
			if(result){
				res.send({"result": true});
				req.session.user = req.body.user;
				req.session.save();
			}
			else{
				res.send({"result": false});
			}
		});
	});
});

app.post('/createuser', function(req, res) {
	//body parser lets us use the req.body
	bcrypt.hash(req.body.pass, 10, function(err, hash) {
		Crop.findOne({name: 'letterA'}).exec(function(err, crop) {
			var plot = new Plot({
				crop: crop._id
			});
			plot.save(function(err, plot) {
				var user = new User({
					username: req.body.user,
					password: hash,
					plots: [plot._id]
				});
				user.save(function(err) {
					if (err) {
						res.send(err);
					}
					req.session.user = req.body.user;
					req.session.save();
					console.log('Just saved ' + req.session.user);
					res.json({ message: 'User successfully added!' });
				});
			});
		});
	});
});


app.get('/updateGarden', (req, res) => {
	var username = req.session.user;
	console.log('Updating garden for user: ' + username);
	if (username == null) {
		res.json({status: false});
		return;
	}

	User.findOne({ username: username })
	.populate('inventory')
	.populate({
		path: 'plots',
		populate: {path: 'crop'}
	})
	.exec(function(err, user) {
		console.log(user);
		if(user == null) {
			res.json({status: false});
		}
		let result = user.plots.map( (plot, i) => {
			// console.log(plot);
			return plot == null ? " " : plot.crop.images[plot.growth];
		});
		res.json({
			status: true,
			msg: result
		});
	});

});


app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')) );
