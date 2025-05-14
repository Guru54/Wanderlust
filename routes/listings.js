const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapsync.js");
const multer = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });
const {
    isLoggedIn,
     isOwner,
     validateListing
} = require('../middleware.js');
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing
} = require('../controllers/listings.js');

router
  .route("/")
  .get(wrapAsync(index)) // index route
  .post( // create route
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing)
 );


// new route
router.get(
    "/new",
    isLoggedIn,
    renderNewForm,
);

router
   .route("/:id")
   .get(wrapAsync(showListing)) // show route
   .put( // update route
     isLoggedIn,
     isOwner,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(updateListing)
   )
   .delete(// delete route
    isLoggedIn,
    isOwner,
    wrapAsync(deleteListing)
   );


// edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm)
);


module.exports = router;