const db = require("../config/db");

class BooksRepository {
  async addBook({
    name,
    description,
    author,
    year,
    publisher,
    image
  }) {
    const { rows: [existingBook], } = await db.query(
      `SELECT * FROM books WHERE name = $1 AND author = $2 AND publisher = $3`,
      [name, author, publisher]
    );

    if (existingBook) {
      return 'Este livro já está no banco de dados.';
    }

    const { rows: [book], } = await db.query(
      `INSERT INTO books( name, description, author, year, publisher, image) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
      [
        name,
        description,
        author,
        year,
        publisher,
        image
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
        publisher = $5
        WHERE id = $6 
       RETURNING *`,
      [
        updatedBook.name,
        updatedBook.description,
        updatedBook.author,
        updatedBook.year,
        updatedBook.publisher,
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