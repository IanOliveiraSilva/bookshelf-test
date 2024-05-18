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
        lang,
        collection_name
    }) {
        let collection_id = null;

        if (collection_name) {
            let collection = await bookRepository.getCollectionByName({ collection_name })

            if (!collection) {
                collection = await bookRepository.addCollection({ collection_name })
            }

            collection_id = collection.id;
            await bookRepository.incrementVolumeCountCollection({ collection_id });
        }

        const book = await bookRepository.addBook({
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

    async getCollectionByName({ collection_name }) {
        const collections = await bookRepository.getCollectionsByName({ collection_name });

        return collections
    }

    async getCollectionByCollectionId({ collection_id }) {
        const collection = await bookRepository.getCollectionByCollectionId({ collection_id });

        return collection
    }

    async getBooksByCollectionName({ collection_name }) {
        const books = await bookRepository.getBooksByCollectionName({ collection_name });

        const collection = await bookRepository.getCollectionByName({ collection_name });

        return {
            livros: books.rows,
            coleção: collection
        }
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
            message: "Livro atualizado com sucesso",
            book: newBook
        }
    }

    async deleteBook({ id }) {
        const book = await bookRepository.deleteBook({ id });
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
        try {
            const googleBooksResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes`, { params: { q: title } });

            if (googleBooksResponse.status === 200) {
                const books = googleBooksResponse.data.items
                    .filter(item => item.volumeInfo.imageLinks?.thumbnail)
                    .map(item => {
                        const volumeInfo = item.volumeInfo;
                        return {
                            title: volumeInfo.title,
                            publisher: volumeInfo.publisher,
                            publishedYear: volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : "N/A",
                            id: item.id,
                            image: volumeInfo.imageLinks?.thumbnail,
                            author: Array.isArray(volumeInfo.authors) ? volumeInfo.authors[0] : volumeInfo.authors,
                            pageCount: volumeInfo.pageCount,
                            description: volumeInfo.description,
                            genre: Array.isArray(volumeInfo.categories) ? volumeInfo.categories[0] : volumeInfo.categories,
                            lang: volumeInfo.language,
                        };
                    });

                return {
                    body: {
                        books
                    }
                };
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            return {
                body: {
                    books: []
                }
            };
        }
    }

}

module.exports = { Booksservices };