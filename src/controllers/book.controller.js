const multer = require('multer');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const { Booksservices } = require("../services/book.service");

const bookservice = new Booksservices();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const serviceAccount = require('../../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://bookshelf-6941f.appspot.com"
});
const bucket = admin.storage().bucket();

exports.upload = upload;

const FILE_UPLOAD_ERROR = 'File upload error';
const BOOK_EXISTS_ERROR = 'Esse livro já está no banco de dados';
const SUCCESS_STATUS = 200;
const ERROR_STATUS = 400;

async function uploadFile(req) {
  const fileName = uuidv4() + req.file.originalname;
  const file = bucket.file(fileName);
  const blobStream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(file.name)}?alt=media`;
      resolve(publicUrl);
    });
    blobStream.end(req.file.buffer);
  });
}

exports.addBook = async (req, res, next) => {
  try {
    const { name, description, author, year, publisher } = req.body;
    const image = await uploadFile(req);

    try {
      const response = await bookservice.addBook({
        name,
        description,
        author,
        year,
        image,
        publisher
      });

      res.status(SUCCESS_STATUS).json(response);
    } catch (error) {
      if (error.message === BOOK_EXISTS_ERROR) {
        res.status(ERROR_STATUS).json({ message: error.message });
      } else {
        next(error);
      }
    }
  } catch (error) {
    error.message = FILE_UPLOAD_ERROR;
    next(error);
  }
};

exports.addBookFromAPI = async (req, res, next) => {
  try {
    const { name, description, author, year, image, publisher } = req.body;

    const response = await bookservice.addBook({
      name,
      description,
      author,
      year,
      image,
      publisher
    });

    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const { sort, page = 1, pageSize = 10 } = req.query;
    const response = await bookservice.getBooks({ sort, page, pageSize })

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

exports.getAddedBookById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const response = await bookservice.getAddedBookById({ id })

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

exports.updateBook = async (req, res, next) => {
  try {
    const {
      name,
      description,
      author,
      year,
      publisher
    } = req.body;

    const id = req.params.id;

    const response = await bookservice.updateBook({
      name,
      description,
      author,
      year,
      publisher,
      id
    });


    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    const response = await bookservice.deleteBook({ id });


    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// GOOGLE API CALLS

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
