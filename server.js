var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var db = require('./database.js')();

mongoose.connect('mongodb://pat:patpass@ds255889.mlab.com:55889/fake_garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );

var app = express();

app.set('port', 5000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	secret: 'a4f8071f-c873-4447-8ee2',
	cookie: { maxAge: 2628000000, secure: false},
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
		if(user === null) {
			console.log('no user found');
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
app.post('/sendMessage', function(req, res){
  if(req.session.user === null || req.session.user === undefined){
    console.log('not logged in');
  }
  else{
    var message = new Message({
      sender: req.session.user,
      target: req.body.target,
      message: req.body.message,
      unread: true
    });
    message.save(function(err) {
			if (err) {
        console.log(err);
				res.send(err);
			}
			res.json({ message: 'Message successfully added!' });
		});
  }
});
app.get('/newMessages', function(req, res){
  Message.find({'target': req.session.user, 'unread':true}, function(err, messages){
    if(err) {
      res.send(err);
    }
    console.log(messages);
    res.send({'number':messages.length});
  });
});
app.get('/getMessages', function(req, res){
  Message.find({'target': req.session.user}, function(err, messages){
    if(err) {
      res.send(err);
    }
    console.log(messages);
    res.send({'data':messages});
  });
});
app.post('/checkLoggedIn', function(req, res){
  console.log('user' + req.session.user)
  if(req.session.user === null || req.session.user === undefined){
    res.send({"result": false});
  }
  else{
    res.send({"result": true});
  }
});
app.post('/logout', function(req, res){
  req.session.user = null;
  req.session.save();
  console.log('logout');
});
app.post('/createuser', function(req, res) {
  req.session.user = req.body.user;
  req.session.save();
	//var user = new User();
	//body parser lets us use the req.body
	bcrypt.hash(req.body.pass, 10, function(err, hash) {
		var user = new User({
			username: req.body.user,
			password: hash
		})
		user.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.json({ message: 'User successfully added!' });
		});
	});
});


app.get('/updateGarden', (req, res) => {
	//TODO: dynamic response based on session and DB
	var username = "pat"; //TODO: change to session.user

	// User.findOne({ username: username })
	// .populate('inventory')
	// .populate(plots.crop)
	// .exec(function(err, user) {
	// 	console.log(user.plots);
	// 	let result = user.plots.map( (plot, i) => {
	// 		return plot.crop.images[plot.growth];
	// 	})
	// });

	res.json([
		"A", " ", "B",
		" ", "C", "D",
		"E", " ", " "
	]);
});


app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')) );
