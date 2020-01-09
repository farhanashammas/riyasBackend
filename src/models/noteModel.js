const mongoose = require('mongoose');
var noteSchema = new mongoose.Schema({
    note:String
});
var noteModel = mongoose.model('note', noteSchema);
module.exports = { noteModel };