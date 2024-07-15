

const BookCtrl = require('../Controllers/Books');

router.post('/', BookCtrl.createBook);