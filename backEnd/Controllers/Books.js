
const Book = require('../models/Book');

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