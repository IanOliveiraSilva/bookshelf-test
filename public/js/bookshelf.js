$(function () {
    $(".book-list").sortable();
    $(".book-list").disableSelection();
});

document.addEventListener('DOMContentLoaded', async () => {
    let params = new URLSearchParams(window.location.search);
    let page = parseInt(params.get('page')) || 1;


    const sort = document.getElementById("sortOptions");

    const savedSort = localStorage.getItem('sort');
    if (savedSort) {
        sort.value = savedSort;
    }

    sort.addEventListener('change', async () => {
        const selectedSort = sort.value;
        const currentPage = page;

        localStorage.setItem('sort', selectedSort);

        history.replaceState({}, '', `/bookshelf?page=${currentPage}&sort=${selectedSort}`);
        location.reload();
    });

    const paginationLinks = document.querySelectorAll('.page-link');

    paginationLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const selectedPage = event.target.textContent;
            const currentSort = sort.value;

            history.replaceState({}, '', `/bookshelf?page=${selectedPage}&sort=${currentSort}`);
            location.reload();
        });
    });
});

