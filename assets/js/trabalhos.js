
const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbxVOuIokOFsVjkLWnd1Tmo0fppcIohA7e85zQ6EIPnYe820g0X3o8lCM0WcRG75epdy/exec";
const FOLDER_ID = "1psFaCSfCwhte1yMCffolCD3eec8cE6-I";

// Faz a requisição enviando o ID da pasta na URL
fetch(`${URL_WEB_APP}?folderId=${FOLDER_ID}`)
  .then(response => response.json())
  .then(listaDeUrls => {
    const painel = document.getElementById("painel");

    let newHtml = "";

    listaDeUrls.forEach(url => {

        newHtml += `
            <div class="moldura">
                <img src="${url}">
            </div>
        `;

    });

    painel.innerHTML = newHtml;
  })
  .catch(erro => console.error("Erro ao carregar imagens:", erro));

