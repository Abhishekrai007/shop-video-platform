const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
