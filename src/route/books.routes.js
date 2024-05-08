const router = require("express-promise-router")();
const bookController = require("../controllers/books.controller");

router.get("/book/:id", bookController.getBookById);

router.get("/books/:title", bookController.getBooksByTitle);

router.get("/getFavoriteBooks/:id", bookController.getFavoriteBooks);

router.get("/getReadStatus/:id", bookController.getReadStatus);

router.get("/getOwnStatus/:id", bookController.getOwnStatus);

router.get("/getWantToRead/:id", bookController.getWantToRead);

router.get("/getBooksStatusCount/:id", bookController.getBooksStatusCounts);

router.post("/toggleFavoriteBooks/:id", bookController.toggleFavoriteBooks);

router.post("/toggleReadStatus/:id", bookController.toggleReadStatus);

router.post("/toggleOwnStatus/:id", bookController.toggleOwnStatus);

router.post("/toggleWantToRead/:id", bookController.toggleWantToRead);

module.exports = router;
