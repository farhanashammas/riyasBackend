const mongoose = require('mongoose');
var noteSchema = new mongoose.Schema({
    note:String,
    video: {
        contentType: String,
        size: String,
        vid: {
            type: Buffer
        }
    },
});
var noteModel = mongoose.model('note', noteSchema);
module.exports = { noteModel };