function mudar(){
    const email = document.querySelector("#Email").value;
    const senha = document.querySelector("#Senha").value;

    if (email !== "" && senha !== ""){
        document.querySelector("#btn").disabled = false;
        return;
    }
    document.querySelector("#btn").disabled = true;
}

const loginForm = document.querySelector("#loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event){
        event.preventDefault();

        const email = document.querySelector("#Email").value;
        const senha = document.querySelector("#Senha").value;

        fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Credenciais inválidas");
        })
        .then(data => {
            localStorage.setItem("nome", data.nome);
            window.location.href = "https://matheus1-ex.github.io/Gerenciador_Tarefa/Principal/index.html";
        })
        .catch(error => {
            alert("E-mail ou senha incorretos!");
        });
    });
}