const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema({
    timestamp: Number,
    productId: mongoose.Schema.Types.ObjectId,
    position: {
        x: Number,
        y: Number,
    },
});

const videoMetadataSchema = new mongoose.Schema({
    videoUrl: String,
    hotspots: [hotspotSchema],
});

module.exports = mongoose.model('VideoMetadata', videoMetadataSchema);
