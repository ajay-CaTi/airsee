const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: {
    url: String,
    filename: String,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  location: { type: String, required: true },
  country: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(res, "listing deleted");
  }
});

module.exports = mongoose.model("Listing", listingSchema);
