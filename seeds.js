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

Forum.deleteMany({}).then(res => {
    console.log(res);
})
    .catch(e => {
        console.log(e);
    })

const seedQuestions = [
    {
        question: 'How to center a div',
        description: 'How can we center a div using css',
        category: 'Programming',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
        question: 'When does the exams starts',
        description: 'I need the timetable for exams',
        category: 'Exam'
    },
    {
        question: 'Where is the admin block',
        category: 'University',
        image: 'https://images.unsplash.com/photo-1639959971925-b7bcac6f99f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
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