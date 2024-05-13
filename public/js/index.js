const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('book-title');
let searchResults = document.getElementById('search-results');

const API_URL = 'http://localhost:3333/api/book/title/';
let data = '';

async function fetchBooks(title) {
    const response = await fetch(`${API_URL}${encodeURIComponent(title)}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar livros: ${response.statusText}`);
    }
    data = await response.json();
    return data.body.books;
}

function createBookElement(book) {
    const li = document.createElement('li');
    li.setAttribute('data-book-id', book.id);
    li.classList.add('list-group-item');

    const bookHTML = createBookHTML(book);
    li.innerHTML = bookHTML;

    li.querySelector('.add-icon').addEventListener('click', (event) => {
        event.stopPropagation();
        const bookData = createBookData(book);
    });

    li.addEventListener('click', () => {
        window.location.href = `/book/${book.id}`;
    });

    return li;
}

function createBookHTML(book) {
    const imageHTML = book.image ? `<img src="${book.image}" alt="${book.title}" class="poster img-fluid">` : '';
    return `
        <div class="d-flex align-items-start">
            ${imageHTML}
            <div class="ms-3">
                <h5>${book.title}</h5>
                <p>${book.author}</p>
                <p style="margin-left: 25px;">${book.publishedYear} . ${book.pageCount} páginas</p>
                <div class="add-icon">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        </div>
    `;
}

async function createBookData(book) {
    const collectionName = getCollectionName();

    const bookData = createBookDataObject(book, collectionName);

    const response = await postBookData(bookData);

    handleResponse(response);
}

function getCollectionName() {
    const isCollection = confirm("Este livro faz parte de uma coleção?");
    return isCollection ? prompt("Por favor, insira o nome da coleção:").toLowerCase() : null;
}

function createBookDataObject(book, collectionName) {
    return {
        name: book.title,
        description: book.description,
        author: book.author,
        year: parseInt(book.publishedYear),
        image: book.image,
        publisher: book.publisher,
        genre: book.genre,
        pagecount: book.pageCount,
        lang: book.lang,
        collection_name: collectionName,
        googleBookId: book.id
    };
}

async function postBookData(bookData) {
    return await fetch('/api/book/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });
}

async function handleResponse(response) {
    if (response.ok) {
        alert('Livro adicionado com sucesso!');
        window.location.href = `/bookshelf`;
    } else {
        const responseData = await response.json();
        if (responseData.message === 'Esse livro já está no banco de dados') {
            alert('Este livro já está na sua estante.');
        }
    }
}

function renderBooks(books) {
    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    books.forEach(book => {
        const li = createBookElement(book);
        ul.appendChild(li);
    });
    searchResults.innerHTML = '';
    searchResults.appendChild(ul);
}

searchInput.addEventListener('input', async function (event) {
    const title = searchInput.value.trim();
    if (title.length > 0) {
        try {
            const books = await fetchBooks(title);
            if (books.length > 0) {
                renderBooks(books);
            } else {
                searchResults.innerHTML = 'Nenhum livro encontrado';
            }
        } catch (error) {
            console.error('Erro:', error);
            searchResults.innerHTML = 'Erro ao buscar livros';
        }
    } else {
        searchResults.innerHTML = '';
    }
});

// Inicialização
let token = localStorage.getItem('token');
document.cookie = `token=${token}; path=/`;

