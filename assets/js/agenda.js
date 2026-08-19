const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCAERNDbdDJmWUz6Cew8TfZ0OYEVpNxU8vKSIfVbl7odMbbikMKDrk1XXHdSw5wLu3LA/exec";

// Elementos do DOM
const selectServico = document.getElementById("servico");
const inputData = document.getElementById("data");
const ulHorarios = document.getElementById("horarios");
const divChecagem = document.getElementById("checagem");
const btnAgendamento = document.getElementById("agendamento");

// Variáveis para armazenar as seleções do usuário
let horarioSelecionado = null;

// Ouvintes de eventos para buscar disponibilidade quando alterar Data ou Serviço
selectServico.addEventListener("change", verificarECarregarHorarios);
inputData.addEventListener("change", verificarECarregarHorarios);

function verificarECarregarHorarios() {
  const servico = selectServico.value;
  const data = inputData.value;

  // Só busca na API se ambos os campos estiverem preenchidos
  if (servico && data) {
    ulHorarios.innerHTML = "<li>Carregando horários disponíveis...</li>";
    ocultarCamposCliente();

    // Faz a chamada GET para o Apps Script
    fetch(`${SCRIPT_URL}?data=${data}&servico=${servico}`)
      .then(res => res.json())
      .then(resposta => {
        if (resposta.sucesso) {
          renderizarHorarios(resposta.horarios);
        } else {
          ulHorarios.innerHTML = `<li>Erro: ${resposta.erro}</li>`;
        }
      })
      .catch(err => {
        console.error("Erro na requisição:", err);
        ulHorarios.innerHTML = "<li>Erro ao buscar horários. Tente novamente.</li>";
      });
  }
}

// Exibe os botões de horário na tela
function renderizarHorarios(horarios) {
  ulHorarios.innerHTML = "";
  horarioSelecionado = null;

  if (horarios.length === 0) {
    ulHorarios.innerHTML = "<li>Nenhum horário disponível para esta data.</li>";
    return;
  }

  horarios.forEach(hora => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = hora;

    button.addEventListener("click", () => {
      // Remove seleção visual dos outros botões
      document.querySelectorAll(".horarios button").forEach(btn => btn.classList.remove("selecionado"));
      
      // Marca o botão clicado
      button.classList.add("selecionado");
      horarioSelecionado = hora;

      // Exibe os campos para o cliente preencher o Nome e Telefone
      exibirCamposCliente();
    });

    li.appendChild(button);
    ulHorarios.appendChild(li);
  });
}

// Cria e exibe dinamicamente os campos de Nome e Telefone
function exibirCamposCliente() {
  divChecagem.innerHTML = `
    <div class="campo" style="margin-top: 15px;">
      <label for="nome">Seu Nome Completo:</label>
      <input type="text" id="nome" placeholder="Digite seu nome" required style="width: 100%; padding: 8px; margin-top: 5px;">
    </div>
    <div class="campo" style="margin-top: 15px;">
      <label for="telefone">Seu WhatsApp / Telefone:</label>
      <input type="tel" id="telefone" placeholder="(00) 00000-0000" required style="width: 100%; padding: 8px; margin-top: 5px;">
    </div>
  `;
  const inputTel = document.getElementById("telefone");
  
  inputTel.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    
    if (v.length > 6) {
      e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      e.target.value = `(${v}`;
    }
  });

  // 3. TERCEIRO: Ativa o botão
  btnAgendamento.disabled = false;
  btnAgendamento.onclick = realizarAgendamento;
}


function ocultarCamposCliente() {
  divChecagem.innerHTML = "";
  btnAgendamento.disabled = true;
  btnAgendamento.onclick = null;
}
function validarCamposCliente(nome, telefone) {
  // Limpa espaços extras das pontas
  const nomeLimpo = nome.trim();
  const telefoneLimpo = telefone.replace(/\D/g, ""); // Remove tudo que não for número

  // 1. Validação do Nome: Precisa ter pelo menos 2 palavras e no mínimo 3 caracteres
  const partesNome = nomeLimpo.split(" ").filter(p => p.length > 0);
  if (partesNome.length < 2 || nomeLimpo.length < 3) {
    alert("Por favor, digite seu nome e sobrenome.");
    return false;
  }

  // 2. Validação do Telefone: DDD (2 dígitos) + Número (8 ou 9 dígitos) -> Total de 10 ou 11 dígitos
  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    alert("Por favor, digite um telefone/WhatsApp válido com DDD. Ex: (11) 99999-9999");
    return false;
  }

  return true; // Se passou em tudo
}
// Envia o agendamento (POST) para o Apps Script
function realizarAgendamento() {
  const nomeInput = document.getElementById("nome");
  const telefoneInput = document.getElementById("telefone");

  if (!validarCamposCliente(nomeInput.value, telefoneInput.value)) {
    return;
  }

  const dadosAgendamento = {
    servico: selectServico.value,
    data: inputData.value,
    hora: horarioSelecionado,
    nome: nomeInput.value.trim(),
    telefone: telefoneInput.value.trim()
  };

  btnAgendamento.disabled = true;
  btnAgendamento.textContent = "Agendando...";

  // Dicionário para exibir o nome amigável do serviço
  const nomesServico = {
    "manicure": "Manicure",
    "pedicure": "Pedicure",
    "mao-pe": "Mão e Pé (Completo)"
  };

  // Formata a data (AAAA-MM-DD) para (DD/MM/AAAA)
  const partesData = inputData.value.split("-");
  const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

  const servicoNome = nomesServico[selectServico.value] || selectServico.value;

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dadosAgendamento)
  })
  .then(() => {
      alert(`✨ Agendamento confirmado com sucesso!\n\n💅 Serviço: ${servicoNome}\n📅 Data: ${dataFormatada}\n⏰ Horário: ${horarioSelecionado}\n Se precisar cancelar ou alterar horário por favor entre em contato.`);
    location.reload();
  })
  .catch(err => {
    console.error("Erro ao agendar:", err);
    alert("Houve um erro ao realizar o agendamento. Tente novamente.");
    btnAgendamento.disabled = false;
    btnAgendamento.textContent = "Confirmar Agendamento";
  });
}