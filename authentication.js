const form = document.querySelector('form')
const input = document.querySelector('.input')

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: askGithubToken,
    args: [input.value]
  })
    .then((results) => console.log(results));

})

function askGithubToken(githubToken) {

  if (githubToken === null) return

  if (validateTokenGithub(githubToken) == true) {
    saveGithubTokenPersonal(githubToken)
  }

  return true;
}

async function validateTokenGithub(token) {

  const response = await fetch("https://api.github.com/octocat", {
    method: "GET",
    headers: {
      "Authorization": "token " + token,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (response.status == 200) {
    console.log("token is valid!!")
    return true;
  } else {
    console.log("token is not valid!!")
    return false;
  }
}

async function saveGithubTokenPersonal(token) {

  await chrome.storage.sync.set({ GITHUB_AUTHORIZATION: token }, function () {
    console.log("token saved in storage");
  });
}