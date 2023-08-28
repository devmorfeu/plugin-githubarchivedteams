function getPagination(list) {
 /* 
    TO DO
    passar lista para pagination montar o component
    essa função deve retornar um elemento html 
 */
}

function getList(repositories) {
    let list = [];
    let count = 0;

    if (repositories.lenght > 30) {
        let aux = 0;
        repositories.forEach(repo => {
            aux == 30 ? aux = 0 && count++ : aux++;
            list[count].push(repo);
        });
    } else {
        list.push(repositories)
    }
    return list;
}

function buildPaginationLayout() {
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('paginate-container');
    paginationContainer.innerHTML = `
        <div role="navigation" aria-label="Pagination" class="d-flex d-md-inline-block pagination">
            <span class="previous_page disabled" aria-disabled="true">Previous</span>
            <a class="previous_page" rel="next" href="/orgs/teste-orga/teams/teste/repositories?page=2">Next</a> 
            <a class="next_page" rel="next" href="/orgs/teste-orga/teams/teste/repositories?page=2">Next</a>
            <span class="next_page disabled" aria-disabled="true">Next</span>
        </div>
    `
}