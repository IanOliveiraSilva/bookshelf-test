const { Bookservice } = require("../services/books.service");

const bookservice = new Bookservice();

exports.getBookById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await bookservice.getBookById({ id });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getBooksByTitle = async (req, res, next) => {
  try {
    const title = req.params.title;
    const response = await bookservice.getBooksByTitle({ title });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getFavoriteBooks = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const response = await bookservice.getFavoriteBooks({ userId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getReadStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const response = await bookservice.getReadStatus({ userId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getOwnStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const response = await bookservice.getOwnStatus({ userId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getWantToRead = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const response = await bookservice.getWantToRead({ userId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getBooksStatusCounts = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const response = await bookservice.getBooksStatusCount({ userId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.toggleFavoriteBooks = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { bookId } = req.body;

    const response = await bookservice.ToggleFavoriteBooks({ userId, bookId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.toggleReadStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { bookId } = req.body;

    const response = await bookservice.toggleReadStatus({ userId, bookId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.toggleOwnStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { bookId } = req.body;

    const response = await bookservice.toggleOwnStatus({ userId, bookId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.toggleWantToRead = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { bookId } = req.body;

    const response = await bookservice.toggleWantToRead({ userId, bookId });
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};