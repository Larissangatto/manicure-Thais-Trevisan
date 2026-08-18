const inputData = document.querySelector("#data");
const botoesHorario = document.querySelectorAll(".horarios button");
const botaoAgendamento = document.querySelector("#agendamento");
const dataEscolhida = document.querySelector("#data-escolhida");

let horarioSelecionado = null;


// impede selecionar datas anteriores a hoje
const hoje = new Date();

const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");

inputData.min = `${ano}-${mes}-${dia}`;


// verifica se já podemos liberar o botão Agendar
function validarAgendamento() {

    if (inputData.value && horarioSelecionado) {

        botaoAgendamento.disabled = false;

    } else {

        botaoAgendamento.disabled = true;

    }

}



// QUANDO ESCOLHER UMA DATA

inputData.addEventListener("change", () => {

    const data = new Date(
        inputData.value + "T12:00:00"
    );

    dataEscolhida.textContent =
        data.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long"
            }
        );

    validarAgendamento();

});


// QUANDO ESCOLHER UM HORÁRIO

botoesHorario.forEach((botao) => {

    botao.addEventListener("click", () => {

        // remove seleção anterior
        botoesHorario.forEach((outroBotao) => {
            outroBotao.classList.remove("selecionado");
        });


        // seleciona o botão clicado
        botao.classList.add("selecionado");

        horarioSelecionado =
            botao.textContent;

        validarAgendamento();

    });

});



const tipoDeServico = document.getElementById("servico");
let tempoServico = ""

function selecaoDeServiço() {
    tipoDeServico.addEventListener("change", function () {

        const servicoSelecionado = tipoDeServico.value;

        if (servicoSelecionado === "") {
            console.log("Selecionar um serviço");
        }
        else if (servicoSelecionado === "manicure") {
            return tempoServico = setMinutes(60)
        }
        else if (servicoSelecionado === "pedicure") {
            return tempoServico = setMinutes(60)
        }
        else if (servicoSelecionado === "mao-pe") {
            return tempoServico = setMinutes(90)
        }
        else {
            console.log("deu ruim");
        }

    });
}
selecaoDeServiço()


