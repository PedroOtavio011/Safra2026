import {supabaseCliente} from "./bancoDados.js";

let dadosDia = document.getElementById("diaSaca");

const dataColheita = document.getElementById("data");
const apanhadorSelect = document.getElementById("selectApanhador");
const quantidade = document.getElementById("Qsacas");
let botao = document.getElementById("lancarSaca");
const originalText = botao.value;

botao.addEventListener("click", async () => {
        botao.disabled = true;
        botao.value = "SALVANDO...";

    const data = dataColheita.value;
    const apanhador = apanhadorSelect.value;
    const sacas = quantidade.value;
    const {data: {session}}= await supabaseCliente.auth.getSession();

    if(!session){
        window.location.href = "index.html";
        return;    
    }
    if(!data || !apanhador || !sacas || Number(sacas) <= 0){
        alert("Preencha todos os campos ou digite uma quantidade válida!");
        botao.value = originalText;
        botao.disabled = false;
        return;
    }
    const {data: lancamentos, error} = await supabaseCliente
    .from("lancamentos_sacas")
    .insert({
       quantidade: Number(sacas),
       data_lancamento: data,
       idProd: session.user.id,
       idApanhador: apanhador
    });
    if(error){
        alert("Erro ao cadastrar: " + error.message);
        return;
    }
    else{
        alert("Lançamento realizado com sucesso!")
        dataColheita.value = "";
        apanhadorSelect.value = "";
        quantidade.value = "";
        location.reload();
    }
    
});

window.onload = async () => {
    const {data: {session}} = await supabaseCliente.auth.getSession();
    if(!session) return;

    // 1. FORMATAR DATA
    const dataAtual = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    // 2. BUSCAR APANHADORES (Lógica do Select)
    const { data: apanhadores } = await supabaseCliente
        .from("apanhadores")
        .select("id, nome_apanhador")
        .eq("idProd", session.user.id);

    if (apanhadores) {
        apanhadorSelect.innerHTML = '<option value="">Selecione um apanhador</option>';
        apanhadores.forEach(ap => {
            apanhadorSelect.innerHTML += `<option value="${ap.id}">${ap.nome_apanhador}</option>`;
        });
    }

    // 3. BUSCAR TOTAL DE SACAS (Lógica do Painel)
    const { data: sacas, error } = await supabaseCliente
        .from("lancamentos_sacas")
        .select("quantidade")
        .eq("idProd", session.user.id);

    if(error) {
        console.error(error);
        botao.disabled = false;
        botao.value = originalText;
        return;
    }

    let totalSacas = 0;
    sacas.forEach(lancamento => {
        totalSacas += Number(lancamento.quantidade);
    });


    // 4. ATUALIZAR HTML
    dadosDia.innerHTML = `
        <h2>${dataAtual}</h2>
        <p class="total-sacas"><strong>${totalSacas}</strong> Sacas (Total Safra)</p>
    `;
};







