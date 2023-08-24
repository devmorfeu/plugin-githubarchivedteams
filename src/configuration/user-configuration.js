const githubToken = "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"

const askGithubToken = (githubToken) => {

  if (githubToken === null) return

  if (githubToken) {
    saveGithubTokenPersonal(githubToken)
  } else {
    console.log('You have entered an empty token.')
  }
}

async function saveGithubTokenPersonal(token) {

  const GITHUB_AUTHORIZATION = "GITHUB_AUTHORIZATION";

  await chrome.storage.sync.set({ GITHUB_AUTHORIZATION: token }, function () {
    console.log("Token salvo");
  }
  );

  chrome.storage.sync.get([GITHUB_AUTHORIZATION], function (storage) {
    console.log("token: ", storage);
  });
}

chrome.action.onClicked.addListener(() => { askGithubToken(githubToken) })
