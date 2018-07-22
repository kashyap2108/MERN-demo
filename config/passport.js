const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
    passport.use(
        new JwtStrategy(opts , (jwt_payload,done)=> {
            User.findById(jwt_payload.id)
                .then(user => {
                    if(user){
                        console.log('found!!')
                        console.log(user)
                        return done(null,user);
                    }
                    console.log('not found!!')
                    return done(null,false);
                })
                .catch(err => console.log(err));
        })
    );
    
};