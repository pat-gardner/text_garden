var mongoose = require('mongoose');
require('./database.js')();

mongoose.connect('mongodb://pat:patpass@ds255889.mlab.com:55889/fake_garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );



Crop.create({ name: 'A', images: ['. .\n. .', 'a a\na a', 'A A\nA A'], cooldown: 3000 }, function(err, doc) {
	if (err) {
		console.log("There was an error");
		console.log(err);
	}
});

Crop.create({
	name: 'Z',
	images: ['. .\n. .', 'z z\nz z', 'Z Z\nZ Z'],
	cooldown: 3000
}, function(err, doc) {
	if (err) {
		console.log("There was an error");
		console.log(err);
	}
});
