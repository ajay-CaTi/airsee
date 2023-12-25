const Listing = require("./models/listing");
const ExpressErr = require("./utils/ExpressErr");
const { listingSchema, reviewSchema } = require("./utils/schema");

module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("errMsg", "you must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    console.log(req.user, "in middleware");
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(res.locals.currUser, "currUser");
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("errMsg", "you are not owner of this listing");
      return res.redirect(`/listings/${req.params.id}`);
    }
    next();
  } catch (error) {
    req.flash("errMsg", "you must login first");
    res.redirect("/login");
  }
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};
