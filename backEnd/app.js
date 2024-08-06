const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user');
const BookRoutes = require('./routes/Book')
const bodyParser = require('body-parser');
const path = require('path');
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://Matthieu:1234@cluster0.4szmqif.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use('/api/auth', userRoutes);

  // Routes livres
  app.use('/api/books', BookRoutes); 
  
  // Serveur des images
  app.use('/images', express.static(path.join(__dirname, 'images')));
  

module.exports = app;