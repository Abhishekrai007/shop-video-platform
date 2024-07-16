const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema({
    timestamp: Number,
    productId: String,
    position: {
        x: Number,
        y: Number,
    },
});

const videoMetadataSchema = new mongoose.Schema({
    videoUrl: String,
    hotspots: [hotspotSchema],
});

module.exports = mongoose.model('VideoMetadata', videoMetadataSchema, 'videometadatas');