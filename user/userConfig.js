const hardDefaults = {
  HIDE_ENABLE: true, //deixar como default valor true no storage do chrome
  GITHUB_TOKEN_KEY: 'x-github-token',
  STORAGE: chrome.storage.local
};

const askGithubToken = (cb) => {
  console.log("passou")
  const githubToken = "aaaaaaaaaaaaaaaaaaaaaaaa"

  if (githubToken === null) return

  if (githubToken) {
    saveGithubTokenPersonal(githubToken, cb)
  } else {
    console.log('You have entered an empty token.')

    cb()
  }
}

function saveGithubTokenPersonal (value, cb) {

  const key = hardDefaults.GITHUB_TOKEN_KEY

  hardDefaults.STORAGE.set({ "key": key, "value": value }).then(() => {
    console.log("Value is set");
  });

  hardDefaults.STORAGE.get(key).then((result) => {
    console.log("Value currently is " + result[key]);
  });
}
chrome.action.onClicked.addListener((tab) => {askGithubToken(() => {})})
