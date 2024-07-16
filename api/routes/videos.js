const express = require('express');
const VideoMetadata = require("../models/VideoMetadata");

const router = express.Router();

router.get('/metadata', async (req, res) => {
    console.log('Received request for video metadata');
    try {
        const metadata = await VideoMetadata.findOne();
        console.log('Query result:', JSON.stringify(metadata, null, 2));
        if (!metadata) {
            console.log('No metadata found in the database');
            return res.status(404).json({ message: 'No video metadata found' });
        }
        console.log('Sending metadata response');
        res.json(metadata);
    } catch (error) {
        console.error('Error fetching video metadata:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/metadata', async (req, res) => {
    try {
        const newMetadata = new VideoMetadata(req.body);
        await newMetadata.save();
        res.status(201).json(newMetadata);
    } catch (error) {
        console.error('Error creating video metadata:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
