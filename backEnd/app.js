const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const path = require('path');
const multer = require('./middleware/multer-config');
const { createBook } = require('./Controllers/Books');
const { getBooks } = require('./Controllers/Books');
const { getBooksId } = require('./Controllers/Books');
const { putBookId } = require('./Controllers/Books');
const { deleteBookId } = require('./Controllers/Books');
const { addRating } = require('./Controllers/Books');
const { getBestRating } = require('./Controllers/Books');
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
app.post('/api/books', auth, multer, createBook);
app.get('/api/books/bestrating', getBestRating);
app.get('/api/books', getBooks);
app.get('/api/books/:id', getBooksId);
app.put('/api/books/:id', auth, putBookId);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.delete('/api/books/:id', auth, deleteBookId);
app.post('/api/books/:id/rating', auth, addRating);

module.exports = app;