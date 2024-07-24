const mongoose = require('mongoose');
const Book = require('../models/Book');
const Schema = mongoose.Schema;
const Rating = require('../models/Rating');
const fs = require('fs');
const { error } = require('console');

exports.createBook = (req, res, next) => {
    console.log(JSON.parse(req.body.book));
    console.log(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
)
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
        ...bookObject, //
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });
  book.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};


exports.getBooksId = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
};

exports.putBookId = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};


exports.deleteBookId = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        if (book.userId.toString() !== req.auth.userId.toString()) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        console.log("Je suis arrivé au else");

        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
            if (err) {
                console.error('Erreur lors de la suppression du fichier:', err);
                return res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error: err });
            }

            Book.deleteOne({ _id: book._id }) // Utilisez book._id ici
                .then(() => {
                    res.status(200).json({ message: 'Objet supprimé !' });
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression du livre:', error);
                    res.status(500).json({ message: 'Erreur lors de la suppression du livre', error: error });
                });
        });
    })
    .catch(error => {
        console.error('Erreur lors de la recherche du livre:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche du livre', error: error });
    });
};

exports.addRating = (req, res, next) => {
  console.log("add rating à été appelé")
  console.log(req.params.id)

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.log('ID invalide:', req.params.id);
    return res.status(400).json({ message: 'ID invalide' });
  }
  // Trouver le livre correspondant à l'ID
  Book.findOne({ _id: req.params.id })
    .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' });
        }
        

        ratingObject = req.body; // Assurez-vous que la requête contient l'objet rating
        console.log("Contenu de req.body :"+  JSON.stringify(req.body, null, 2));
        // Créez une nouvelle instance de Rating avec les données de notation
        const rating ={ 
          userId: req.auth.userId,
           grade: req.body.rating
       };
        
        
          book.ratings.push(rating);
          let totalRating = 0;
          console.log('book ratings' + book.ratings)
          for (let rating of book.ratings) {
            console.log(rating)
            totalRating += rating.grade; // Assuming the rating value is stored in 'grade'
            console.log(rating.garde);
        
          }
        console.log( 'total rating ' + totalRating);
          book.averageRating = totalRating / book.ratings.length ; 
          console.log( 'book average' + book.averageRating)

          return book.save();

    })
    .then((updatedBook) => res.status(201).json(updatedBook))
    .catch(error => {
      console.log("erreur dans la recherche du livre" + error)
      res.status(500).json({ error });
    });
};

exports.getBestRating = (req, res, next) => {
  console.log("getbestrating est appelé");
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3) 
    .then(books => {
      console.log("best rating tableau : " + books)
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};


