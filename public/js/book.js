
document.addEventListener('DOMContentLoaded', async () => {
  let bookData = {
    name: document.getElementById("book-title").textContent.trim(),
    description: document.getElementById("book-description").textContent.trim(),
    author: document.getElementById("book-author").textContent.trim(),
    year: document.getElementById("book-date").textContent.trim(),
    image: document.getElementById("book-image").src.trim(),
    publisher: document.getElementById("book-publisher").textContent.trim(),
    genre: document.getElementById("book-genre").textContent.trim(),
    pagecount: parseInt(document.getElementById("book-pagecount").textContent.trim()),
    lang: document.getElementById("book-lang").textContent.trim(),
  };

  document.getElementById("add-favorite-button").addEventListener('click', async () => {
    let isCollection = confirm("Este livro faz parte de uma coleção?");
    let collection_name = null;

    if (isCollection) {
      collection_name = prompt("Por favor, insira o nome da coleção:");
    }

    const response = await fetch('/api/book/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: bookData.name,
        description: bookData.description,
        author: bookData.author,
        year: parseInt(bookData.year),
        image: bookData.image,
        publisher: bookData.publisher,
        genre: bookData.genre,
        pagecount: bookData.pagecount,
        lang: bookData.lang,
        collection_name: collection_name
      })
    });

    const responseData = await response.json();
    
    if (response.ok) {
      alert('Livro adicionado com sucesso!');
      window.location.href = `/bookshelf`;
    }

    if (responseData.message === 'Este livro já está no banco de dados.') {
      alert('Este livro já está na sua estante.');
    }
  });

});
