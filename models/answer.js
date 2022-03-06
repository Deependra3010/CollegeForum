const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    body: String
});

module.exports = mongoose.model('Answer', answerSchema);