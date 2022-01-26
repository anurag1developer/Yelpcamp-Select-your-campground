const Campground = require('../models/campground');
const Review = require('../models/review');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.createReview = async (req, res) => {
    // res.send('You made it!!!');
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        console.log('Invalid Id');
        req.flash('error', "Campground with that invalid id doesn't exist");
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', "Campground doesn't exist, so no review can be added");
        return res.redirect('/campgrounds');
    }
    const review = new Review(req.body.review);
    console.log(review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id, reviewId } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    if (!ObjectID.isValid(reviewId)) {
        req.flash('error', 'Cannot find that review');
        return res.redirect(`/campgrounds/${id}`);
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect(`/campgrounds/${id}`);
    }
    const review = await Review.findById(reviewId);
    // console.log(review);
    if (!review) {
        req.flash('error', 'Cannot find that review')
        return res.redirect(`/campgrounds/${id}`)
    }
    res.render('reviews/edit', { campground, review });
};

module.exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // console.log(req.body.review);
    if (!ObjectID.isValid(id)) {
        req.flash('error', "Campground with that invalid id doesn't exist, so no review can be added or updated");
        res.redirect('/campgrounds');
    }
    if (!ObjectID.isValid(reviewId)) {
        req.flash('error', "Review of that id of this campground doesn't exist");
        res.redirect(`/campgrounds/${id}`);
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Campground doesn't exist");
        res.redirect('/campgrounds');
    }
    const review = await Review.findByIdAndUpdate(reviewId, req.body.review);
    console.log(review);
    if (review === null) {
        req.flash('error', "Review doesn't exist so no updation can be proceeded");
        return res.redirect(`/campgrounds/${campground._id}`);
    } else {
        req.flash('success', 'Updated a review');
    }
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroyReview = async (req, res) => {
    // res.send('delete me');
    const { id, reviewId } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', "Campground with that id doesn't exist, I think that id is invalid")
        res.redirect('/campgrounds');
    }
    if (!ObjectID.isValid(reviewId)) {
        req.flash('error', "Review has invalid id");
        res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    // console.log(deletedReview);
    // if you delete a already deleted review than deletedReview will be null
    if (deletedReview === null) {
        req.flash('error', "You're trying to delete a review that's already been deleted.");
        // console.log(id);
        // console.log('*********');
        // console.log(Campground._id); // undefined
        res.redirect(`/campgrounds/${id}`);
    }
    else {
        req.flash('success', 'Successfully deleted a review')
    }
    res.redirect(`/campgrounds/${id}`);
};