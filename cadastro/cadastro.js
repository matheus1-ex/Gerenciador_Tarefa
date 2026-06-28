function toggleButton(){
    const nome = document.querySelector("#cadNome").value;
    const email = document.querySelector("#cadEmail").value;
    const senha = document.querySelector("#cadSenha").value;
    const confirmarSenha = document.querySelector("#cadConfirm").value;
    const botao = document.querySelector("#btn");
    const termos = document.querySelector("#termos");
    const form = document.querySelector("#cadastroForm");
    form.addEventListener("submit", function(event){
        event.preventDefault();
        let nome1 = document.getElementById("#cadNome").value;
        localStorage.setItem("nome", nome1);
        window.location.href = "https://matheus1-ex.github.io/Gerenciador_Tarefa/login/index.html";
    });
    if (termos.checked && nome !== "" && email !== "" && senha !== "" && confirmarSenha !== "") {
        document.querySelector("#btn").disabled = false;
        return;
    }
    document.querySelector("#btn").disabled = true;
}