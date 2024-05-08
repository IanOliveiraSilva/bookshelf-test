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

exports.addBook = async (req, res, next) => {
  try {
    const { name, description, author, year, publisher } = req.body;

    const fileName = uuidv4() + req.file.originalname;

    const file = bucket.file(fileName);

    const blobStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    blobStream.on('error', (err) => next(err));

    blobStream.on('finish', async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(file.name)}?alt=media`;

      const response = await bookservice.addBook({
        name,
        description,
        author,
        year,
        image: publicUrl,
        publisher
      });

      res.status(200).json(response);
    });

    blobStream.end(req.file.buffer);

  } catch (error) {
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
