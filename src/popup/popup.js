const test = maskPopup();

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

async function maskPopup() {

  const token = await getToken().then(token => {
    return token.GITHUB_AUTHORIZATION;
  });

  if (token != null) {
    document.querySelector(".content").style.display = "none"
    document.querySelector(".successView").style.display = "block"
    // Seletor para os ícones de toggle
    const toggleIcons = document.querySelectorAll(".toggle-icon");

    // O estado atual do toggle (inicialmente desligado)
    let isToggleOn = false;

    // Função para alternar o estado do toggle e atualizar os ícones
    function toggleState() {
      isToggleOn = !isToggleOn;
      toggleIcons.forEach(icon => icon.style.display = isToggleOn ? "none" : "inline");
    }

    // Adicionar evento de clique ao container do toggle
    const toggleContainer = document.querySelector(".toggle-container");
    toggleContainer.addEventListener("click", toggleState);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const token = document.getElementById("githubtoken");
  document.getElementById("buttonToken").addEventListener("click", () => validateTokenGithub(token.value));
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