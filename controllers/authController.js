const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", { title: "Sign-up", error: {}, value: {} });
};

exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/auth/signup", {
      title: "Sign-up",
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
    });
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 12);
    let user = new User({
      username,
      email,
      password: hashedPassword,
    });

    let createdUser = await user.save();
    // console.log("User Created Successfully", createdUser);
    res.render("pages/auth/login", { title: "Login", error: "" });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
exports.loginGetController = (req, res, next) => {
  // let bool = req.session.isLoggedIn;
  // let us = req.session.user;
  // console.log(bool, us);
  res.render("pages/auth/login", { title: "Login", error: "" });
};
exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;
  // console.log(email, password);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      let error = {
        msg: "Invalid User",
      };
      return res.render("pages/auth/login", {
        title: "Login",
        error: error,
      });
    }

    let match = await bcrypt.compare(password, user.password);

    if (!match) {
      let e = {
        msg: `Incorrect Password for ${user.email}`,
      };

      return res.render("pages/auth/login", {
        title: "Login",
        error: e,
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
    // console.log("Successfully logged in", user);
    res.redirect("/feed");
    // this.loginGetController();
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy(e => {
    if (e) {
      console.log(e);
      return next(e);
    }
    return res.redirect("/auth/login");
  });
};
