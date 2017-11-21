const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/login', function (req, res) {
    res.render('users/login');
});

router.get('/register', function (req, res) {
    res.render('users/register');
});

// Login Form Post
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req, res, next);

})

// Register Form Post
router.post('/register', function (req, res) {
    let errors=[];

    if(req.body.password!=req.body.password2){
        errors.push({text:'Passwords do not match'});
    }

    if(req.body.password.length < 4){
        errors.push({text:'Password must be at least 4 characters'});
    }

    if(errors.length>0){
        res.render('users/register', {
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2

        })
    }else{
        User.findOne({email:req.body.email})
            .then(function (user) {
                if(user){
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/login');
                }else{
                    const newUser = {
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password
                    }

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            if(err) throw err;
                            newUser.password = hash;
                            new User(newUser).save()
                                .then(function (user) {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(function (err) {
                                    console.log(err);
                                    return;
                                })
                        });
                    });

                }
            })


    }
})

// Logout User
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;