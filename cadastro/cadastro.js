function toggleButton() {
    const nome = document.getElementById("cadNome").value;
    const email = document.querySelector("#cadEmail").value;
    const senha = document.querySelector("#cadSenha").value;
    const confirmarSenha = document.querySelector("#cadConfirm").value;
    const termos = document.querySelector("#termos");

    if (termos.checked && nome !== "" && email !== "" && senha !== "" && confirmarSenha !== "" && senha === confirmarSenha) {
        document.querySelector("#btn").disabled = false;
        return;
    }
    document.querySelector("#btn").disabled = true;
}

const form = document.querySelector("#cadastroForm");
if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const nome = document.getElementById("cadNome").value;
        const email = document.querySelector("#cadEmail").value;
        const senha = document.querySelector("#cadSenha").value;

        fetch("http://127.0.0.1:8000/cadastro/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        })
        .then(response => {
            if (response.ok) {
                localStorage.setItem("nome", nome);
                window.location.href = "../login/index.html";
            } else {
                alert("Erro no cadastro. O e-mail já pode estar cadastrado no banco.");
            }
        })
        .catch(error => {
            console.error("Erro crítico de conexão:", error);
            alert("O dado não chegou no banco. O terminal do VS Code está ligado?");
        });
    });
}