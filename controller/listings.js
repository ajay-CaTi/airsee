const Listing = require("../models/listing");
const ExpressErr = require("../utils/ExpressErr");

module.exports.index = async (req, res) => {
  let listings = await Listing.find();
  res.render("listings/index.ejs", { listings });
};

module.exports.renderForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let listing = await Listing.findById(req.params.id)
    .populate("reviews")
    .populate("owner");
  if (!listing) {
    req.flash("errMsg", "listing you requested does not exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);

  let listing = req.body.listing;
  listing = new Listing(listing);
  listing.owner = req.user._id;

  listing.image = { url, filename };

  listing = await listing.save();
  console.log(listing);
  req.flash("success", "new listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("errMsg", "listing you requested does not exist");
    res.redirect("/listings");
  }
  let original_imageUrl = listing.image.url;
  original_imageUrl = original_imageUrl.replace(
    "/upload",
    "/upload/h_300,w_250"
  );
  console.log(listing, original_imageUrl);
  res.render("listings/edit.ejs", { listing, original_imageUrl });
};

module.exports.updateListing = async (req, res) => {
  let id = req.params.id;
  let listing = await req.body.listing;
  if (!listing) {
    next(new ExpressErr(400, "send valid data for listing"));
    res.redirect("/listings");
  }
  listing = await Listing.findByIdAndUpdate(id, { ...listing });

  // for saving image logic
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  console.log(listing, "listing updated");
  req.flash("success", "listing updated");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyListing = async (req, res) => {
  let listing = await Listing.findByIdAndDelete(req.params.id, { new: true });
  if (!listing) {
    req.flash("errMsg", "listing you requested does not exist");
    res.redirect("/listings");
  }
  console.log(listing, "listing delete");
  req.flash("success", "listing deleted");
  res.redirect(`/listings`);
};
