const express = require('express');
const VideoMetadata = require("../models/VideoMetadata");

const router = express.Router();

router.get('/metadata', async (req, res) => {
    console.log('received request for video metadata');
    try {
        const metadata = await VideoMetadata.findOne();
        if (!metadata) {
            return res.status(404).json({ message: 'no video metadata found' });
        }
        res.json(metadata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/metadata', async (req, res) => {
    try {
        const newMetadata = new VideoMetadata(req.body);
        await newMetadata.save();
        res.status(201).json(newMetadata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
