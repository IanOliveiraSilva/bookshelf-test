const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('book-title');
let searchResults = document.getElementById('search-results');

const API_URL = 'https://localhost:3333/api/books/';

async function fetchBooks(title) {
    const response = await fetch(`${API_URL}${encodeURIComponent(title)}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar livros: ${response.statusText}`);
    }
    const data = await response.json();
    return data.body.books;
}

function createBookElement(book) {
    const li = document.createElement('li');
    li.setAttribute('data-book-id', book.id);
    if (book.image) {
        li.innerHTML = `
            <li class="book-item p-2">
                <img src="${book.image}" alt="${book.title}" class="book-image poster img-fluid">
            </li>
        `;
    }
    li.addEventListener('click', () => {
        window.location.href = `/book/${book.id}`;
    });
    return li;
}

function renderBooks(books) {
    const ul = document.createElement('ul');
    ul.classList.add('list-unstyled', 'd-flex', 'flex-wrap');
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
console.log(token)
document.cookie = `token=${token}; path=/`;
