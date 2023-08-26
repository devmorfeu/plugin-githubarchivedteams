# plugin-githubarchivedteams

chrome.storage.sync.get(["GITHUB_AUTHORIZATION"], function (storage) {
      console.log("token: ", storage);
  });