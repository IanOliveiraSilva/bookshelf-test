document.getElementById('delete-book-button').addEventListener('click', async () => {
    const bookId = document.getElementById("delete-book-button").dataset.bookId;
    try {
        const response = await fetch(`http://localhost:3333/api/book/${encodeURIComponent(bookId)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            alert('Livro deletado com sucesso!');
            window.location.href = '/bookshelf';
        }
    } catch (error) {
        console.error('Erro ao deletar o livro: ', error);
    }
});