const LocalStrategy = require('passport-local')
.Strategy;

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Load User Model
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({usernameField:'email'}, function (email, password, done) {
        // Match User
        User.findOne({
            email:email
        }).then(function (user) {
            if(!user){
                return done(null, false, {message:'No User Found'});
            }

            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message:'Password Incorrect'});
                }
            })
        })
    }));

    // since we are using mongoose, no need to change these
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}