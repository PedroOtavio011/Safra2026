import { supabaseCliente } from "./bancoDados.js";

let emaiInput = document.getElementById("redefinirEmail");
let redefinir = document.querySelector(".botaoRedefinir");

redefinir.addEventListener("click", redefinirEmail);


async function redefinirEmail() {
    const email = emaiInput.value;

    if(!email){
        alert("Por favor digite seu email referente ao cadastro.");
        return
    }

    const { error } = await supabaseCliente.auth.resetPasswordForEmail(email,{
        redirectTo: 'http://127.0.0.1:5500/atualizarSenha.html',

    });

    if(error){
        alert("Erro ao enviar o Email. Procure o suporte!");
        redefinir.disabled = false;
        redefinir.value = "Redefinir";
    }else{
        alert("Email enviado com sucesso!");
        window.location.href = "index.html";

    }
}
