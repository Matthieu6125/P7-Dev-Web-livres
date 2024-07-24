const express = require('express');
const router = express.Router();
const BookCtrl = require('../Controllers/Books');

router.post('/', BookCtrl.createBook);
router.get('/', BookCtrl.getBooks);
router.get('/bestrating', BookCtrl.getBestRating);
router.get('/:id', BookCtrl.getBooksId);
router.put('/:id', BookCtrl.putBookId);
router.delete('/:id', BookCtrl.deleteBookId);
router.post('/:id/rating', BookCtrl.addRating);
module.exports = router;