const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    body: String,
    name: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Answer', answerSchema);