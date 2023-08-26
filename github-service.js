const token = chrome.storage.sync.get(["GITHUB_AUTHORIZATION"], function (storage) {
  console.log("token: ", storage);
});

//async function getToken() {
//  return await chrome.storage.sync.get(["GITHUB_AUTHORIZATION"], function (storage) {
//    console.log("token: ", storage);
//    return storage;
//  });
//}

const currentUrl = window.location.href;
const regexOrg = /\/orgs\/(.*?)\/teams\//;
const regexTeam = /\/teams\/(.*?)\//;

const matchOrg = currentUrl.match(regexOrg);
const matchTeam = currentUrl.match(regexTeam);

const nameOrg = matchOrg[1]
const nameTeam = matchTeam[1]

console.log(matchOrg[1]);
console.log(matchTeam[1]);

const response = fetch(`https://api.github.com/orgs/${nameOrg}/teams/${nameTeam}/repos`, {
  method: "GET",
  headers: {
    "Authorization": "token " + token,
    "X-GitHub-Api-Version": "2022-11-28"
  }
}).then(res => console.log(res))