const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
const videoRoutes = require('./routes/videos');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://test:test@cluster0.kxd8tvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/products', productRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;

// mongodb+srv://test:test@cluster0.kxd8tvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0