const express = require('express');
const app = express();
const methodOverride = require('method-override')
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressErrors');
const Forum = require('./models/forum');
const Answer = require('./models/answer');

const categories = ['Exam', 'University', 'Engineering', 'Management', 'Programming', 'Placements', 'Other'];

mongoose.connect('mongodb://localhost:27017/College-Forum', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/questions', catchAsync(async (req, res) => {
    const questions = await Forum.find({});
    res.render('Questions/index', { questions });
}));
app.get('/questions/new', (req, res) => {
    res.render('Questions/new', { categories })
});
app.post('/questions', catchAsync(async (req, res) => {
    if (!req.body.question) throw new ExpressError('Invalid Question Data', 400);
    const question = new Forum(req.body.question);
    await question.save();
    res.redirect(`/questions/${question._id}`)
}));
<<<<<<< HEAD
app.get('/questions/:id', catchAsync(async (req, res,) => {
    const question = await Forum.findById(req.params.id).populate('answers');
=======
app.get('/questions/:id', catchAsync(async (req, res) => {
    const question = await Forum.findById(req.params.id)
>>>>>>> 5785c587294d0d2adb91f1bdfa4f28a38d43be9f
    res.render('Questions/show', { question });
}));
app.get('/questions/:id/edit', catchAsync(async (req, res) => {
    const question = await Forum.findById(req.params.id)
    res.render('Questions/edit', { question, categories });
}));
app.put('/questions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const question = await Forum.findByIdAndUpdate(id, { ...req.body.question });
    res.redirect(`/questions/${question._id}`);
}));
app.delete('/questions/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Forum.findByIdAndDelete(id);
    res.redirect('/questions');
}));

app.post('/questions/:id/answers', catchAsync(async (req, res) => {
    const question = await Forum.findById(req.params.id);
    const answer = new Answer(req.body.answer);
    question.answers.push(answer);
    await answer.save();
    await question.save();
    res.redirect(`/questions/${question._id}`)
}));
app.delete('/questions/:id/answers/:answerId', catchAsync(async (req, res) => {
    const { id, answerId } = req.params;
    await Forum.findByIdAndUpdate(id, { $pull: { answers: answerId } });
    await Answer.findByIdAndDelete(answerId);
    res.redirect(`/questions/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!!'
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Serving on Port 3000!!!');
})
