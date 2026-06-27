function toggleButton(){
    const nome = document.querySelector("#cadNome").value;
    const email = document.querySelector("#cadEmail").value;
    const senha = document.querySelector("#cadSenha").value;
    const confirmarSenha = document.querySelector("#cadConfirm").value;
    const botao = document.querySelector("#btn");
    const termos = document.querySelector("#termos");
    if (termos.checked && nome !== "" && email !== "" && senha !== "" && confirmarSenha !== "") {
        document.querySelector("#btn").disabled = false;
        return;
    }
    document.querySelector("#btn").disabled = true;
}