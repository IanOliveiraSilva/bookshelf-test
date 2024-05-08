const router = require("express-promise-router")();
const bookController = require("../controllers/book.controller");
const { upload } = require("../controllers/book.controller");

router.post(
    "/book/",
    upload.single('image'),
    bookController.addBook
);

router.post(
    "/book/api",
    bookController.addBookFromAPI
)

router.get(
    "/book/",
    bookController.getBooks
)

router.get(
    "/addedBook/:id",
    bookController.getAddedBookById
)

router.patch(
    "/book/:id",
    bookController.updateBook
);

router.delete(
    "/book/:id",
    bookController.deleteBook
);



module.exports = router;
