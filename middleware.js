// module.exports.isLoggedIn = (req, res, next) => {
//     // console.log('req.user ', req.user);
//     if (!req.isAuthenticated()) {
//         // Store the url they are requesting 
//         // console.log(req.path, req.originalUrl);
//         req.session.returnTo = req.originalUrl;
//         req.flash('error', 'You must be signed In');
//         return res.redirect('/login');
//     }
//     next();
// }

// Bug solve 
module.exports.isLoggedIn = (req, res, next) => {
    // console.log('req.user ', req.user);
    if (!req.isAuthenticated()) {
        // Store the url they are requesting 
        // console.log(req.path, req.originalUrl);
        req.flash('error', 'You must be signed In');
        return res.redirect('/login');
    }
    next();
}

const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.validateCampground = (req, res, next) => {
    // console.log(req.body);
    const result = campgroundSchema.validate(req.body);
    // console.log(result);
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground with that invalid id does not exist');
        return res.redirect('/campgrounds');
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    console.log(req.body);
    const result = reviewSchema.validate(req.body);
    console.log(result);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}