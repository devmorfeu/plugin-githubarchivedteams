const currentUrl = window.location.href;
const regexOrg = /\/orgs\/(.*?)\/teams\//;
const regexTeam = /\/teams\/(.*?)\//;

const matchOrg = currentUrl.match(regexOrg);
const matchTeam = currentUrl.match(regexTeam);

const nameOrg = matchOrg[1]
const nameTeam = matchTeam[1]

window.onload = function() {
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
  let token = await getToken().then(token => {
    return token.GITHUB_AUTHORIZATION;
  });

  let response = await fetch(`https://api.github.com/orgs/${nameOrg}/teams/${nameTeam}/repos`, {
    method: "GET",
    headers: {
      "Authorization": `token ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  }).then(res => console.log(res))

  console.log(response)
}