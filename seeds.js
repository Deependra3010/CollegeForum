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

Forum.deleteMany({})
    .then(res => {
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
        images: [
            {
                url: 'https://res.cloudinary.com/dwrrbwdlf/image/upload/v1646902270/CollegeForum/mcezxhunt6f626vnshdk.jpg',
                filename: 'CollegeForum/mcezxhunt6f626vnshdk',
            }
        ],
        name: '62274704498445acbaa72378',
        date: Date.now()
    },
    {
        question: 'When does the exams starts',
        description: 'I need the timetable for exams',
        category: 'Exam',
        images: [
            {
                url: 'https://res.cloudinary.com/dwrrbwdlf/image/upload/v1646902270/CollegeForum/mcezxhunt6f626vnshdk.jpg',
                filename: 'CollegeForum/mcezxhunt6f626vnshdk',
            }
        ],
        name: '62274704498445acbaa72378',
        date: Date.now()
    },
    {
        question: 'Where is the admin block',
        category: 'University',
        images: [
            {
                url: 'https://res.cloudinary.com/dwrrbwdlf/image/upload/v1646902270/CollegeForum/mcezxhunt6f626vnshdk.jpg',
                filename: 'CollegeForum/mcezxhunt6f626vnshdk',
            }
        ],
        name: '62274704498445acbaa72378',
        date: Date.now()
    },
    {
        question: 'Which companies visits Parul University for placements',
        description: 'I want the list of best companies that visits Parul University',
        category: 'Placements',
        images: [
            {
                url: 'https://res.cloudinary.com/dwrrbwdlf/image/upload/v1646902270/CollegeForum/mcezxhunt6f626vnshdk.jpg',
                filename: 'CollegeForum/mcezxhunt6f626vnshdk',
            }
        ],
        name: '62274704498445acbaa72378',
        date: Date.now()
    },
    {
        question: 'What is the fees of B.Tech',
        description: 'What is the fees of B.Tech yearly including hostel fees',
        category: 'Management',
        images: [
            {
                url: 'https://res.cloudinary.com/dwrrbwdlf/image/upload/v1646902270/CollegeForum/mcezxhunt6f626vnshdk.jpg',
                filename: 'CollegeForum/mcezxhunt6f626vnshdk',
            }
        ],
        name: '62274704498445acbaa72378',
        date: Date.now()
    }
]



Forum.insertMany(seedQuestions)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })