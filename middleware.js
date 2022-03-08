const ExpressError = require('./utils/ExpressErrors');
const Forum = require('./models/forum')
const Answer = require('./models/answer')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Need to be Signed In!');
        return res.redirect('/login')
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const question = await Forum.findById(id);
    if (!question.name.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/questions/${id}`);
    }
    next();
}
module.exports.isAnswerAuthor = async (req, res, next) => {
    const { id, answerId } = req.params;
    const answer = await Answer.findById(answerId);
    if (!answer.name.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to that!');
        return res.redirect(`/questions/${id}`);
    }
    next();
}