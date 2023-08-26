const currentUrl = window.location.href;
const regexOrg = /\/orgs\/(.*?)\/teams\//;
const regexTeam = /\/teams\/(.*?)\//;

const matchOrg = currentUrl.match(regexOrg);
const matchTeam = currentUrl.match(regexTeam);

const nameOrg = matchOrg[1]
const nameTeam = matchTeam[1]

window.onload = function () {
  getRepoList();
};

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

  const res = await fetch(url, options)
    .then(res => res.json());

  mapRepoList(res)

}

function mapRepoList(response) {
  console.log(response);

  const idSet = new Set();

  response.forEach(repo => {
    idSet.add(repo.id);
  });

  const finalJson = {
    amount_repos: idSet.size,
    repos: response.map(repo => {
      return {
        private: repo.private,
        full_name: repo.full_name,
        html_url: repo.html_url,
        update_at: repo.updated_at,
        archived: repo.archived
      };
    })
  };

  console.log(JSON.stringify(finalJson, null, 2));
}