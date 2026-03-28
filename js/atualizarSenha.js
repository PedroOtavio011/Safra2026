import { supabaseCliente } from "./bancoDados.js";

const novaSenhaInput = document.getElementById("novaSenha");
const btnAtualizar = document.getElementById("btnAtualizar");

btnAtualizar.addEventListener("click", atualizarSenha);

async function atualizarSenha() {
    const novaSenha = novaSenhaInput.value;

    if (novaSenha.length < 6) {
        alert("A senha precisa ter pelo menos 6 caracteres!");
        return;
    }

    btnAtualizar.value = "SALVANDO...";
    btnAtualizar.disabled = true;

    // Função do Supabase para atualizar os dados do usuário atual (vindo do link)
    const { error } = await supabaseCliente.auth.updateUser({
        password: novaSenha
    });

    if (error) {
        alert("Erro ao atualizar: " + error.message);
        btnAtualizar.value = "SALVAR NOVA SENHA";
        btnAtualizar.disabled = false;
    } else {
        alert("Senha alterada com sucesso! Agora você já pode entrar.");
        window.location.href = "index.html"; // Manda de volta pro login
    }
}