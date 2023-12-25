const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const {
  index,
  renderForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
} = require("../controller/listings");

router
  .route("/new")
  .get(isLoggedIn, renderForm)
  .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(createListing));
// .post(upload.single("listing[image]"), (req, res) => {
//   res.send(req.file);
// });

router
  .route("/:id")
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing))
  .get(wrapAsync(showListing));

router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync(renderEditForm))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    isOwner,
    wrapAsync(updateListing)
  );

//get All listings route[ INDEX ROUTE ]
router.get("/", wrapAsync(index));

// New Route
// router.get("/new", isLoggedIn, renderForm);

// SHOW Route
// router.get("/:id", wrapAsync(showListing));

// Create new Listing Route
// router.post("/new", validateListing, wrapAsync(createListing));

// EDIT Get Route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

// UPDATE Put Route
// router.put("/:id/edit", isLoggedIn, isOwner, wrapAsync(updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(destroyListing));

module.exports = router;
