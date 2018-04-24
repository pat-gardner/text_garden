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
    res.send({'number':messages.length});
  });
});

app.get('/getMessages', function(req, res){
  Message.find({'target': req.session.user}, function(err, messages){
    if(err) {
      res.send(err);
    }
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
					// console.log('Just saved ' + req.session.user);
					res.json({ message: 'User successfully added!' });
				});
			});
		});
	});
});

//User wants to harvest a letter
//Check if they have a fully grown plot with that letter,
//and then add it to their inventory
app.post('/harvest', (req,res) => {
	var username = req.session.user;
	var cropName = req.body.cropName;
	console.log('Harvesting ' + cropName + ' for ' + username);
	if(username == null || cropName == null) {
		res.json({status: false});
		return;
	}

	User.findOne({username: username}, 'plots inventory')
		.populate({
			path: 'plots',
			populate: {path: 'crop'}
		})
		.exec(function(err, user) {
			console.log('user:');
			console.log(user);
			if(user == null) {
				res.json({status: false});
				return;
			}
			//Find a plot that contains the right crop
			var matchingPlots = user.plots.filter(plot => {
				return (plot.crop.name === cropName ) && (plot.growth === 2);
			});
			if(matchingPlots.length === 0) {
				res.json({status: false});
				return;
			}

			user.plots.pull(matchingPlots[0]._id);

			// Plot.findByIdAndRemove(matchingPlots[0]._id, function(err, plot) {
			// 	console.log('Removed plot was: ' + plot);
			// 	console.log('User is ' + user);
			// 	if(err) {
			// 		console.log('Err harvesting: ' + err);
			// 		return;
			// 	}
			// });

			user.inventory.push(cropName);
			user.save();
			res.json({status: true});
		});
});

app.get('/updateGarden', (req, res) => {
	var username = req.session.user;
	console.log('Updating garden for user: ' + username);
	if (username == null) {
		res.json({status: false});
		return;
	}

	User.findOne({ username: username }, 'plots inventory')
	.populate({
		path: 'plots',
		populate: {path: 'crop'}
	})
	.exec(function(err, user) {
		if(user == null) {
			res.json({status: false});
		}
		let images = user.plots.map( (plot, i) => {
			return plot == null ? " " : plot.crop.images[plot.growth];
		});
		let names = user.plots.map( (plot, i) => {
			return plot == null ? " " : plot.crop.name;
		});
		let growths = user.plots.map( (plot, i) => {
			return plot == null ? 0 : plot.growth;
		});
		res.json({
			status: true,
			images: images,
			names: names,
			growths: growths
		});
	});

});


app.listen(app.get('port'), () => console.log('Listening on port ' + app.get('port')) );
