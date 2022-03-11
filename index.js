if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

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
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const multer = require('multer');
const { storage, cloudinary } = require('./cloudinary');
const upload = multer({ storage });
const { isLoggedIn, isAuthor, isAnswerAuthor } = require('./middleware');
const mongoSanitize = require('express-mongo-sanitize');

const MongoDBStore = require("connect-mongo")(session);

const categories = ['Exam', 'University', 'Engineering', 'Management', 'Programming', 'Placements', 'Other'];

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/College-Forum';

mongoose.connect(dbUrl, {
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

const secret = process.env.SECRET || 'thisisasecret';
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({
    replaceWith: '_'
}));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/register', (req, res) => {
    res.render('users/register');
});
app.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to College Forum!')
            res.redirect('/questions');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}));
app.get('/login', (req, res) => {
    res.render('users/login');
})
app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirectUrl = req.session.returnTo || '/questions';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!');
    res.redirect('/questions')
})

app.get('/questions', catchAsync(async (req, res) => {
    const ques = await Forum.find().populate('name');
    const { category } = req.query;
    if (category) {
        const questions = await Forum.find({ category });
        res.render('Questions/index', { questions, categories, ques });
    }
    else {
        const questions = await Forum.find({});
        res.render('Questions/index', { questions, categories, ques });
    }
}));
app.get('/questions/new', isLoggedIn, (req, res) => {
    res.render('Questions/new', { categories })
});
app.post('/questions', isLoggedIn, upload.array('image'), catchAsync(async (req, res) => {
    if (!req.body.question) throw new ExpressError('Invalid Question Data', 400);
    const question = new Forum(req.body.question);
    question.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    question.name = req.user._id;
    question.date = Date.now();
    await question.save();
    req.flash('success', 'We hope you get an Answer soon!');
    res.redirect(`/questions/${question._id}`)
}));


app.get('/questions/:id', catchAsync(async (req, res) => {
    const question = await Forum.findById(req.params.id).populate({
        path: 'answers',
        populate: {
            path: 'name'
        }
    }).populate('name');
    if (!question) {
        req.flash('error', 'Connot find the Campground!');
        return res.redirect('/questions');
    }
    res.render('Questions/show', { question });
}));
app.get('/questions/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const question = await Forum.findById(req.params.id);
    if (!question) {
        req.flash('error', 'Connot find the Campground!');
        return res.redirect('/questions');
    }
    res.render('Questions/edit', { question, categories });
}));
app.put('/questions/:id', isLoggedIn, isAuthor, upload.array('image'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const question = await Forum.findByIdAndUpdate(id, { ...req.body.question });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    question.images.push(...imgs);
    await question.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await question.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully edited the Question!')
    res.redirect(`/questions/${question._id}`);
}));
app.delete('/questions/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Forum.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Question!')
    res.redirect('/questions');
}));

app.post('/questions/:id/answers', isLoggedIn, catchAsync(async (req, res) => {
    const question = await Forum.findById(req.params.id);
    const answer = new Answer(req.body.answer);
    answer.name = req.user._id;
    question.answers.push(answer);
    await answer.save();
    await question.save();
    req.flash('success', 'Thankyou For Answering the Question!')
    res.redirect(`/questions/${question._id}`)
}));
app.delete('/questions/:id/answers/:answerId', isLoggedIn, isAnswerAuthor, catchAsync(async (req, res) => {
    const { id, answerId } = req.params;
    await Forum.findByIdAndUpdate(id, { $pull: { answers: answerId } });
    await Answer.findByIdAndDelete(answerId);
    req.flash('success', 'Successfully deleted the Question!')
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
