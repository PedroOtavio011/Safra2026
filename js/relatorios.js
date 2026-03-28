import { supabaseCliente } from "./bancoDados.js";

const valorCirculo = document.getElementById("valor-central");
const mensal = document.getElementById("filtroMes");
const semanal = document.getElementById("filtroSemana");

const dataBusca = document.getElementById("dataBusca");

async function carregarDados(periodo) {
    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) return;

    let dataInicio;
    let dataFim;

    // SE o usuário escolheu uma data específica no calendário
    if (dataBusca.value && periodo === "mensal") {
        // Pega o ano e mês do input (ex: "2024-02")
        const [ano, mes] = dataBusca.value.split("-");
        dataInicio = new Date(ano, mes - 1, 1);
        dataFim = new Date(ano, mes, 0); // Último dia do mês escolhido
    } 
    // SENÃO, usa a lógica padrão de "Últimos 7 dias" ou "Mês Atual"
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
        .lte("data_lancamento", dataIsoFim); // Adicionamos o "Menor ou igual" para fechar o mês

    if (error) return console.error(error);

    const total = lancamentos ? lancamentos.reduce((acc, curr) => acc + Number(curr.quantidade), 0) : 0;
    valorCirculo.innerText = total;
}

// Escuta quando o produtor muda o mês no calendário
dataBusca.addEventListener('change', () => {
    mensal.checked = true; // Muda o rádio para mensal automaticamente
    carregarDados('mensal');
});