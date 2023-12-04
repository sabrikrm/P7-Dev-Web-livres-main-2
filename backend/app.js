require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );
app.use(express.json());
app.use('/images', express.static('images'));

mongoose.connect('mongodb+srv://Cluster72255:T1pRYWBgbUJk@cluster72255.su3sktc.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log('Connexion à MongoDB échouée !', error));

app.use(cors());


const bookRoutes = require('./routes/bookRoutes'); 
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes); 
app.use('/api/books', bookRoutes); 

module.exports = app;
