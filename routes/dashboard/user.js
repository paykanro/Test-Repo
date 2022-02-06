const express = require('express');
const router = express.Router();
const User = require('../models/user');
const generalTools = require('../tools/generalTools');

router.put('/:userId',async (req, res) => {
    try{
        req.body = generalTools.trimObjectValues(req.body);
        delete req.body.role;
        delete req.body.creationDate;
        delete req.body.lastUpdate
        let existingUser = await User.findByIdAndUpdate(req.user._id,req.body).exec();
        existingUser = generalTools.optimizer(existingUser.toObject(), ['__v', 'password', 'lastUpdate', 'isDeleted','isActive']);
        return res.status(201).send({msg: res.msg('auth.userCreated'), data:existingUser});
    }
    catch(err){
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    }
});

module.exports = router;
