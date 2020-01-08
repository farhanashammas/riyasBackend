const mongoose = require('mongoose');
var dataSchema = new mongoose.Schema({
    image:String,
    restaurantName: {
        type: String,
       
    },
    userRating: { one: Number, two: Number, three: Number, four: Number, five: Number },
    location: {
        type: String,
    },
    items: [],
    ownerId: mongoose.Schema.Types.ObjectId,
    totalRating: Number,
    contactNumber:Number
});
var dataModel = mongoose.model('data', dataSchema);
module.exports = { dataModel };