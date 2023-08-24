const githubToken = "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"

const askGithubToken = (githubToken) => {
  
  if (githubToken === null) return

  if (githubToken) {
    saveGithubTokenPersonal(githubToken)
  } else {
    console.log('You have entered an empty token.')
  }
}

async function saveGithubTokenPersonal (token) {

  const GITHUB_TOKEN_KEY = "x-github-token";

  await chrome.storage.sync.set({ GITHUB_TOKEN_KEY : token },function () {
          console.log("Token salvo");
      }
  );
  
  chrome.storage.sync.get([GITHUB_TOKEN_KEY], function (storage) {
      console.log("token: ", storage);
  });
}

chrome.action.onClicked.addListener(() => {askGithubToken(githubToken)})
