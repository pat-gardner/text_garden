//server.js
'use strict'
//first we import our dependencies…
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./model/users');
var bcrypt = require('bcrypt');

//and create our instances
var app = express();
var router = express.Router();
//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;
//db config
mongoose.connect('mongodb://gardenu:gardenp@ds014368.mlab.com:14368/garden');
//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000, secure:false},
    resave: false,
    saveUninitialized: true
}));
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
//now we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

router.route('/users').get(function(req, res) {
  User.find(function(err, users) {
    if (err)
    res.send(err);
    res.json(users)
  });
});
router.route('/getuser').post(function(req, res) {
  User.findOne({'user': req.body.user}, function(err, user) {
    if (err)
    res.send(err);
    bcrypt.compare(req.body.pass, user.pass, function(err, result){
      if(result){
        res.send({"result": true});
        req.session.user = req.body.user;
        req.session.save();
      }
      else{
        res.send({"result": false});
      }
    })

  });
});
router.route('/createuser').post(function(req, res) {
  var user = new User();
  //body parser lets us use the req.body
  bcrypt.hash(req.body.pass, 10, function(err, hash) {
    user.user = req.body.user;
    user.pass = hash;
    user.save(function(err) {
      if (err)
      res.send(err);
      res.json({ message: 'User successfully added!' });
    });
  });
});
//Use our router configuration when we call /api
app.use('/api', router);
//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
