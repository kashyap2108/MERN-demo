const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validations/profile');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public

router.get('/test',(req,res) => res.json({msg : "Profile Works"}));

// @route   GET api/profile/
// @desc    Get current users profile
// @access  Private

router.get('/',passport.authenticate('jwt',{session:false}),(req,res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id})
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user!!';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch (err => res.status(404).json(err));
});


// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public

router.get('/all',(req,res) => {
    const errors = {};

    Profile.find()
        .then(profiles => {
            console.log(profiles)
            if(!profiles){
                console.log('No Profiles!!')
                errors.noprofile = 'There are no profiles !!';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch (err => res.status(404).json({profile : 'There are no profiles!!'}));
});















// @route   POST api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle',(req,res) => {
    const errors = {}
    Profile.findOne({handle:req.params.handle})
        .then(profile => {
            console.log('Found Profile!');
            console.log(profile);
            if(!profile){
                console.log('Print Err')
                errors.noprofile = 'There is no profile for this user!!'
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})


// @route   POST api/profile/user/:user_id
// @desc    Get profile by user_id
// @access  Public

router.get('/user/:user_id',(req,res) => {
    errors = {}
    Profile.findOne({user:req.params.user_id})
        .then(profile => {
            console.log(profile);
            if(!profile){
                errors.profile = 'There is no profile for this user!!'
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(400).json('There is no profile for this user !!'));
})




// @route   POST api/profile/
// @desc    Create user profile
// @access  Private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res) => {
    const { errors,isValid }= validateProfileInput(req.body);
    
    // Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    
    
    
    
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle)
        profileFields.handle =req.body.handle;
    if (req.body.company)
        profileFields.company =req.body.company;
    if (req.body.website)
        profileFields.website =req.body.website;
    
    if (req.body.location)
        profileFields.location =req.body.location;
    
    if (req.body.bio)
        profileFields.bio =req.body.bio;
    if (req.body.status)
        profileFields.status =req.body.status;
    if (req.body.github_username)
        profileFields.github_username =req.body.github_username;
    
    if (typeof req.body.skills != 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    profileFields.social = {};
    if (req.body.youtube)
        profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook)
        profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin)
        profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({user:req.user.id})
        .then(profile => {
            if (profile){
                console.log('Update!!')
                Profile.findOneAndUpdate(
                    {user : req.user.id},
                    {$set : profileFields},
                    {new : true}
                )
                .then(profile => res.json(profile));
            }
            else
            {
                // Create

                // Check if handle exists
                Profile.findOne({handle:profileFields.handle}).
                 then(profile =>{
                     if (profile){
                         errors.handle = 'The handle already exists!!'
                         res.status(400).json(errors);
                     }
                 })

                 // Save Profile
                console.log('New Profile!!')
                 new Profile(profileFields).save().then(profile => res.json(profile));
            }
        })
    

    


    
});




module.exports = router;