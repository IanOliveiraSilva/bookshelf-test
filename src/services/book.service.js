const { BooksRepository } = require("../repositories/book.repository");
const bookRepository = new BooksRepository();

class Booksservices {
    async addBook({
        name,
        description,
        author,
        year,
        publisher,
        image
    }) {
        const book = await bookRepository.addBook({
            name,
            description,
            author,
            year,
            publisher,
            image
        });
        return {
            message: "Livro adicionado com sucesso", 
            book: book
        };

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
        id
    }) {

        const book = await bookRepository.getAddedBookById({ id });

        const updatedBook = {
            name: name !== undefined ? name : book.rows[0].name,
            description: description !== undefined ? description : book.rows[0].description,
            author: author !== undefined ? author : book.rows[0].author,
            year: year !== undefined ? year : book.rows[0].year,
            publisher: publisher !== undefined ? publisher : book.rows[0].publisher,
        };

        
        const newBook = await bookRepository.updateBook(updatedBook, id);

        return newBook
    }

    async deleteBook({ id }){
        const book = await bookRepository.deleteBook({ id });
        

        return {
            message: "Livro deletado com sucesso"
        }
    }
}

module.exports = { Booksservices };