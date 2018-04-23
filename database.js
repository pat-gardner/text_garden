var mongoose = require('mongoose');

mongoose.connect('mongodb://gardenu:gardenp@ds014368.mlab.com:14368/garden');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MLab') );
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
	password: {
        type: String,
        required: true
    },
    plots: [{ type: Schema.Types.ObjectId, ref: 'Plot' }],
    inventory: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

var PlotSchema = new Schema({
    crop: { type: Schema.Types.ObjectId, ref: 'Crop' },
    growth: { type: Number, default: 0 },
    plantTime: { type: Date, default: Date.now }
});

var ItemSchema = new Schema ({
    name: String,
    image: String
    //Properties?
});

var CropSchema = new Schema({
    name: String,
    images: [String],
    cooldown: Number, //time in ms
    rarity: { type: Number, default: 1} //TODO: figure this out
});

var User = mongoose.model('User', UserSchema);
var Plot = mongoose.model('Plot', PlotSchema);
var Item = mongoose.model('Item', ItemSchema);
var Crop = mongoose.model('Crop', CropSchema);

module.exports = function() {
    this.User = User;
    this.Plot = Plot;
    this.Item = Item;
    this.Crop = Crop;
}
