/* Passport wird zur Authentifizierung innerhalb der Node js App */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user.model');

passport.use(
  new LocalStrategy(
    {
      usernameField: "username"
    },
    (username, password, done) => {
      User.findOne(
        {
          username: username
        },
        (err, user) => {
          if (err) {
            return done(err);

            // Unbekannter User
          } else if (!user) {
            return done(null, false, {
              message: "Invalid username. Try again!"
            });

            // Falsches Passwort
          } else if (!user.verifyPassword(password)) {
            return done(null, false, {
              message: "Wrong password. Try again!"
            });

            // Authentifizierung erfolgreich
          } else {
            return done(null, user);
          }
        }
      );
    }
  )
);
