const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const wrapAsync = require('../utils/wrapsync.js');
const { saveRedirectUrl } = require('../middleware.js');

const {
    renderSignupForm,
    signupUser,
    renderLoginForm,
    loginUser,
    logoutUser
} = require('../controllers/users.js');

// Signup Routes
router
  .route("/signup")
  .get(renderSignupForm)
  .post(wrapAsync(signupUser));

// Login Routes
router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginUser
  );

// Logout Route
router.get("/logout", logoutUser);

module.exports = router;
