const mongoose = require("mongoose");
const Listing = require("../models/listing");
let { data } = require("./data");

// console.log(data);

main()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/nn");
}

async function inserListing() {
  await Listing.deleteMany();
  let newData = data.map((obj) => ({
    ...obj,
    owner: "65816d0a795e861d01805599",
  }));
  console.log(newData);
  await Listing.insertMany(newData);
  console.log("data inserted success");
}

inserListing();
