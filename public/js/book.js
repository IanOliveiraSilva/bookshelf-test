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

  document.getElementById("collection-name").addEventListener('input', async () => {
    let collection_name = document.getElementById("collection-name").value;

    const response = await fetch(`/api/collection/name/${collection_name}`);
    const collections = await response.json();

    let select = document.getElementById('collection-list');
    if (!select) {
      select = document.createElement('select');
      select.id = 'collection-list';
      document.getElementById('collectionForm').appendChild(select);
    }

    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    select.size = collections.length > 5 ? 5 : collections.length;

    collections.forEach(collection => {
      let option = document.createElement('option');
      option.value = collection.name;
      option.text = collection.name;
      select.appendChild(option);
    });

    document.getElementById('collection-list').addEventListener('change', function () {
      document.getElementById('collection-name').value = this.options[this.selectedIndex].text;
    });
  });

  document.getElementById("add-favorite-button").addEventListener('click', async () => {
    let modal = new bootstrap.Modal(document.getElementById('collectionModal'));
    modal.show();

    document.getElementById("saveButton").addEventListener('click', async () => {
      let collection_name_input = document.getElementById("collection-name").value;
      let collection_list = document.getElementById("collection-list");
      let collection_id = collection_list.options[collection_list.selectedIndex] ? collection_list.value : collection_name_input;
    
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
          collection_name: collection_id
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        let successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    
        document.getElementById("closeSuccessButton").addEventListener('click', function() {
          window.location.href = `/`;
        });
      }
    
      if (responseData.message === 'Esse livro já está no banco de dados') {
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
      }
    });
  });
});