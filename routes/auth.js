const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const generalTools = require('../tools/generalTools');

router.post('/signup',async (req, res) => {
    try{
        if (!req.body.name || !req.body.email || !req.body.password) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        req.body = generalTools.trimObjectValues(req.body);

        let existingUser = await User.findOne({email: req.body.email}).exec();
        if(existingUser) return res.status(409).send({ msg: res.msg('auth.duplicateUser')});

        let newUser = new User({
            Name: req.body.firstName,
            email: req.body.email,
            password: req.body.password,
        });
        newUser = await newUser.save();
        newUser = generalTools.optimizer(newUser.toObject(), ['__v', 'password', 'lastUpdate', 'isDeleted','isActive']);
        return res.status(201).send({msg: res.msg('auth.userCreated'), user:newUser});
    }
    catch(err){
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    }
});

router.post('/signIn',  async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        if (err) return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
        else if (!user) return res.status(401).send({ msg: res.msg('auth.wrongLoginInfo')});

        req.login(user, {session: false}, async (err) => {
            if (err) return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
            user = generalTools.optimizer(user.toObject(), ['__v', 'password', 'lastUpdate']);
            user.id = user._id;
            user.tokenCreationDate = Date.now();
            let refreshTokenPayload = {user: { id: user._id}};
            let refreshToken = 'JWT ' + generalTools.createToken(refreshTokenPayload, '3h');
            let newRefreshToken = new RefreshToken({
                user: user._id,
                refreshToken: refreshToken
            });
            newRefreshToken = await newRefreshToken.save();
            return res.status(200).send({ msg: res.msg('auth.successfullLogin'), accessToken: 'JWT ' + generalTools.createToken(user, '10m'), refreshToken: refreshToken, user: user });
        });

    })(req, res, next);
});

router.get('/token',async (req, res) => {
    try{
        if (!req.headers.authorization) return res.status(400).send({msg: res.msg('global.emptyRequiredFiled')});
        
        let refreshToken = await RefreshToken.findOne({refreshToken: req.headers.authorization}).populate('user').exec();
        if(!refreshToken || !refreshToken.user) return res.status(401).send({msg: res.msg('auth.accessDenied')});
        if (refreshToken) {
            let userObject = generalTools.optimizer(refreshToken.user.toObject(), ['__v', 'password', 'lastUpdate']);
            let user = {
                _id: userObject._id,
                name: userObject.Name,
                email: userObject.email,
                tokenCreationDate: Date.now()
            };
            let newToken = 'JWT ' + generalTools.createToken(user, '5m');        
            return res.status(200).send({token: newToken, user: user});        
        };
    }
    catch(err){
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    }
});

router.get('/logout', async (req, res) => {
    try{
        if (!req.headers.authorization) return res.status(400).send({msg: res.msg('global.emptyRequiredFiled')});
        await RefreshToken.findOneAndDelete({refreshToken: req.headers.refreshToken}).exec();
        return res.status(200).send({msg: res.msg('auth.logOut')});
    }
    catch(err){
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    }
});

module.exports = router;
