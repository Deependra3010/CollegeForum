const express = require('express');
const app = express();
const methodOverride = require('method-override')
const path = require('path');
const mongoose = require('mongoose');
const Forum = require('./models/forum');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/questions', async (req, res) => {
    const questions = await Forum.find({});
    res.render('Questions/index', { questions });
});
app.get('/questions/new', (req, res) => {
    res.render('Questions/new', { categories })
});
app.post('/questions', async (req, res) => {
    const question = new Forum(req.body.question);
    await question.save();
    res.redirect(`/questions/${question._id}`)
})
app.get('/questions/:id', async (req, res,) => {
    const question = await Forum.findById(req.params.id)
    res.render('Questions/show', { question });
});
app.get('/questions/:id/edit', async (req, res) => {
    const question = await Forum.findById(req.params.id)
    res.render('Questions/edit', { question, categories });
});
app.put('/questions/:id', async (req, res) => {
    const { id } = req.params;
    const question = await Forum.findByIdAndUpdate(id, { ...req.body.question });
    res.redirect(`/questions/${question._id}`);
});
app.delete('/questions/:id', async (req, res) => {
    const { id } = req.params;
    await Forum.findByIdAndDelete(id);
    res.redirect('/questions');
});

app.listen(3000, () => {
    console.log('Serving on Port 3000!!!');
})