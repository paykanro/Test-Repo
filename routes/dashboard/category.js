const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
const UrlLink = require('../../models/urlLink');

router.get('/my', async (req, res) => {
    try {
        let myCategoriesList =  await Category.find({user : req.user.id},{id:1, title:1});
        return res.json({msg: res.msg('category.myList'), data: myCategoriesList});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.title) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        let newCategory = new Category({title: req.body.title, user: req.user.id});
        newCategory = await newCategory.save();
        return res.json({msg: res.msg('category.created'), data: newCategory});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

router.delete('/:id', async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        await UrlLink.deleteMany({category:req.params.id, user: req.user.id});
        await Category.findOneAndDelete({_id:req.params.id, user: req.user.id});
        return res.json({msg: res.msg('category.deleted'), data: null});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

router.put('/:id', async (req, res) => {
    try {
        if (!req.body.title) return res.status(400).send({msg: res.msg('global.requiredFiled')});
        let updatedCategory =  await Category.findOneAndUpdate({_id:req.params.id, user: req.user.id},{title : req.body.title});
        return res.json({msg: res.msg('category.updated'), data: updatedCategory});
    } catch (err) {
        return res.status(500).send({ msg: res.msg('global.serverInternalError'), err: err.message });
    };
});

module.exports = router;