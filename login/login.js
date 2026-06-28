function mudar(){
    const email = document.querySelector("#Email").value;
    const senha = document.querySelector("#Senha").value;
    const lembrete = document.querySelector("#lembrar");

    const form = document.querySelector("#loginForm");
    form.addEventListener("submit", function(event){
        event.preventDefault();
        window.location.href = "https://matheus1-ex.github.io/Gerenciador_Tarefa/Principal/index.html";
    });
    if (email !== "" && senha !== "" && lembrete.checked){
        document.querySelector("#btn").disabled = false;
        return;
    }
    document.querySelector("#btn").disabled = true;
}