const express = require('express');
const VideoMetadata = require('../models/VideoMetadata');

const router = express.Router();

router.get('/metadata', async (req, res) => {
    try {
        const metadata = await VideoMetadata.findOne();
        res.json(metadata);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
