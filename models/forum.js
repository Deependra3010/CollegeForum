const mongoose = require('mongoose');
const Answer = require('./answer')
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
    },
    name: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }
    ]
    // date: {
    //     type: Date,
    //     default: Date.name
    // }
});

ForumSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Answer.deleteMany({
            _id: {
                $in: doc.answers
            }
        })
    }
})

module.exports = mongoose.model('Forum', ForumSchema);