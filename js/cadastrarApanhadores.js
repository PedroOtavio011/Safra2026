import {supabaseCliente} from "./bancoDados.js";

let nomeApanhador = document.getElementById("nomeApanhador");
let telefoneApanhador = document.getElementById("whatsApp");
let botao = document.getElementById("botaoCadastro");

botao.addEventListener("click", async () => {
    const {data: {session}}= await supabaseCliente.auth.getSession();

    if(!session){
        return;
    }

    if(!nomeApanhador.value || !telefoneApanhador.value){
        alert("Preencha todos os campos");
        return;
    }
    
    const {data ,error} = await supabaseCliente
    .from("apanhadores")
    .insert({
        nome_apanhador: nomeApanhador.value,
        telefone_apanhador: telefoneApanhador.value,
        idProd: session.user.id
    });
    if(error){
        alert("Erro ao cadastrar: " + error.message);
        return;
    }else{
        botao.disabled = true;
        botao.value = "SALVANDO...";
        alert("Cadastro realizado com sucesso!")
        nomeApanhador.value = "";
        telefoneApanhador.value = "";
        location.reload();
    }

});

document.addEventListener("DOMContentLoaded", async ()=> {
    let cards = document.getElementById("listaApanhadores")

    const {data: {session}}= await supabaseCliente.auth.getSession();

    const {data, error} = await supabaseCliente
    .from("apanhadores")
    .select("id,nome_apanhador, telefone_apanhador")
    .eq("idProd", session.user.id)

    if(error){
        console.error(error);
        return
    }

    //cards
    data.forEach(apanhador => {
        cards.innerHTML += `
    <div class="card-apanhador">
        <div class="info-apanhador">
            <strong>${apanhador.nome_apanhador}</strong>
            <p>${apanhador.telefone_apanhador}</p>
        </div>
        <button class="btn-excluir" onclick="excluirApanhador('${apanhador.id}')">×</button>
    </div>
`;
    });
});
window.excluirApanhador = async (id) => {
    const confirmacao = confirm("Tem certeza que deseja remover este apanhador?");
    
    if (confirmacao) {
        const { error } = await supabaseCliente
            .from("apanhadores")
            .delete()
            .eq("id", id); // O filtro mágico: apague onde o ID for igual a este

        if (error) {
            alert("Erro ao excluir: " + error.message);
        } else {
            alert("Apanhador removido!");
            location.reload(); // Atualiza a lista
        }
    }
};










