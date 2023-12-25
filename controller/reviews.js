const Review = require("../models/review");
const Listing = require("../models/listing");

// create review
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  console.log(req.params.id, listing, "listing", newReview, "newReview");

  await listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  console.log("new review saved");
  req.flash("success", "new review added");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, rId } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: rId },
  });
  await Review.findByIdAndDelete(rId);

  console.log(listing);
  console.log("review deleted");
  req.flash("success", "review deleted");
  res.redirect(`/listings/${req.params.id}`);
};
