var express = require('express');
var router = express.Router();
const urlLink = require('../models/urlLink');
const gt= require('../tools/generalTools');
const ShortLinkGenerator = require('shortid');
ShortLinkGenerator.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ^]');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/:shortenedCode', async (req, res,next) => {
    try {
        if (!req.params.shortenedCode) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        let CalledUrlLink = await urlLink.findOne({shortenedURL : req.params.shortenedCode}).exec();
        if(!CalledUrlLink) next();
        else return res.redirect(CalledUrlLink.originalURL);
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});


module.exports = router;
