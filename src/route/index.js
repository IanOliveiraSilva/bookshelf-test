const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');

const router = express.Router();
router.use(cookieParser());

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/addBook', (req, res) => {
  res.render('addbook');
});

router.get('/book/:id', async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`https://localhost:3333/api/book/${id}`);
  const data = await response.json();
  const bookData = data.body.bookData;

  res.render('book', { bookData: bookData });
});

router.get('/addedbook/:id', async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`https://localhost:3333/api/addedBook/${id}`);
  
  const data = await response.json();
  
  res.render('addedBook', { bookData: data[0] });
});

router.get('/updateBook/:id', async (req, res) => {
  res.render('updateBook');
});

router.get('/bookshelf', async (req, res) => {
  let page = req.query.page || '1';
  let sort = req.query.sort;
  let pageSize = req.query.pagesize || 50;
  
  const url = `http://localhost:3333/api/book/?pageSize=${pageSize}&page=${page}&sort=${sort}`;
  
  const response = await fetch(url);
  const data = await response.json();

  let totalPages = Math.ceil(data.Quantidade[0].count / pageSize);

  res.render('bookshelf', {books: data, page: page, totalPages:totalPages}) 
});







module.exports = router;
