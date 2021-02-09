// Import required Module
const passport = require("passport");
const mongoose = require("mongoose");

// Import user.model
const User = mongoose.model("User");

// Authentication
module.exports.authenticate = (req, res, next) => {
  // call Passport Authentification
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(400).json(err);

    } else if (user) {
      return res.status(200).json({
        token: user.generateJwt()
      });

      // unknown user or wrong password
    } else {
      return res.status(404).json(info);
    }
  })(req, res);
};

// register an user -> no frame for register, insert user directly in mongodb
module.exports.register = (req, res, next) => {
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.save((err, doc) => {
    if (!err) {
      res.send(doc);
    } else if(err.code == 11000) {
        res.status(422).send(['Duplicate username found']);
    }else {
      return next(err);
    }
  });
};