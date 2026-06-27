function mudar(){
    const email = document.querySelector("#Email").value;
    const senha = document.querySelector("#Senha").value;
    const lembrete = document.querySelector("#lembrar");
    if (email !== "" && senha !== "" && lembrete.checked){
        document.querySelector("#btn").disabled = false;
        return;
    }
    document.querySelector("#btn").disabled = true;
}