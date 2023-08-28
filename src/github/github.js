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
    if (!repo.archived) {
      idSet.add(repo.id);
    }
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
  const ul = document.createElement('ul');
  const head = document.createElement('span');
  const searchBar = document.createElement('div');
  const section = document.createElement('section');
  const itemscope = document.querySelector('div[itemscope]');
  const searchInput = searchBar.querySelector('.js-team-search-field');

  section.classList.add('container', 'mt-4');
  searchBar.classList.add('auto-search-group');
  ul.classList.add('mylist', "team-listing", "table-list", "table-list-bordered", "adminable");

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
      const [orga, team] = repo.full_name.split('/');
      //class="table-list-item js-team-row js-bulk-actions-item"
      li.innerHTML = `
      <div class="table-list-cell">
          <div class="d-flex flex-items-center">
              <div class="nested-teams-checkbox">
              </div>
              <div>
                  <a class="f4" data-hovercard-type="repository" data-hovercard-url="${repo.html_url}/hovercard"
                      href="${repo.html_url}">
                      <span>${orga}/<strong>${team}</strong></span>
                  </a> <span></span><span class="Label Label--secondary v-align-middle"
                      title="Only visible to its members.">${repo.private === true ? "Private" : "Public"}</span>
                  <div class="description mt-1">
                      Updated <relative-time datetime="${repo.update_at}" class="no-wrap"></relative-time>
                  </div>
              </div>
          </div>
      </div>
      
      <div class="table-list-cell f5 text-center">
      <span class="tooltipped tooltipped-s" aria-label="Past year of activity">
         <svg width="155" height="30">
            <defs>
               <linearGradient id="gradient-683547609" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stop-color="var(--color-calendar-graph-day-L1-bg)"></stop>
                  <stop offset="10%" stop-color="var(--color-calendar-graph-day-L2-bg)"></stop>
                  <stop offset="25%" stop-color="var(--color-calendar-graph-day-L3-bg)"></stop>
                  <stop offset="50%" stop-color="var(--color-calendar-graph-day-L4-bg)"></stop>
               </linearGradient>
               <mask id="sparkline-683547609" x="0" y="0" width="155" height="28">
                  <polyline transform="translate(0, 28) scale(1,-1)" points="0,1 3,1 6,1 9,1 12,1 15,1 18,1 21,1 24,1 27,1 30,1 33,1 36,1 39,1 42,1 45,1 48,1 51,1 54,1 57,1 60,1 63,1 66,1 69,1 72,1 75,1 78,1 81,1 84,1 87,1 90,1 93,1 96,1 99,1 102,1 105,1 108,1 111,1 114,1 117,1 120,1 123,1 126,1 129,1 132,1 135,1 138,1 141,1 144,1 147,1 150,1 153,2 " fill="transparent" stroke="#8cc665" stroke-width="2">
                  </polyline>
               </mask>
            </defs>
            <g transform="translate(0, -12)">
               <rect x="0" y="-2" width="155" height="30" style="stroke: none; fill: url(#gradient-683547609); mask: url(#sparkline-683547609)"></rect>
            </g>
         </svg>
      </span>
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
    }
    section.appendChild(ul);
    itemscope.appendChild(section);
  })

  // Funcao de pesquisa
  searchInput.addEventListener('input', function () {
    const searchText = this.value.trim().toLowerCase();

    finalJson.repos.forEach(repo => {
      const li = ul.querySelector(`a[href="${repo.html_url}"]`);

      if (!repo.archived && repo.full_name.toLowerCase().includes(searchText)) {
        li.style.display = 'block';
      } else {
        if (li === null) {
          return;
        }
        li.style.display = 'none';
      }
    });
  });

}

