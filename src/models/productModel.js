const mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
        image: {
            contentType: String,
            size: String,
            img: {
                type: Buffer
            }
        },
        productName: {
            type: String,
            index: true,
            trim: true,
        },
        productCategory:String,
        productPrice:Number,
        productColor:String,
        productBrand:String,
        productCamera:String,
        productMemory:String,
        productProcessor:String,
        productAvailability: String,
        productDescription:String,
        userRating: { one: Number, two: Number, three: Number, four: Number, five: Number },
        totalRating: Number


});
var productModel = mongoose.model('products', productSchema);
module.exports = { productModel };