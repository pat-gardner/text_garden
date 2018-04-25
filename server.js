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

app.get('/api', (req, res) => {
  res.json( {msg: 'You reached the server'} );
});

app.get('/users', function(req, res) {
  User.find(function(err, users) {
    if (err) {
      res.send(err);
      return;
    }
    res.json(users)
  });
});


app.post('/shop', function(req, res){
  var type = req.body.type;
  var crop = req.body.letter.toUpperCase();
  var amt = parseInt(req.body.amount);
  var username = req.session.user;
  // console.log(type + ' ' + amt + ' of ' + crop);
  if(username == null || type == null || crop == null || amt == null){
    res.json({status:false});
    return;
  }
  User.findOne({username: username}, 'inventory seeds money', function(err,user) {
    if(user == null) {
      res.json({status: false});
      return;
    }
    if(!/^[A-Z]$/.test(crop)) {
        res.json({status: false});
        return;
    }
    if(type === 'buy') {
      const cost = amt * 2; //Crops cost 2
      //Validate their request
      if(user.money < cost) {
        res.json({status: false});
        return;
      }
      user.money -= cost;
      user.seeds[crop] += amt;
      user.markModified('seeds');
      user.save(function(err) {
        if(err) {
          console.log(err);
          res.json({status: false});
          return;
        }
        res.json({status: true});
      });
    }
    else if(type === 'sell') {
      if(user.inventory[crop] < amt) {
        res.json({status: false});
        return;
      }
      //Crops sell for 1
      user.money += amt;
      user.inventory[crop] -= amt;
      user.markModified('inventory');
      user.save(function(err) {
        if(err) {
          console.log(err);
          res.json({status: false});
          return;
        }
        res.json({status: true});
      });
    }
  });

});
app.post('/getuser', function(req, res) {
  User.findOne({'username': req.body.user}, function(err, user) {
    if (err) {
      res.send(err);
      return;
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
  console.log('sendmessage');
  var isValid = true;
  var test = 'hello';
  if(req.session.user === null || req.session.user === undefined){
    console.log('not logged in');
  }
  else{
    if(/^[A-Z ]+$/.test(req.body.message.toUpperCase())){
      User.findOne({'username': req.session.user}, 'inventory', function(err, user) {
        console.log('A_Z '+test);
        console.log(user.inventory);
        console.log(Object.keys(user.inventory));
        //for (var key in Object.keys(user.inventory)){
        Object.keys(user.inventory).every(function(key, i){
          let re = RegExp(key, 'gi');
          let reg = req.body.message.match(re);
          console.log(key);
          console.log(re);
          console.log(reg);
          if(reg){
            console.log('reg.length: '+reg.length);
            console.log('user.inventory: '+user.inventory[key]);
            if(reg.length > user.inventory[key]){
              console.log('invalid message');
              res.send({'status':false});
              isValid = false;
              return false;
            }
            else{
              console.log('valid');
              user.inventory[key] -= reg.length;
              user.markModified('inventory');
            }
          }
          return true;
        })

        if(isValid){
          console.log(isValid);
          console.log("message "+test);
          test  = 'bye';
          var message = new Message({
            sender: req.session.user,
            target: req.body.target,
            message: req.body.message.toUpperCase(),
            unread: true
          });
          message.save(function(err) {
            if (err) {
              console.log(err);
              res.send(err);
              return;
            }
            //res.json({ message: 'Message successfully added!' });
          });
          user.save(function(err,u) {
            if(err) {
              console.log(err);
              return;
            }
          });
        }

      })


    }
    else{
      console.log('invalid message');
      res.send({'status': false});
    }
  }
});

app.get('/newMessages', function(req, res){
  Message.find({'target': req.session.user, 'unread':true}, function(err, messages){
    if(err) {
      res.send(err);
      return;
    }
    res.send({'number':messages.length});
  });
});

app.get('/getMessages', function(req, res){
  Message.find({'target': req.session.user}, function(err, messages){
    if(err) {
      res.send(err);
      return;
    }
    res.send({'data':messages});
  });
});

app.post('/checkLoggedIn', function(req, res){
  // console.log('user' + req.session.user)
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
  res.send({'status':true});
  console.log('logout');
});

app.post('/createuser', function(req, res) {
  if(!/^[\w_\-]+$/.test(req.body.user)){
    res.send({"invalid":true });
    return;
  }
  //body parser lets us use the req.body
  bcrypt.hash(req.body.pass, 10, function(err, hash) {
    Crop.findOne({name: 'A'}).exec(function(err, crop) {
      var plot = new Plot({
        crop: crop._id
      });
      var user = new User({
        username: req.body.user,
        password: hash,
        plots: [plot]
      });
      for(let i = 1; i < NUM_PLOTS; i++) {
        user.plots.push({ crop: null}); //TODO: empty crop?
      }
      user.save(function(err) {
        if (err) {
          console.log(err);
          return;
        }
        req.session.user = req.body.user;
        req.session.save();
        // console.log('Just saved ' + req.session.user);
        res.send({"invalid":false });
        // console.log('User successfully added!' );
      });
    });
  });
});

app.get('/getInv', (req, res) => {
  if(req.session.user == null){
    console.log('not logged in');
    res.send({'result': false});
    return;
  }
  User.findOne({'username': req.session.user}, 'inventory seeds money username -_id', function(err, user) {
    if (err) {
      res.send(err);
      return;
    }
    if(user == null) {
      res.send({'result': false});
      return;
    }
    res.send({
      'result': true,
      'user':user
    });
  })
})

//User wants to harvest a letter
//Check if they have a fully grown plot with that letter,
//and then add it to their inventory along with some seeds
app.post('/harvest', (req,res) => {
  var username = req.session.user;
  var cropName = req.body.cropName.toUpperCase();
  var plotNum = req.body.plotNumber;
  // console.log('Harvesting ' + cropName + ' (' + plotNum + ') for ' + username);
  if(username == null || cropName == null || plotNum == null) {
    res.json({status: false});
    return;
  }
  //Single upper-case letter
  if(!/^[A-Z]$/.test(cropName)) {
      res.json({status: false});
      return;
  }
  User.findOne({username: username}, 'plots inventory seeds')
  .populate({
    path: 'plots.crop',
  })
  .exec(function(err, user) {
    // console.log('user:');
    // console.log(user);
    if(user == null) {
      res.json({status: false});
      return;
    }

    var ourPlot = user.plots[plotNum];
    if(ourPlot.crop == null || ourPlot.growth < 2) {
      res.json({status: false});
      return;
    }

    user.plots[plotNum] = new Plot({crop: null});
    user.markModified('plots');
    //Add the crop to their inventory and remove the plot
    user.inventory[cropName] += 1;
    user.markModified('inventory');
    //Add either 1 or 2 seeds of the matching type to their seed bank
    const numSeeds = Math.floor(Math.random()*2 + 1);
    user.seeds[cropName] += numSeeds;
    user.markModified('seeds');

    user.save(function(err,u) {
      if(err) {
        console.log(err);
        return;
      }
    });
    res.json({status: true});
  });
});

//User wants to plant new seeds. Check if they have the proper seeds and
//the selected plot is empty. If so, subtract one seed, and add a new plot
app.post('/plant', (req, res) => {
  var username = req.session.user;
  var seedName = req.body.seedName.toUpperCase();
  var plotNum = req.body.plotNumber;
  // console.log('Planting ' + seedName + ' (' + plotNum + ') for ' + username);
  if(username == null || seedName == null || plotNum == null) {
    res.json({status: false});
    return;
  }
  //Single upper-case letter
  if(!/^[A-Z]$/.test(seedName)) {
      res.json({status: false});
      return;
  }
  User.findOne({username: username}, 'plots seeds')
  .populate({ path: 'plots.crop' })
  .exec(function(err, user) {
    if(user == null) {
      res.json({status: false});
      return;
    }
    // console.log(user.plots[plotNum]);
    //Validate their request
    if(user.plots[plotNum].crop != null || user.seeds[seedName] === 0) {
      res.json({status: false});
      return;
    }

    Crop.findOne({name: seedName}, function(err, crop) {
      user.seeds[seedName] -= 1;
      user.markModified('seeds');
      user.plots[plotNum] = new Plot({crop: crop._id});
      user.markModified('plots');
      user.save(function(err) {
        if(err) {
          console.log(err);
          res.json({status: false});
          return;
        }
        res.json({status: true});
      });
    });
  });
});

app.get('/updateGarden', (req, res) => {
  var username = req.session.user;
  // console.log('Updating garden for user: ' + username);
  if (username == null) {
    res.json({status: false});
    return;
  }

  User.findOne({ username: username }, 'plots inventory seeds')
  .populate({
    path: 'plots.crop',
  })
  .exec(function(err, user) {
    if(user == null) {
      res.json({status: false});
    }
    let images = user.plots.map( (plot, i) => {
      return plot.crop == null ? " " : plot.crop.images[plot.growth];
    });
    let names = user.plots.map( (plot, i) => {
      return plot.crop == null ? "empty" : plot.crop.name;
    });
    let growths = user.plots.map( (plot, i) => {
      return plot.crop == null ? 0 : plot.growth;
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
