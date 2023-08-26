const currentUrl = window.location.href;
const regexOrg = /\/orgs\/(.*?)\/teams\//;
const regexTeam = /\/teams\/(.*?)\//;

const matchOrg = currentUrl.match(regexOrg);
const matchTeam = currentUrl.match(regexTeam);

const nameOrg = matchOrg[1]
const nameTeam = matchTeam[1]

const finalJson = {
  amount_repos: 0,
  repos: []
}

window.onload = function () {
  init()
};

async function init() {
  await getRepoList();
  buildHtml();
}

async function getToken() {
  return await new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(["GITHUB_AUTHORIZATION"], res => {
        resolve(res);
      });

    } catch (error) {
      reject(console.error('erro: ', error))
    }
  })
}


async function getRepoList() {

  const token = await getToken().then(token => {
    return token.GITHUB_AUTHORIZATION;
  });

  const url = `https://api.github.com/orgs/${nameOrg}/teams/${nameTeam}/repos`;
  const options = {
    method: "GET",
    headers: {
      "Authorization": `token ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  }

  const response = await fetch(url, options)
    .then(res => {
      return res.json()
    })

  mapRepoList(response);
  return
}

function mapRepoList(response) {
  const idSet = new Set();

  response.forEach(repo => {
    console.log(repo)
    idSet.add(repo.id);
    finalJson.repos.push({
      private: repo.private,
      full_name: repo.full_name,
      html_url: repo.html_url,
      update_at: repo.updated_at,
      archived: repo.archived
    })
  });

  finalJson.amount_repos = idSet.size;
}

function buildHtml() {
  const itemscope = document.querySelector('div[itemscope]');
  const ul = document.createElement('ul');
  const head = document.createElement('span');
  const section = document.createElement('section');
  const searchBar = document.createElement('div');

  section.classList.add('container', 'mt-4');
  ul.classList.add('mylist', "team-listing", "table-list", "table-list-bordered", "adminable");
  searchBar.classList.add('auto-search-group');

  searchBar.innerHTML = `
    <div class="auto-search-group">
        <input class="form-control subnav-search-input input-contrast auto-search-input js-team-search-field" value="" type="text" name="query" placeholder="Find a repository…" aria-label="Find a repository" autocomplete="off" data-throttled-autosubmit="">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-search">
          <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path>
        </svg>
        <svg style="box-sizing: content-box; color: var(--color-icon-primary);" width="16" height="16" viewBox="0 0 16 16" fill="none" data-view-component="true" class="spinner anim-rotate">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-opacity="0.25" stroke-width="2" vector-effect="non-scaling-stroke"></circle>
            <path d="M15 8a7.002 7.002 0 00-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>
          </svg>
    </div>`
  section.appendChild(searchBar);

  head.innerHTML = `
    <div class="table-list-header table-list-header-next bulk-actions-header">
      <div class="table-list-filters d-flex">
        <span class="table-list-heading table-list-header-meta flex-auto">
          ${finalJson.amount_repos} repositories in the teste team
        </span>
      </div>
    </div>`
  section.appendChild(head);

  finalJson.repos.forEach(repo => {
    if (repo.archived === false) {
      const li = document.createElement("li");
      li.classList.add("table-list-item", "js-team-row", "js-bulk-actions-item");
      //class="table-list-item js-team-row js-bulk-actions-item"
      li.innerHTML = `
      <div class="table-list-cell">
          <div class="d-flex flex-items-center">
              <div class="nested-teams-checkbox">
              </div>
              <div>
                  <a class="f4" data-hovercard-type="repository" data-hovercard-url="${repo.html_url}/hovercard"
                      href="${repo.html_url}">
                      <span>teste-orga/<strong>${repo.full_name}</strong></span>
                  </a> <span></span><span class="Label Label--secondary v-align-middle"
                      title="Only visible to its members.">${repo.private === true ? "Private" : "Public"}</span>
                  <div class="description mt-1">
                      Updated <relative-time datetime="${repo.update_at}" class="no-wrap"></relative-time>
                  </div>
              </div>
          </div>
      </div>
      <div class="table-list-cell f5 text-center">

      </div>

      <div class="table-list-cell team-buttons pr-3 f5 text-right">
          <div class="permission-level-cell">
              <button type="button" disabled="disabled" data-view-component="true"
                  class="select-menu-button css-truncate btn"> <span data-menu-button=""
                      class="css-truncate-target width-fit">
                      Read

                  </span>
              </button>
          </div>
      </div>
`
      ul.appendChild(li);
      section.appendChild(ul);
      itemscope.appendChild(section);

    }
  })

}

