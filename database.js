var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const inventoryDefault = {
		'A':0, 'B':0, 'C':0, 'D':0, 'E':0, 'F':0, 'G':0, 'H':0,
		'I':0, 'J':0, 'K':0, 'L':0, 'M':0, 'N':0, 'O':0, 'P':0,
		'Q':0, 'R':0, 'S':0, 'T':0, 'U':0, 'V':0, 'W':0, 'X':0 ,'Y':0, 'Z':0
};


var PlotSchema = new Schema({
    crop: { type: Schema.Types.ObjectId, ref: 'Crop' },
    growth: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

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
    plots: [ { type: Schema.Types.ObjectId, ref: 'Plot' } ],
    inventory: { type: Object, default: inventoryDefault} //Stores the chars the user has harvested
    // inventory: [ { type: Schema.Types.ObjectId, ref: 'Item' } ]
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

var MessageSchema = new Schema({
	sender: String,
	target: String,
	message: String,
	unread: Boolean
});

var User = mongoose.model('User', UserSchema);
var Plot = mongoose.model('Plot', PlotSchema);
var Item = mongoose.model('Item', ItemSchema);
var Crop = mongoose.model('Crop', CropSchema);
var Message = mongoose.model('Message', MessageSchema);

module.exports = function() {
    this.User = User;
    this.Plot = Plot;
    this.Item = Item;
    this.Crop = Crop;
		this.Message = Message;
}
