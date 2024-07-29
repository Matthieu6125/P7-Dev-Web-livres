const mongoose = require('mongoose');
const Book = require('../models/Book');
const Schema = mongoose.Schema;
const fs = require('fs');
const { error } = require('console');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
        ...bookObject, 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });
  book.save().then(() => {
      res.status(201).json({ message: 'Post saved successfully!'});
    })
    .catch(
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
  console.log("putBook appelé");
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };

delete bookObject._userId;

Book.findOne({_id: req.params.id})
    .then((book) => {      
      if (book.userId != req.auth.userId) {
            res.status(403).json({ error });
        } else { 
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
                return res.status(500).json({ err });
            }
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(403).json({ error }));
        });
            
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });

};


exports.deleteBookId = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
        if (!book) {
            return res.status(404).json({ error });
        }

        if (book.userId.toString() !== req.auth.userId.toString()) {
            return res.status(401).json({ error });
        }

        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
            if (err) {
                return res.status(500).json({ err });
            }

            Book.deleteOne({ _id: book._id })
                .then(() => {
                    res.status(200).json({ message: 'Objet supprimé !' });
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        });
    })
    .catch(error => {
        res.status(500).json({ error });
    });
};

exports.addRating = (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error });
  }
  Book.findOne({ _id: req.params.id })
    .then(book => {
        if (!book) {
          return res.status(404).json({ error });
        }
        const rating ={ 
          userId: req.auth.userId,
           grade: req.body.rating
       };
          book.ratings.push(rating);
          let totalRating = 0;
          for (let rating of book.ratings) {
            totalRating += rating.grade;
          }
          book.averageRating = totalRating / book.ratings.length ; 
          return book.save();
    })
    .then((updatedBook) => res.status(201).json(updatedBook))
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3) 
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(404).json({ error });
    });
};


