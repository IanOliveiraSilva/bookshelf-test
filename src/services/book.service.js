const { BooksRepository } = require("../repositories/book.repository");
const bookRepository = new BooksRepository();

const axios = require('axios');


class Booksservices {
    async addBook({
        name,
        description,
        author,
        year,
        publisher,
        image,
        genre,
        pagecount,
        lang
    }) {
        const book = await bookRepository.addBook({
            name,
            description,
            author,
            year,
            publisher,
            image,
            genre,
            pagecount,
            lang
        });
        return book

    }

    async getBooks({ sort, page, pageSize }) {
        const books = await bookRepository.getBooks({ sort, page, pageSize });
        const bookCount = await bookRepository.getBooksCount({});

        return {
            Livros: books,
            Quantidade: bookCount
        }
    }

    async getAddedBookById({ id }) {
        const books = await bookRepository.getAddedBookById({ id });

        return books.rows
    }

    async updateBook({
        name,
        description,
        author,
        year,
        publisher,
        genre,
        pagecount,
        lang,
        id
    }) {

        const book = await bookRepository.getAddedBookById({ id });

        const updatedBook = {
            name: name !== undefined ? name : book.rows[0].name,
            description: description !== undefined ? description : book.rows[0].description,
            author: author !== undefined ? author : book.rows[0].author,
            year: year !== undefined ? year : book.rows[0].year,
            publisher: publisher !== undefined ? publisher : book.rows[0].publisher,
            genre: genre !== undefined ? genre : book.rows[0].genre,
            pagecount: pagecount !== undefined ? pagecount : book.rows[0].pagecount,
            lang: lang !== undefined ? lang : book.rows[0].lang,
        };

        console.log(updatedBook)
        const newBook = await bookRepository.updateBook(updatedBook, id);

        return {
            message: "Livro atulizado com sucesso",
            book: newBook
        }
    }

    async deleteBook({ id }) {
        const book = await bookRepository.deleteBook({ id });


        return {
            message: "Livro deletado com sucesso"
        }
    }

    // GOOGLE API CALLS

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
}

module.exports = { Booksservices };