import { supabaseCliente } from "./bancoDados.js";


let email = document.getElementsByClassName("emailLog")[0];
let senha = document.getElementsByClassName("senhaLog")[0];
let entrar = document.getElementsByClassName("entrar")[0];

entrar.addEventListener("click", login);

async function login() {

    entrar.disabled = true;
    entrar.value = "Carregando...";


    const { error } = await supabaseCliente.auth.signInWithPassword({
        email: email.value,
        password: senha.value
    });

    if(error){
        alert("Erro no Login: " + error.message);
        return;
        entrar.disabled = false;
        entrar.value = "Entrar";
    }else{
        alert("Login realizado com sucesso!");
        window.location.href = "painelProdutor.html";
    }
}
document.addEventListener("DOMContentLoaded", async ()=> {
    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (session) {
        // Se já tem sessão, manda direto para o painel
        window.location.href = "painelProdutor.html";
    }
});
