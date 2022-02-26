const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        // lowercase: true,
        enum: ['Exam', 'University', 'Engineering', 'Management', 'Programming', 'Placements', 'Other']
    },
    image: {
        type: String
    }
    // date: {
    //     type: Date,
    //     default: Date.name
    // }
});

module.exports = mongoose.model('Forum', ForumSchema);