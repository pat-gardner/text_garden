var mongoose = require('mongoose');
require('./database.js')();

mongoose.connect('mongodb://pat:patpass@ds255889.mlab.com:55889/fake_garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );

const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
				'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

letters.forEach((letter) => {
	const lower = letter.toLowerCase();
	Crop.create({
		name: letter,
		images: ['. .\n. .', lower, letter],
		cooldown: 3000
	}, function(err,doc) {
		if(err) console.log(err);
	});
});
