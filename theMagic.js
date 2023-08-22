const VISIBILITY = {
    HIDE: 'hide',
    UNHIDE: 'unhide'
}

const STATUS = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    ARCHIVED: 'Private archive'
}

const repository = {
    id: '',
    status: STATUS,
}
const test = document.querySelector(`input[type=checkbox].hide`);

var repositoryList = [];
var hideList = [];
var isVisible = false;

window.onload = function () {
    handleVisible();
    getRepositoryList();
};

function hadleClick(action) {
    action == VISIBILITY.HIDE ? hide() : unhide();

    if (action == 'hide') {
        hide()
    }

    handleVisible();
}

function hide() {
    hideList.forEach(repo => {
        let item = document.querySelectorAll(`[data-bulk-actions-id=${repo.id}]`);
        console.log(item);
        if (item.classList.contains(VISIBILITY.UNHIDE)) {
            item.classList.remove(VISIBILITY.UNHIDE);
        }
        repository.classList.add(VISIBILITY.HIDE);
    });
}

function unhide() {
    hideList.forEach(repo => {
        let item = document.querySelectorAll(`[data-bulk-actions-id=${repo.id}]`);
        if (item.classList.contains(VISIBILITY.HIDE)) {
            item.classList.remove(VISIBILITY.HIDE);
        }
        item.classList.add(VISIBILITY.UNHIDE);
    })
}

function getRepositoryList() {
    const repoList = document.querySelectorAll('[data-bulk-actions-id]');
    repoList.forEach(repo => {
        try {
            let tempRepo = repository;
            if (repo.childNodes[1].childNodes[1].childNodes[3].childNodes[4].innerHTML) {
                tempRepo.status = repo.childNodes[1].childNodes[1].childNodes[3].childNodes[4].innerHTML
            }
            if (repo.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].innerHTML) {
                tempRepo.id = repo.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].innerHTML;
            }

            repositoryList.push(tempRepo);
            tempRepo.status === STATUS.ARCHIVED ? hideList.push(tempRepo) : '';
            console.log('hide list: ', hideList);
            console.log('repository list: ', repositoryList);
        } catch (error) {
            console.error(error);
        }
    })
}

function handleVisible() {
    const hide = document.getElementById('hide');
    const unhide = document.getElementById('unhide');
    isVisible = !isVisible;

    if (isVisible) {
        hide.checked = false;
        unhide.checked = true;
    } else {
        unhide.checked = false;
        hide.checked = true;
    }
}