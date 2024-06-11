const db = require("../config/db");

class BooksRepository {

  async getCollectionByName({ collection_name }) {
    const collection = await db.query(`SELECT * FROM collection WHERE name = $1`, [collection_name])
    return collection.rows[0];
  }

  async getCollectionsByName({ collection_name }) {
    const collections = await db.query(`SELECT * FROM collection WHERE name ILIKE $1`, [`%${collection_name}%`])
    return collections.rows;
  }

  async getCollectionByCollectionId({ collection_id }) {
    const collection = await db.query(`
    SELECT collection.name 
    from collection 
    INNER JOIN books 
    ON collection.id = books.collection_id
    WHERE books.collection_id = $1`,
      [collection_id])

    return collection.rows[0];
  }

  async addCollection({ collection_name }) {
    const { rows: [collection], } = await db.query(`INSERT INTO collection(name, volumecount) VALUES($1, $2) RETURNING *`, [collection_name, 0])
    return collection;
  }

  async incrementVolumeCountCollection({ collection_id }) {
    await db.query(`UPDATE collection SET volumecount = volumecount + 1 WHERE id = $1`, [collection_id]);
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
      author: 'author ASC',
      publisher: 'publisher ASC',
      year_asc: 'year ASC',
      year_desc: 'year DESC',
      title_desc: 'title DESC',
      title_asc: 'title ASC',
      collection: ' collection.name ASC, books.name ASC',
      created_at_asc: 'created_at ASC',
      created_at_desc: 'created_at DESC'
    };

    const orderBy = sortOptions[sort] || 'year ASC';
    const offset = (page - 1) * pageSize;

    const books = await db.query(
      `
      SELECT books.id, books.publisher, books.author, books.image, books.name as title, books.year, books.collection_id,
      collection.name as collection_name
      FROM books
      LEFT JOIN collection
      ON books.collection_id = collection.id
      GROUP BY collection.name, books.id
      ORDER BY ${orderBy}
      LIMIT ${pageSize} OFFSET ${offset}
      `
    );
    return books.rows;
  }

  async getBooksByCollectionName({ collection_name }) {
    const books = await db.query(
      `SELECT books.name as title, books.image, books.year, books.id as book_id, books.author
      FROM books
      INNER JOIN collection 
      ON books.collection_id = collection.id
      WHERE collection.name = $1
      ORDER BY books.name ASC
      `,
      [collection_name]
    )

    return books
  }

  async getAddedBookById({ id }) {
    const book = await db.query(
      `
      SELECT books.*, collection.name as collection_name
      FROM books 
      LEFT JOIN collection
      ON books.collection_id = collection.id
      WHERE books.id = $1
      `,
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