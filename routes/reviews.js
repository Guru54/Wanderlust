const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const { createReview, deleteReview } = require('../controllers/reviews.js');

// Create Review
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;
