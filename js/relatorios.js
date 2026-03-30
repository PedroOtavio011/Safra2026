import { supabaseCliente } from "./bancoDados.js";

const valorCirculo = document.getElementById("valor-central");
const mensal = document.getElementById("filtroMes");
const semanal = document.getElementById("filtroSemana");
const dataBusca = document.getElementById("dataBusca");

async function carregarDados(periodo) {
    // ! PROTEÇÃO 1: Se o elemento principal não existe nesta página, para o script aqui
    if (!valorCirculo) return;

    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) return;

    let dataInicio;
    let dataFim;

    if (dataBusca && dataBusca.value && periodo === "mensal") {
        const [ano, mes] = dataBusca.value.split("-");
        dataInicio = new Date(ano, mes - 1, 1);
        dataFim = new Date(ano, mes, 0);
    } 
    else if (periodo === "mensal") {
        const hoje = new Date();
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    } else {
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 7);
        dataFim = new Date();
    }

    const dataIsoInicio = dataInicio.toISOString().split('T')[0];
    const dataIsoFim = dataFim.toISOString().split('T')[0];

    const { data: lancamentos, error } = await supabaseCliente
        .from("lancamentos_sacas")
        .select("quantidade")
        .eq("idProd", session.user.id)
        .gte("data_lancamento", dataIsoInicio)
        .lte("data_lancamento", dataIsoFim);

    if (error) return console.error(error);

    const total = lancamentos ? lancamentos.reduce((acc, curr) => acc + Number(curr.quantidade), 0) : 0;
    
    // ! PROTEÇÃO 2: Só escreve se o elemento existir
    valorCirculo.innerText = total;

    // Elementos de estatísticas (Verificamos se existem antes de usar)
    const elMedia = document.getElementById("mediaDiaria");
    const elMaior = document.getElementById("maiorColheita");
    const elMenor = document.getElementById("menorColheita");

    if (lancamentos && lancamentos.length > 0) {
        const valoresSacas = lancamentos.map(l => Number(l.quantidade));
        const maiorColheita = Math.max(...valoresSacas);
        const menorColheita = Math.min(...valoresSacas);

        const diferencaTempo = Math.abs(dataFim - dataInicio);
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24)) || 1;
        const mediaDiaria = (total / diferencaDias).toFixed(1); 

        if (elMedia) elMedia.innerText = mediaDiaria;
        if (elMaior) elMaior.innerText = maiorColheita;
        if (elMenor) elMenor.innerText = menorColheita;
    } else {
        if (elMedia) elMedia.innerText = "0";
        if (elMaior) elMaior.innerText = "0";
        if (elMenor) elMenor.innerText = "0";
    }
}

// ! PROTEÇÃO 3: Usar DOMContentLoaded para garantir que o HTML carregou
document.addEventListener("DOMContentLoaded", () => {
    if (mensal) {
        mensal.addEventListener('change', () => {
            if (mensal.checked) carregarDados('mensal');
        });
    }

    if (semanal) {
        semanal.addEventListener('change', () => {
            if (semanal.checked) carregarDados('semanal');
        });
    }

    if (dataBusca) {
        dataBusca.addEventListener('change', () => carregarDados('mensal'));
    }

    // Só chama a busca se estivermos na página de relatórios (onde o valorCirculo existe)
    if (valorCirculo) {
        carregarDados('mensal');
    }
});