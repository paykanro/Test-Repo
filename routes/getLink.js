const express = require('express');
const ShortLinkGenerator = require('shortid');
const QRCode = require('qrcode')
const router = express.Router();
const urlLink = require('../models/urlLink');
const gt= require('../tools/generalTools');
ShortLinkGenerator.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ^]');

router.get('/:shortenedCode', async (req, res,next) => {
    try {
        if (!req.params.shortenedCode) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        let CalledUrlLink = urlLink.findOne({shortenedURL : shortenedCode});
        if(!CalledUrlLink) next();
        CalledUrlLink.click++;
        CalledUrlLink.save();
        res.redirect(CalledUrlLink.originalURL);
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

module.exports = router;