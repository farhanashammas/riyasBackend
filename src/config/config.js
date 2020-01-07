const passport = require('passport');
const LocalStrategy = require('passport-local');
const { signupUserModel } = require('../models/signupUserModel');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    signupUserModel.findOne({ email: email }, (err, user) => {
        if (user) {
            var user=new signupUserModel(user);
            if (!err && user.validatePassword(password)) {
                return done(null, user);
            }
        }else
            //fail

            return done(null, false, { errors: 'email or password is invalid' });

        });
}));