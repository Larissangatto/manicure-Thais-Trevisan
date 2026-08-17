window.receberImagens = function (imagens) {

    const painel = document.getElementById("painel");

    let newHtml = "";

    imagens.forEach(imagem => {

        newHtml += `
            <div class="moldura">
                <img src="${imagem.imagem}" alt="${imagem.nome}">
            </div>
        `;

    });

    painel.innerHTML = newHtml;

};
const script = document.createElement("script");

script.src = URL_API + "?callback=receberImagens";

document.head.appendChild(script);
