const express = require('express');
const router = express.Router();
const BookCtrl = require('../Controllers/Books');

const { upload , optimize } = require('../middleware/multer-config');

const auth = require('../middleware/auth');

router.post('/', auth, upload, optimize,  BookCtrl.createBook);
router.get('/', BookCtrl.getBooks);
router.get('/bestrating', BookCtrl.getBestRating);
router.get('/:id', BookCtrl.getBooksId);
router.put('/:id', auth, upload, optimize, BookCtrl.putBookId);
router.delete('/:id',auth, BookCtrl.deleteBookId);
router.post('/:id/rating',auth, BookCtrl.addRating);
module.exports = router;