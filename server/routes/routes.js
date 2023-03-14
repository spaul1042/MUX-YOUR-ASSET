const express = require('express');
const Model = require('../models/model');

const router = express.Router()

router.get('/get', async (req, res) => {
    const documents = Model.find();
    res.status(200).json(documents);

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})
router.post('/post', async (req, res) => {
    const data = new Model({
        account_address:req.body.account_address,
        name: req.body.name
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = router;
