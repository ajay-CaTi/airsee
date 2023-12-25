const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isOwner } = require("../middleware");
const { createReview, destroyReview } = require("../controller/reviews");

// CREATE Review Route
router.post("/", validateReview, isOwner, wrapAsync(createReview));
// Delete Review Route
router.delete("/:rId", isOwner, wrapAsync(destroyReview));

module.exports = router;
