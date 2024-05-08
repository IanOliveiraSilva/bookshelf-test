const db = require("../config/db");

class BookRepository {
  async getBooksStatusCounts({ userId}){
    const { rows: favoriteCounts } = await db.query(
      `SELECT COUNT(*) AS total_favorite_books_count 
        FROM user_books 
        WHERE favorite = true AND user_id = $1`,
      [userId]
    );

    const { rows: wantToReadCounts } = await db.query(
      `SELECT COUNT(*) AS total_want_to_read_books_count 
        FROM user_books 
        WHERE want_to_read = true AND user_id = $1`,
      [userId]
    );

    const { rows: ownBooksCounts } = await db.query(
      `SELECT COUNT(*) AS total_own_books_count 
        FROM user_books 
        WHERE own_status = true AND user_id = $1`,
      [userId]
    );

    const { rows: readedBooksCounts } = await db.query(
      `SELECT COUNT(*) AS total_readed_books_count 
        FROM user_books 
        WHERE read_status = true AND user_id = $1`,
      [userId]
    );

    return {
      totalFavoriteBooksCount: favoriteCounts[0].total_favorite_books_count,
      totalWantToReadBooksCount: wantToReadCounts[0].total_want_to_read_books_count,
      totalOwnBooksCount: ownBooksCounts[0].total_own_books_count,
      totalReadedBooksCount: readedBooksCounts[0].total_readed_books_count
    };
  }

  async getFavoriteBooks({ userId }) {
    const { rows: favoriteBooksRows } = await db.query(
      `SELECT 
            user_id, 
            id, 
            book_id, 
            created_at, 
            updated_at 
        FROM 
            user_books 
        WHERE 
            favorite = true AND user_id = $1`,
      [userId]
    );

    return {
      favoriteBooks: favoriteBooksRows
    };
  }

  async getReadStatus({ userId }) {
    const { rows: readStatusRows } = await db.query(
      `SELECT 
            user_id, 
            id, 
            book_id, 
            created_at, 
            updated_at 
        FROM 
            user_books 
        WHERE 
            read_status = true AND user_id = $1`,
      [userId]
    );

    return {
      favoriteBooks: readStatusRows
    };
  }

  async getOwnStatus({ userId }) {
    const { rows: ownStatusRow } = await db.query(
      `SELECT 
            user_id, 
            id, 
            book_id, 
            created_at, 
            updated_at 
        FROM 
            user_books 
        WHERE 
            own_status = true AND user_id = $1`,
      [userId]
    );

    return {
      favoriteBooks: ownStatusRow
    };
  }

  async getWantToRead({ userId }) {
    const { rows: WantToReadRow } = await db.query(
      `SELECT 
            user_id, 
            id, 
            book_id, 
            created_at, 
            updated_at 
        FROM 
            user_books 
        WHERE 
        want_to_read = true AND user_id = $1`,
      [userId]
    );

    return {
      favoriteBooks: WantToReadRow
    };
  }

  async toggleFavoriteBook({ userId, bookId }) {
    const existingFavorite = await db.query(
      "SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2",
      [userId, bookId]
    );

    if (existingFavorite.rows.length === 0) {
      await db.query(
        `INSERT INTO user_books (user_id, book_id, read_status, own_status, favorite, want_to_read, rating, review, created_at, updated_at) 
        VALUES ($1, $2, false, false, true, false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userId, bookId]
      );
      return "Adicionado aos favoritos.";
    }

    const currentFavoriteStatus = existingFavorite.rows[0].favorite;
    const newFavoriteStatus = !currentFavoriteStatus;

    await db.query(
      "UPDATE user_books SET favorite = $1 WHERE user_id = $2 AND book_id = $3",
      [newFavoriteStatus, userId, bookId]
    );

    return newFavoriteStatus ? "Adicionado aos favoritos." : "Removido dos favoritos.";
  }

  async toggleReadStatus({ userId, bookId }) {
    const existingBook = await db.query(
      "SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2",
      [userId, bookId]
    );

    if (existingBook.rows.length === 0) {
      await db.query(
        `INSERT INTO user_books (user_id, book_id, read_status, own_status, favorite, want_to_read, rating, review, created_at, updated_at) 
        VALUES ($1, $2, true, false, false, false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userId, bookId]
      );
      return "Status de leitura marcado como lido.";
    }

    const currentBook = existingBook.rows[0];
    const newReadStatus = !currentBook.read_status;

    await db.query(
      `UPDATE user_books SET read_status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $2 AND book_id = $3`,
      [newReadStatus, userId, bookId]
    );

    return newReadStatus ? "Status de leitura marcado como lido." : "Status de leitura desmarcado.";
  }

  async toggleOwnStatus({ userId, bookId }) {
    const existingBook = await db.query(
      "SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2",
      [userId, bookId]
    );

    if (existingBook.rows.length === 0) {
      await db.query(
        `INSERT INTO user_books (user_id, book_id, read_status, own_status, favorite, want_to_read, rating, review, created_at, updated_at) 
        VALUES ($1, $2, false, true, false, false, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userId, bookId]
      );
      return "Status de posse do livro marcado como próprio.";
    }

    const currentBook = existingBook.rows[0];
    const newOwnStatus = !currentBook.own_status;

    await db.query(
      `UPDATE user_books SET own_status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $2 AND book_id = $3`,
      [newOwnStatus, userId, bookId]
    );

    return newOwnStatus ? "Status de posse do livro marcado como próprio." : "Status de posse do livro desmarcado.";
  }

  async toggleWantToRead({ userId, bookId }) {
    const existingBook = await db.query(
      "SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2",
      [userId, bookId]
    );

    if (existingBook.rows.length === 0) {
      await db.query(
        `INSERT INTO user_books (user_id, book_id, read_status, own_status, favorite, want_to_read, rating, review, created_at, updated_at) 
        VALUES ($1, $2, false, false, false, true, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userId, bookId]
      );
      return "Adicionado à lista de desejos.";
    }

    const currentBook = existingBook.rows[0];
    const newWantToReadStatus = !currentBook.want_to_read;

    await db.query(
      `UPDATE user_books SET want_to_read = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $2 AND book_id = $3`,
      [newWantToReadStatus, userId, bookId]
    );

    return newWantToReadStatus ? "Adicionado à lista de desejos." : "Removido da lista de desejos.";
  }

}

module.exports = { BookRepository };