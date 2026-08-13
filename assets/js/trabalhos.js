
console.log("teste")
const URL_API = "https://script.google.com/macros/s/AKfycbzTBrqOEUdfxo3--Ec9BevHEAUYH0fdXsfGKFPkY-2nxKAn93dsdLO-HkRxT88eBCXt/exec"


function receberImagens(imagens) {

  
    const elementosImg =
        document.querySelectorAll(".foto-trabalho");

    elementosImg.forEach((img, index) => {

        if (imagens[index]) {

            img.src = imagens[index].imagem;
            img.alt = imagens[index].nome;

        }

    });
}



const script = document.createElement("script");

script.src =
    URL_API + "?callback=receberImagens";

document.body.appendChild(script);


