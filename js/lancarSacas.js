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

    const novoLancamento = {
        quantidade: Number(sacas),
        data_lancamento: data,
        idProd: session.user.id,
        idApanhador: apanhador
    };

    if(navigator.onLine){
        const {error} = await supabaseCliente
            .from("lancamentos_sacas")
            .insert(novoLancamento);

            if(error){
                console.error(error);
                alert("Erro ao salvar lançamento. Tente novamente.");
                botao.value = originalText;
                botao.disabled = false;
            } else {
                alert("Lançamento salvo com sucesso!");
                location.reload();
            }
        }
    else{
        salvarOffiline(novoLancamento);
        botao.value = originalText;
        botao.disabled = false;        
    }

    

   
    });
    
    
;

window.onload = async () => {
    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) return;

    const dataAtual = new Date().toLocaleDateString("pt-BR");


    // --- LÓGICA DE APANHADORES COM CACHE ---
    let apanhadores;

    if (navigator.onLine) {
        // Se tem internet, busca no Supabase e atualiza o Cache
        const { data: buscaApanhadores } = await supabaseCliente
            .from("apanhadores")
            .select("id, nome_apanhador")
            .eq("idProd", session.user.id);
        
        if (buscaApanhadores) {
            apanhadores = buscaApanhadores;
            localStorage.setItem("cache_apanhadores", JSON.stringify(apanhadores));
            console.log("Apanhadores atualizados via Nuvem.");
        }
    } else {
        // Se está offline, tenta pegar o que ficou guardado no celular
        apanhadores = JSON.parse(localStorage.getItem("cache_apanhadores"));
        console.log("Apanhadores carregados do Cache (Offline).");
    }

    // Preenche o Select (Independente de onde veio o dado)
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

// Soma o que veio do Banco (Online)
    if (sacas) {
        sacas.forEach(l => totalSacas += Number(l.quantidade));
    }

    // Soma o que está pendente no celular (Offline)
    const pendentes = JSON.parse(localStorage.getItem("lancamentos_pendentes")) || [];
    pendentes.forEach(p => totalSacas += Number(p.quantidade));

    // Atualiza o HTML com a soma real
    dadosDia.innerHTML = `
        <h2>${dataAtual}</h2>
        <p class="total-sacas"><strong>${totalSacas}</strong> Sacas (Total Safra)</p>
    `;
    listarLancamentos();
};


// Modo Offine

function salvarOffiline(dados){
    let pendentes = JSON.parse(localStorage.getItem("lancamentos_pendentes")) || [];
    pendentes.push(dados);
    localStorage.setItem("lancamentos_pendentes", JSON.stringify(pendentes));
    alert("Lançamento salvo offline! Ele será enviado quando a conexão for restabelecida.");
}

async function sincronizarDados(){
    const pendentes = JSON.parse(localStorage.getItem("lancamentos_pendentes")) || [];

    if(!pendentes || pendentes.length === 0) return;

    const {error} = await supabaseCliente
        .from("lancamentos_sacas")
        .insert(pendentes);

    if(!error){
        localStorage.removeItem("lancamentos_pendentes");
        alert("Dados sincronizados com sucesso!");
        location.reload();
    }
}

const lancamento = document.getElementById("lancamentosDia");

async function excluirLancamento(id) {
    const { data: banco, error } = await supabaseCliente
        .from('lancamentos_sacas')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
        alert("Erro ao excluir lançamento. Tente novamente.");
    } else {
        alert("Lançamento excluído com sucesso!");
        location.reload();
    }
}

const containerLancamentos = document.getElementById("lancamentosDia");

containerLancamentos.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-excluir")) {
        const idDoLancamento = e.target.getAttribute("data-id");
        
        if (confirm("Tem certeza que deseja excluir este lançamento?")) {
            excluirLancamento(idDoLancamento);
        }
    }
});

async function listarLancamentos() {
    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) return;

    // 1. Buscamos o id junto com os outros dados
    const { data: lancamentos, error } = await supabaseCliente
        .from("lancamentos_sacas")
        .select(`
            id, 
            quantidade, 
            data_lancamento,
            apanhadores (
                nome_apanhador
            )
        `) 
    .eq("idProd", session.user.id)
    .eq("data_lancamento", new Date().toISOString().split("T")[0]);

    if (error) return console.error(error);

    const container = document.getElementById("lancamentosDia");
    container.innerHTML = ""; // Limpa a lista antes de desenhar

    lancamentos.forEach(l => {
        container.innerHTML += `
            <div class="item-lancamento">
                <p>Apanhador: ${l.apanhadores.nome_apanhador} - Data: ${l.data_lancamento} - Qtd: ${l.quantidade} sacas</p>
                <button class="btn-excluir" data-id="${l.id}">Excluir</button>
        </div>
        `;
    });
}

window.addEventListener("online", sincronizarDados);

