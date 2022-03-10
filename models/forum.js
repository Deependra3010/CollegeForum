const mongoose = require('mongoose');
const Answer = require('./answer')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

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
    images: [ImageSchema],
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