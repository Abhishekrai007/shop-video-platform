const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching product with ID:', req.params.id);
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            console.log('Product not found:', req.params.id);
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log('Product found:', product);
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;