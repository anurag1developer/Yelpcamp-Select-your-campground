const express = require('express');
const router = express.Router({ mergeParams: true });
// const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
// const ObjectID = require('mongoose').Types.ObjectId;
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.get('/:reviewId/edit', isLoggedIn, isReviewAuthor, catchAsync(reviews.renderEditForm));

router.route('/:reviewId')
    .put(isLoggedIn, isReviewAuthor, validateReview, catchAsync(reviews.updateReview))
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview))

// Long Way
// router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// router.get('/:reviewId/edit', isLoggedIn, isReviewAuthor, catchAsync(reviews.renderEditForm));

// router.put('/:reviewId', isLoggedIn, isReviewAuthor, validateReview, catchAsync(reviews.updateReview));

// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview));

module.exports = router;