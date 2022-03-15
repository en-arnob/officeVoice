const { body } = require("express-validator");
const User = require("../models/User");

module.exports = [
  body("username")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username should be between 3 to 15 characters long")
    .custom(async username => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject(`Username already taken :) `);
      }
    })
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .custom(async email => {
      let user = await User.findOne({ email });
      if (user) {
        return Promise.reject("Email already registered");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("passwd").custom((passwd, { req }) => {
    if (passwd !== req.body.password) {
      throw new Error("Password did not match");
    }
    return true;
  }),
];
