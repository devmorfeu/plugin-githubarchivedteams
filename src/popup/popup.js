document.addEventListener('DOMContentLoaded', function() {
  const token = document.getElementById("githubtoken");
  document.getElementById("buttonToken").addEventListener("click",() => validateTokenGithub(token.value));
});

async function validateTokenGithub(token) {

  const response = await fetch("https://api.github.com/octocat", {
    method: "GET",
    headers: {
      "Authorization": "token " + token,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (response.status == 200) {
    console.log("token is valid!!");
    saveGithubTokenPersonal(token);
    document.querySelector(".content").style.display = "none"
    document.querySelector(".successView").style.display = "block"
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