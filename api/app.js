const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
const videoRoutes = require('./routes/videos');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect('mongodb+srv://test:test@cluster0.kxd8tvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to MongoDB');
}).catch((error) => {
    console.error(error);
});



app.use('/api/products', productRoutes);
app.use('/api/videos', videoRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});


module.exports = app;

// mongodb+srv://test:test@cluster0.kxd8tvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0