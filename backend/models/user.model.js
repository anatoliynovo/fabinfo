const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "Username can't be empty",
    unique: true
  },
  password: {
    type: String,
    required: "Password can't be empty"
  },
  salt: String
});

// Events
userSchema.pre("save", function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.salt = salt;
      next();
    });
  });
});


// Methods
// Compare input pw with pw in database
userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


// generate JWT Token
userSchema.methods.generateJwt = function() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXP
    }
  );
};

module.exports = mongoose.model("User", userSchema);
