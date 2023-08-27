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

    console.log(token)

}


