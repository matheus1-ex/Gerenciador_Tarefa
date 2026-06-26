let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let editarId = null;

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const formLogin = document.getElementById("FormLogin");
const loginMessage = document.getElementById("loginMessage");

function entrarNoApp(){
    loginPage.hidden = true;
    appPage.hidden = false;
    listarTarefas();
}

if(localStorage.getItem("loginAtivo") === "true"){
    entrarNoApp();
}

formLogin.addEventListener("submit", function(e){
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const lembrarLogin = document.getElementById("lembrarLogin").checked;

    if(!usuario || !senha){
        loginMessage.textContent = "Preencha usuário e senha para entrar.";
        loginMessage.style.color = "#dc2626";
        return;
    }

    if(lembrarLogin){
        localStorage.setItem("loginAtivo", "true");
    }

    loginMessage.textContent = "Login realizado com sucesso!";
    loginMessage.style.color = "#16a34a";

    setTimeout(entrarNoApp, 550);
});

function salvarLocal(){
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function excluir(Id_Tarefa){
    tarefas = tarefas.filter(tarefa => tarefa.Id_Tarefa !== Id_Tarefa);
    salvarLocal();
    listarTarefas();
}

function pesquisar(){
    let termo = document.getElementById("pesquisar").value.toLowerCase();
    let resultado = tarefas.filter(tarefa =>
        tarefa.titulo.toLowerCase().includes(termo));
    listarTarefas(resultado);
}

function editar(Id_Tarefa){
    let tarefa = tarefas.find(t => t.Id_Tarefa == Id_Tarefa);

    if(!tarefa) return;

    document.getElementById("titulo").value = tarefa.titulo;
    document.getElementById("descricao").value = tarefa.descricao;
    document.getElementById("dia").value = tarefa.dia;
    document.getElementById("prioridade").value = tarefa.prioridade;
    document.getElementById("status").value = tarefa.status;
    editarId = Id_Tarefa;
    document.querySelector(".adicionarTarefa").textContent = "Salvar alteração";
    document.getElementById("titulo").focus();
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
        Info_Status.textContent = tarefa.status;
        Info_Status.style.color = "white";
        Info_Status.style.fontSize = "13px";
        Info_Status.style.display = "flex";
        Info_Status.style.alignItems = "center";
        Info_Status.style.justifyContent = "center";

        if(Info_Status.textContent === "Concluída"){
            Info_Status.style.width = "89px";
            Info_Status.style.borderRadius = "10px";
            Info_Status.style.backgroundColor = "#02c20f";
        }
        else {
            Info_Status.style.width = "89px";
            Info_Status.style.borderRadius = "10px";
            Info_Status.style.backgroundColor = "#c28500";
        }

        let Data = document.createElement("div");
        Data.textContent = tarefa.dia;
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
            excluir(tarefa.Id_Tarefa);
        });

        let btnEditar = document.createElement("button");
        btnEditar.classList.add("editar")
        btnEditar.textContent = "editar";
        btnEditar.addEventListener("click", () => {
            editar(tarefa.Id_Tarefa);
        })

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
        }
        else if(Prioridade.textContent === "Média"){
            Prioridade.style.backgroundColor = "#cb6003";
        }

        else if(Prioridade.textContent === "Baixa"){
            Prioridade.style.backgroundColor = "#dc1313";
        }

        cardHIstorico.appendChild(respostaTitulo);
        cardHIstorico.appendChild(descrição);
        Info.appendChild(Info_Status);
        Info.appendChild(Prioridade);
        Info.appendChild(Data);
        cardHIstorico.appendChild(Info);
        btns.appendChild(btnEditar);
        btns.appendChild(bntExcluir);
        cardHIstorico.appendChild(btns);
        historicoTarefa.appendChild(cardHIstorico);
    });
}

listarTarefas();

document.getElementById("FormTarefa").addEventListener("submit", function(e){
    e.preventDefault();

    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    let dia = document.getElementById("dia").value;
    let prioridade = document.getElementById("prioridade").value;
    let status = document.getElementById("status").value;

    if(editarId){
        tarefas = tarefas.map(t =>
            t.Id_Tarefa == editarId
            ? { ...t, titulo, descricao, dia, prioridade, status }
            : t
        );
        editarId = null;
        document.querySelector(".adicionarTarefa").textContent = "Adicionar Tarefa";
    }
    else{
        let tarefa = {
            Id_Tarefa: Date.now(),
            titulo,
            descricao,
            dia,
            prioridade,
            status
        };
        tarefas.push(tarefa);
    }

    salvarLocal();
    listarTarefas();
    this.reset();
});
