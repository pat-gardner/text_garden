var mongoose = require('mongoose');
require('./database.js')();

mongoose.connect('mongodb://pat:patpass@ds255889.mlab.com:55889/fake_garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );


//Check every plot if it's time for its crop to grow
module.exports = function() {
    Plot.find({})
        .populate('crop')
        .exec(function(err,plots) {
            plots.forEach(function(plot) {
                var lastUpdated = plot.lastUpdated.getTime();
                var now = new Date();
                console.log(plot.crop.cooldown);
                console.log(now.getTime() - lastUpdated >= plot.crop.cooldown);
                if(now.getTime() - lastUpdated >= plot.crop.cooldown && plot.growth < 2) {
                    console.log('hey');
                    plot.growth += 1;
                    plot.lastUpdated = now;
                    plot.save();
                }
            });
        });
};
