const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body.user;
    console.log(username, email, password);
    const newUser = new User({ username, email });
    const registerUser = await User.register(newUser, password);

    console.log(registerUser, ": is registered");

    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome here...");
      res.redirect("/listings");
    });

    // req.flash("success", "Welcome here...");
    // res.redirect("/listings");
  } catch (error) {
    req.flash("errMsg", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  console.log(req.body);
  req.flash("success", "welcome loggin");
  res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};
