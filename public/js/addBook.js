document.getElementById('add-book-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('author', document.getElementById('author').value);
    formData.append('year', document.getElementById('year').value);
    formData.append('publisher', document.getElementById('publisher').value);
    formData.append('image', document.getElementById('image').files[0]);

    const response = await fetch('/api/book/', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Livro adicionado com sucesso!');
        window.location.href = `/bookshelf`;
    } else {
        alert('Failed to add book');
    }
});

document.getElementById('image').addEventListener('change', function() {
    document.getElementById('file-name').textContent = this.files[0].name;
});

