const { BookRepository } = require("../repositories/books.repository");
const axios = require('axios');

const bookRepository = new BookRepository();

class Bookservice {
    async getBookById({ id }) {
        const googleBooksResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);

        if (googleBooksResponse.status === 200) {
            const book = googleBooksResponse.data.volumeInfo;
            const bookData = {
                title: book.title,
                authors: book.authors,
                publisher: book.publisher,
                publishedDate: book.publishedDate,
                description: book.description,
                pageCount: book.pageCount,
                categories: book.categories,
                image: book.imageLinks?.thumbnail,
                previewLink: book.previewLink,
                id: googleBooksResponse.data.id,
                infoLink: book.infoLink,
                language: book.language
            };
            return {
                body: {
                    bookData
                },
            };
        } else {
            throw new Error("Nenhum livro encontrado com o ID fornecido.");
        }
    }

    async getBooksByTitle({ title }) {

        const googleBooksResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes`, { params: { q: title } });

        if (googleBooksResponse.status === 200) {
            const books = googleBooksResponse.data.items.map(item => {
                const volumeInfo = item.volumeInfo;
                return {
                    title: volumeInfo.title,
                    publisher: volumeInfo.publisher,
                    publishedYear: volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : "N/A",
                    id: item.id,
                    image: volumeInfo.imageLinks?.thumbnail,
                };
            });

            return {
                body: {
                    books
                }
            };
        }
    }

    async getFavoriteBooks({ userId }) {

        const favoriteBooks = await bookRepository.getFavoriteBooks({ userId })

        return favoriteBooks;
    }

    async getReadStatus({ userId }) {

        const readStatusBook = await bookRepository.getReadStatus({ userId })

        return readStatusBook;
    }

    async getOwnStatus({ userId }) {

        const ownStatusBook = await bookRepository.getOwnStatus({ userId })

        return ownStatusBook;
    }

    async getWantToRead({ userId }) {

        const wantToReadBook = await bookRepository.getWantToRead({ userId })

        return wantToReadBook;
    }

    async getBooksStatusCount({ userId}){
        const booksStatus = await bookRepository.getBooksStatusCounts({ userId })
        
        return booksStatus
    }
    

    async ToggleFavoriteBooks({ userId, bookId }) {

        const favoriteBooks = await bookRepository.toggleFavoriteBook({ userId, bookId })

        return {
            favoriteBooks: favoriteBooks
        };
    }

    async toggleReadStatus({ userId, bookId }) {

        const favoriteBooks = await bookRepository.toggleReadStatus({ userId, bookId })

        return {
            favoriteBooks: favoriteBooks
        };
    }

    async toggleOwnStatus({ userId, bookId }) {

        const favoriteBooks = await bookRepository.toggleOwnStatus({ userId, bookId })

        return {
            favoriteBooks: favoriteBooks
        };
    }

    async toggleWantToRead({ userId, bookId }) {

        const favoriteBooks = await bookRepository.toggleWantToRead({ userId, bookId })

        return {
            favoriteBooks: favoriteBooks
        };
    }

}

module.exports = { Bookservice };