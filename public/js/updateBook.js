document.addEventListener('DOMContentLoaded', async () => {
    const parts = window.location.pathname.split('/');
    const id = parts.pop();

    const NameElement = document.getElementById('name');
    const descriptionElement = document.getElementById('description');
    const authorElement = document.getElementById('author');
    const publisherElement = document.getElementById('publisher');
    const yearElement = document.getElementById('year');

    const getBookResponse = await fetch(`/api/addedBook/${encodeURIComponent(id)}`, {
        method: 'GET'
    });

    const bookData = await getBookResponse.json();

    NameElement.value = bookData[0].name;
    descriptionElement.value = bookData[0].description;
    authorElement.value = bookData[0].author;
    publisherElement.value = bookData[0].publisher;
    yearElement.value = bookData[0].year;

    const updateProfileForm = document.getElementById('add-book-form');
    updateProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const response = await fetch(`/api/book/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: NameElement.value,
                description: descriptionElement.value,
                author: authorElement.value,
                publisher: publisherElement.value,
                year: yearElement.value
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            alert('Livro editado com sucesso!');
            window.location.href = `/addedBook/${encodeURIComponent(id)}`;
        }
    })
})
