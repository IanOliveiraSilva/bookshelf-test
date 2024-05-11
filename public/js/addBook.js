document.addEventListener('DOMContentLoaded', async () => {
    const submitButton = document.getElementById('submit-button') 

    document.getElementById('add-book-form').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        if (!document.getElementById('image').files.length) {
            alert('Por favor, selecione um arquivo antes de enviar.');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('author', document.getElementById('author').value);
        formData.append('year', document.getElementById('year').value);
        formData.append('publisher', document.getElementById('publisher').value);
        formData.append('genre', document.getElementById('genre').value);
        formData.append('pagecount', document.getElementById('pagecount').value);
        formData.append('lang', document.getElementById('lang').value);
        formData.append('image', document.getElementById('image').files[0]);
        formData.append('collection_name', document.getElementById('collection_name').value)
    
        submitButton.disabled = true;

        const response = await fetch('/api/book/', {
            method: 'POST',
            body: formData
        });
    
        if (response.ok) {
            alert('Livro adicionado com sucesso!');
            window.location.href = `/bookshelf`;
        } else {
            alert('Falha ao adicionar livro');
        }
    });
    
    document.getElementById('image').addEventListener('change', function() {
        document.getElementById('file-name').textContent = this.files[0].name;
    });
})




    function showCollectionNameField() {
        document.getElementById('collection_name_field').style.display = 'block';
      }
      
      function hideCollectionNameField() {
        document.getElementById('collection_name_field').style.display = 'none';
      }