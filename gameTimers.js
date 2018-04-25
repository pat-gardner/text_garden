var mongoose = require('mongoose');
require('./database.js')();

mongoose.connect('mongodb://pat:patpass@ds255889.mlab.com:55889/fake_garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );


//Check every plot if it's time for its crop to grow
module.exports = function() {
    User.find({}, 'plots')
        .populate({path: 'plots.crop'})
        .exec(function(err,users) {
            if(err || users.length === 0) {
                console.log(err);
                return;
            }
            users.forEach((user) => {
                user.plots.filter((plot) => plot.crop != null)
                    .forEach(function(plot) {
                        // console.log(plot);
                        var lastUpdated = plot.lastUpdated.getTime();
                        var now = new Date();
                        if(now.getTime() - lastUpdated >= plot.crop.cooldown && plot.growth < 2) {
                            plot.growth += 1;
                            plot.lastUpdated = now;
                            user.markModified('plots');
                            user.save(function(err) {
                                if(err) console.log(err);
                            });
                        }
                    });
            });
        });
};
