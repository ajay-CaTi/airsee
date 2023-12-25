if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
// const MONGO_CONN = "mongodb://127.0.0.1:27017/nn";
const MONGO_CONN = process.env.ATLASDB_URL;
const PORT = 4000;
const engine = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

main()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

async function main() {
  mongoose.connect(MONGO_CONN);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set(path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: MONGO_CONN,
  crypto: {
    secret: process.env.SECRET,
    touchAfter: 24 * 3600,
  },
});

store.on("error", () => {
  console.log("error in mongo-session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.errMsg = req.flash("errMsg");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@mail.com",
    username: "student-one",
  });
  // to store user and password
  let registerUser = await User.register(fakeUser, "helloworld");
  res.send(registerUser);
});

// import listing ROUTES
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Error handler Middleware
app.all("*", (req, res) => {
  // throw new ExpressErr(404, "page not found");
  res.status(404).render("Error.ejs", { message: "page not found" });
});

app.use((err, req, res, next) => {
  const { status = 400, message = "some error occured" } = err;
  console.log("--Err--Occured Error name:- ", err.name);
  if (err.name === "ValidationError") {
    console.log("This is validation error plz follow rules");
    console.dir(err.message);
  }
  if (err.name === "CastError") {
    console.log("This is CastError error");
  }

  // res.status(status).send(message);
  res.status(status).render("Error.ejs", { message });
});

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});
