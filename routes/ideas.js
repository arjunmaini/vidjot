const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const {ensureAuthenticated} = require('../helper/auth');


// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea index page
router.get('/',ensureAuthenticated, function (req, res) {
    Idea.find({user:req.user.id})
        .sort({date:'desc'})
        .then(function (ideas) {
            res.render('ideas/index', {
                ideas:ideas
            })
        })
})

// Add Idea form
router.get('/add',ensureAuthenticated, function (req, res) {
    res.render('ideas/add');
})

// Edit Idea form
router.get('/edit/:id',ensureAuthenticated, function (req, res) {
    Idea.findOne({
        _id:req.params.id
    })
        .then(function (idea) {
            if(idea.user != req.user){
                req.flash('error_msg', 'Not Authorised');
                res.redirect('/ideas');
            }else{
                res.render('ideas/edit', {
                    idea:idea
                })
            }
        })
})

// Ideal post validation
router.post('/', ensureAuthenticated,function (req,res) {
    let errors=[];

    if(!req.body.title){
        errors.push({text:'Please add a title.'});
    }

    if(!req.body.details){
        errors.push({text:'Please add some details.'});
    }

    if(errors.length>0){
        res.render('/ideas/add', {
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        const newUser =  {
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        }
        new Idea(newUser).save()
            .then(function (idea) {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas');
            })
    }


})

// Delete Idea
router.delete('/:id', ensureAuthenticated,function (req, res) {
    Idea.remove({_id:req.params.id})
        .then(function () {
            req.flash('success_msg', 'Video Idea Removed');
            res.redirect('/ideas')
        })
})

// Edit Form Process
router.put('/:id',ensureAuthenticated,function (req, res) {
    Idea.findOne({
        _id:req.params.id
    })
        .then(function (idea) {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(function (idea) {
                    req.flash('success_msg', 'Video Idea Updated');
                    res.redirect('/ideas')
                })
        })
})

module.exports = router;