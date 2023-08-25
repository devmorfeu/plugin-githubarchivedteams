const githubToken = "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"

async function askGithubToken(githubToken) {

  if (githubToken === null) return

  if (await validateTokenGithub(githubToken) == true) {
    saveGithubTokenPersonal(githubToken)
  }
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

chrome.action.onClicked.addListener(() => { askGithubToken(githubToken) })
