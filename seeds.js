const mongoose = require('mongoose');
const Forum = require('./models/forum');

mongoose.connect('mongodb://localhost:27017/College-Forum')
    .then(() => {
        console.log("Mongo Connection Open!!!");
    })
    .catch(err => {
        console.log("Mongo Connection Error!!!!");
        console.log(err);
    })

const seedQuestions = [
    {
        question: 'How to center a div',
        description: 'How can we center a div using css',
        category: 'Programming'
    },
    {
        question: 'When does the exams starts',
        description: 'I need the timetable for exams',
        category: 'Exam'
    },
    {
        question: 'Where is the admin block',
        category: 'University'
    },
    {
        question: 'Which companies visits Parul University for placements',
        description: 'I want the list of best companies that visits Parul University',
        category: 'Placements'
    },
    {
        question: 'What is the fees of B.Tech',
        description: 'What is the fees of B.Tech yearly including hostel fees',
        category: 'Management'
    }
]

Forum.insertMany(seedQuestions)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })