const express = require('express');
const ShortLinkGenerator = require('shortid');
const QRCode = require('qrcode')
const router = express.Router();
const gt= require('../../tools/generalTools');
const UrlLink = require('../../models/urlLink');
ShortLinkGenerator.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ^]');

router.post('/temp', async (req, res) => {
    try {
        if (!req.body.url) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        //if(!gt.checkURLValidate(req.body.url)) return res.status(400).send({msg: res.msg('urlLink.invalidURL')});
        let shortenedURL = await ShortLinkGenerator.generate(req.body.url);
        let qrcode = await QRCode.create(process.env.shortLinkRoot + shortenedURL);
        return res.json({msg: res.msg('tempLink.created'), data:{shortened: shortenedURL, qrcode: qrcode}});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.url, !req.body.category) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        let shortenedURL = await ShortLinkGenerator.generate(req.body.url);
        let qrcode = await QRCode.create(process.env.shortLinkRoot + shortenedURL);
        
        let newUrlLink = new UrlLink({
            title: (req.body.title? req.body.title : 'Link'),
            user: req.user._id,
            originalURL: req.body.url,
            shortenedURL: shortenedURL,
            qrcode: qrcode,
            category: req.body.category
        });
        newUrlLink = await newUrlLink.save();
        return res.json({msg: res.msg('link.c'), data: newUrlLink});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

router.delete('/:id', async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        await UrlLink.findOneAndDelete({_id: req.params.id, user: req.user.id})
        return res.json({msg: res.msg('link.Deleted'), data: ''});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

router.get('/all', async (req, res) => {
    try {
        let myURLLinksList= await UrlLink.find({user: req.user.id}).populate('category','title id');
        return res.json({msg: res.msg('link.getMyList'), data: myURLLinksList});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});
router.get('/:categoryId', async (req, res) => {
    try {
        let myURLLinksList= await UrlLink.find({user: req.user.id, category: req.params.categoryId}).populate('category','title id');
        return res.json({msg: res.msg('link.getMyList'), data: myURLLinksList});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

module.exports = router;