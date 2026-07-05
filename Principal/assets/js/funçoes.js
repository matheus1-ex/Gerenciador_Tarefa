let tarefas = [];

let nome1 = localStorage.getItem("nome");
document.getElementById("usuario").textContent = nome1 || "Usuário";

function siteOficial() {
    window.location.href = "../login/index.html"; // Ajustado para voltar localmente
}

// BUSCAR TAREFAS DO BACKEND (GET)
async function carregarTarefasDoBanco() {
    try {
        const response = await fetch("http://127.0.0.1:8000/tarefas/");
        if (response.ok) {
            tarefas = await response.json();
            listarTarefas(tarefas);
        } else {
            console.error("Falha ao buscar tarefas do servidor");
        }
    } catch (error) {
        console.error("Erro ao conectar no servidor para buscar tarefas:", error);
    }
}

// EXCLUIR TAREFA NO BACKEND (DELETE)
async function excluir(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/tarefas/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            // Remove da lista local e atualiza a tela
            tarefas = tarefas.filter(tarefa => tarefa.id !== id);
            listarTarefas();
        } else {
            alert("Erro ao deletar tarefa no servidor.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
    }
}

function pesquisar(){
    let termo = document.getElementById("pesquisar").value.toLowerCase();
    let resultado = tarefas.filter(tarefa =>
        tarefa.titulo.toLowerCase().includes(termo));
    listarTarefas(resultado);
}

function mostrarTodos(){
    document.getElementById("pesquisar").value = "";
    listarTarefas(tarefas);
}

function listarTarefas(lista = tarefas){
    let historicoTarefa = document.getElementById("HistoricoTarefas");
    if(!historicoTarefa) return;

    historicoTarefa.innerHTML = "";

    if(lista.length === 0){
        let vazio = document.createElement("div");
        vazio.classList.add("historico");
        vazio.innerHTML = "<h4>Nenhuma tarefa encontrada</h4><p>Adicione uma nova tarefa para começar seu planejamento.</p>";
        historicoTarefa.appendChild(vazio);
        return;
    }

    lista.forEach((tarefa) => {
        let cardHIstorico = document.createElement("div");
        cardHIstorico.classList.add("historico");

        let respostaTitulo = document.createElement("h4");
        respostaTitulo.textContent = tarefa.titulo;

        let descrição = document.createElement("p");
        descrição.textContent = tarefa.descricao;

        let Info = document.createElement("div");
        Info.classList.add("Info");

        let Info_Status = document.createElement("div");
        Info_Status.textContent = tarefa.status || "Pendente";
        Info_Status.style.color = "white";
        Info_Status.style.fontSize = "13px";
        Info_Status.style.display = "flex";
        Info_Status.style.alignItems = "center";
        Info_Status.style.justifyContent = "center";

        if(Info_Status.textContent === "Concluída"){
            Info_Status.style.width = "89px";
            Info_Status.style.borderRadius = "10px";
            Info_Status.style.backgroundColor = "#02c20f";
        } else {
            Info_Status.style.width = "89px";
            Info_Status.style.borderRadius = "10px";
            Info_Status.style.backgroundColor = "#c28500";
        }

        let Data = document.createElement("div");
        Data.textContent = tarefa.data_tarefa; // Campo esperado pelo seu schema do FastAPI
        Data.style.color = "white";
        Data.style.fontSize = "13px";
        Data.style.display = "flex";
        Data.style.alignItems = "center";
        Data.style.justifyContent = "center";
        Data.style.width = "89px";
        Data.style.borderRadius = "10px";
        Data.style.backgroundColor = "#136a84";

        let btns = document.createElement("div");
        btns.classList.add("botões");

        let bntExcluir = document.createElement("button");
        bntExcluir.classList.add("excluir");
        bntExcluir.textContent = "excluir";

        bntExcluir.addEventListener("click", () => {
            excluir(tarefa.id); // 'id' vindo do banco Postgres
        });

        let Prioridade = document.createElement("div");
        Prioridade.textContent = tarefa.prioridade;
        Prioridade.style.color = "white";
        Prioridade.style.fontSize = "13px";
        Prioridade.style.display = "flex";
        Prioridade.style.alignItems = "center";
        Prioridade.style.justifyContent = "center";
        Prioridade.style.width = "89px";
        Prioridade.style.borderRadius = "10px";

        if(Prioridade.textContent === "Alta"){
            Prioridade.style.backgroundColor = "#097a1c";
        } else if(Prioridade.textContent === "Média"){
            Prioridade.style.backgroundColor = "#cb6003";
        } else if(Prioridade.textContent === "Baixa"){
            Prioridade.style.backgroundColor = "#dc1313";
        }

        cardHIstorico.appendChild(respostaTitulo);
        cardHIstorico.appendChild(descrição);
        Info.appendChild(Info_Status);
        Info.appendChild(Prioridade);
        Info.appendChild(Data);
        cardHIstorico.appendChild(Info);
        btns.appendChild(bntExcluir);
        cardHIstorico.appendChild(btns);
        historicoTarefa.appendChild(cardHIstorico);
    });
}

// CRIAR NOVA TAREFA NO BACKEND (POST)
const form = document.getElementById("FormTarefa");
form.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const dia = document.getElementById("dia").value;
    const prioridade = document.getElementById("prioridade").value;

    const payload = {
        titulo: titulo,
        descricao: descricao,
        data_tarefa: dia, // Alinhado com TarefaCreate do main.py
        prioridade: prioridade
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/tarefas/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            form.reset();
            await carregarTarefasDoBanco(); // Recarrega a lista atualizada do PostgreSQL
        } else {
            alert("Erro ao salvar tarefa no servidor.");
        }
    } catch (error) {
        console.error("Erro crítico ao salvar tarefa:", error);
        alert("Não foi possível conectar ao servidor backend.");
    }
});

// Inicializa a página buscando os dados reais do banco
carregarTarefasDoBanco();