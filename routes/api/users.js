const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
 
// Load User model
const User = require('../../models/User');

// @route  GET/api/users/test
// @desc   Tests users route
// @access Public


router.get('/test',(req,res) => res.json({msg : "Users Works"}));


// @route  GET api/users/register
// @desc   Register User
// @access Public


router.post('/register',(req,res) => {

    const {errors , isValid} = validateRegisterInput(req.body);

    // Check Form Validation
    if (!isValid){
        return res.status(400).json(errors);
    }
    
    
    User.findOne({ email:req.body.email}).then(user => {
        if (user){
            errors.email = 'Email already exists!!'
            return res.status(400).json(errors);
        }
        else{
            const newUser = new User({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password
            });

        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(newUser.password,salt,(err,hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));

            })
        })
        }
    })
});

// @route  GET api/users/login
// @desc   Login User : Generate token
// @access Public

router.post('/login', (req,res) => {

    const {errors , isValid} = validateLoginInput(req.body);


    if (!isValid){
        return res.status(400).json(errors);
    }


    const email = req.body.email;
    const password = req.body.password;

    // Find User by email
    
    User.findOne({email}).then(user => {
        if (!user)
        {
            return res.status(400).json({email:'User not found!'});
        }
        // Check Password!!
        bcrypt.compare(password,user.password).then(isMatch => {
            if (isMatch){
                // User Matched
                // Sign Token

                const payload = {id:user.id,name:user.name} // Create JWT payload
                jwt.sign(payload,keys.secretOrKey,{ expiresIn : 3600},(err,token) => {
                    res.json({
                        success : true,
                        token : 'JWT ' + token
                    })
                    console.log('login');
                    
                });
            }
            else{
                errors.password = 'Password Incorrect';
                return res.status(400).json(errors);
            }
        })
    })
})


// @route  GET api/users/current
// @desc   Return Current User
// @access Private

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res) => {
    res.json({ msg: 'Success'});
})



router.get('/logout',(req,res) => {
   res.status(200).send({auth:false,token:null});
})






module.exports = router;