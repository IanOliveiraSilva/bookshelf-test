const db = require("../config/db");

class BooksRepository {

  async getCollectionByName({ collection_name }) {
    const collection = await db.query(`SELECT * FROM collection WHERE name = $1`, [collection_name])
    return collection.rows;
  }

  async addCollection({ collection_name }) {
    const { rows: [collection], } = await db.query(`INSERT INTO collection(name) VALUES($1) RETURNING *`, [collection_name])
    return collection;
  }

  async getExistingBook({ name, author, publisher }) {
    const { rows: [existingBook], } = await db.query(
      `SELECT * FROM books WHERE name = $1 AND author = $2 AND publisher = $3`,
      [name, author, publisher]
    );
  }

  async addBook({
    name,
    description,
    author,
    year,
    publisher,
    image,
    genre,
    pagecount,
    lang,
    collection_id
  }) {
    const { rows: [existingBook], } = await db.query(
      `SELECT * FROM books WHERE name = $1 AND author = $2 AND publisher = $3`,
      [name, author, publisher]
    );

    if (existingBook) {
      throw new Error("Esse livro já está no banco de dados");
    }

    const { rows: [book], } = await db.query(
      `INSERT INTO books( name, description, author, year, publisher, image, genre, pagecount, lang, collection_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
      [
        name,
        description,
        author,
        year,
        publisher,
        image,
        genre,
        pagecount,
        lang,
        collection_id
      ]
    );

    return {
      message: "Livro adicionado com sucesso",
      book: book
    };
  }

  async getBooks({ sort, page, pageSize }) {
    const sortOptions = {
      author: 'author DESC',
      publisher: 'publisher ASC',
      year_asc: 'year ASC',
      year_desc: 'year DESC',
      title_desc: 'name ASC',
      title_asc: 'name DESC'
    };

    const orderBy = sortOptions[sort] || 'year ASC';
    const offset = (page - 1) * pageSize;

    const books = await db.query(
      `SELECT id, image, name, year
       FROM books
       GROUP BY id
       ORDER BY ${orderBy}
       LIMIT ${pageSize} OFFSET ${offset}`
    );


    return books.rows;
  }

  async getAddedBookById({ id }) {
    const book = await db.query(
      `SELECT *
       FROM books WHERE id = $1`,
      [id]
    );

    return book;
  }

  async updateBook(updatedBook, id) {
    const newBook = await db.query(
      `UPDATE books 
       SET name = $1, 
        description = $2, 
        author = $3, 
        year = $4,
        publisher = $5,
        genre = $6,
        pagecount = $7,
        lang = $8
        WHERE id = $9 
       RETURNING *`,
      [
        updatedBook.name,
        updatedBook.description,
        updatedBook.author,
        updatedBook.year,
        updatedBook.publisher,
        updatedBook.genre,
        updatedBook.pagecount,
        updatedBook.lang,
        id
      ]
    );

    return newBook.rows[0];
  }

  async deleteBook({ id }) {

    const { rows } = await db.query(
      `DELETE FROM books
       WHERE id = $1`,
      [id]
    );

    return rows;
  }

  async getBooksCount({ }) {
    const bookCount = await db.query(`SELECT COUNT(*)
       FROM books`);

    return bookCount.rows;
  }


}

module.exports = { BooksRepository };