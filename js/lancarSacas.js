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
    sacas.forEach(lancamento => {
        totalSacas += Number(lancamento.quantidade);
    });


    // 4. ATUALIZAR HTML
    dadosDia.innerHTML = `
        <h2>${dataAtual}</h2>
        <p class="total-sacas"><strong>${totalSacas}</strong> Sacas (Total Safra)</p>
    `;
};


// Modo Offine

function salvarOffiline(dados){
    let pendentes = JSON.parse(localStorage.getItem("lancamentos_pendentes")) || [];
    pendentes.push(dados);
    localStorage.setItem("lancamentos_pendentes", JSON.stringify(pendentes));
    alert("Lançamento salvo offline! Ele será enviado quando a conexão for restabelecida.");
}

async function sincronizarDados(){
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

window.addEventListener("online", sincronizarDados);

