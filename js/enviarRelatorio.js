import { supabaseCliente } from "./bancoDados.js";

const apanhadoresSelect = document.getElementById("selectApanhadores");


document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("Iniciando carregamento do select..."); // Para você ver no F12

        const { data: { session } } = await supabaseCliente.auth.getSession();
        
        if (!session) {
            console.warn("Sem sessão ativa");
            return;
        }

        const { data: apanhadores, error } = await supabaseCliente
            .from("apanhadores")
            .select("nome_apanhador")
            .eq("idProd", session.user.id);

        if (error) {
            console.error("Erro Supabase:", error);
            return;
        }

        if (apanhadores && apanhadoresSelect) {
            // Limpa e adiciona a opção padrão
            apanhadoresSelect.innerHTML = '<option value="">Selecione um apanhador</option>';
            
            apanhadores.forEach(ap => {
                const option = document.createElement("option");
                option.value = ap.nome_apanhador;
                option.textContent = ap.nome_apanhador;
                apanhadoresSelect.appendChild(option);
            });
            console.log("Select preenchido com", apanhadores.length, "nomes.");
        }
    } catch (err) {
        console.error("Erro ao carregar select:", err);
    }
});

//Enviar Relatório Diario

const botaoRelatorioDiario = document.getElementById("enviarRelatorioDiario");

const botaoRelatorioSemanal = document.getElementById("enviarRelatorioSemanal");

botaoRelatorioDiario.addEventListener("click", async () => {
    // 1. Pega quem está selecionado no SELECT (o valor deve ser o NOME)
    const nomeSelecionado = apanhadoresSelect.value;

    if (!nomeSelecionado) {
        alert("⚠️ Selecione um apanhador primeiro!");
        return;
    }

    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) return;

    const hojeIso = new Date().toISOString().split('T')[0];
    const dataExibicao = new Date().toLocaleDateString("pt-BR");

    try {
        // 2. Primeiro, buscamos o ID e o TELEFONE do apanhador pelo NOME dele
        const { data: apanhador, error: errAp } = await supabaseCliente
            .from("apanhadores")
            .select("id, nome_apanhador, telefone_apanhador")
            .eq("nome_apanhador", nomeSelecionado)
            .eq("idProd", session.user.id)
            .single();

        if (errAp || !apanhador) {
            console.error("Apanhador não encontrado");
            return;
        }

        // 3. Agora buscamos as sacas usando o ID (idApanhador) que acabamos de pegar
        const { data: lancamentos, error: errLancamentos } = await supabaseCliente
            .from("lancamentos_sacas")
            .select("quantidade")
            .eq("idApanhador", apanhador.id) // USANDO O ID DA IMAGEM
            .eq("data_lancamento", hojeIso); // USANDO O NOME DA COLUNA DA IMAGEM

        if (errLancamentos) {
            console.error("Erro ao buscar sacas:", errLancamentos);
            return;
        }

        // 4. Soma e gera a mensagem
        const totalSacas = lancamentos.reduce((acc, item) => acc + Number(item.quantidade), 0);

        if (totalSacas > 0) {
            let mensagem = `*☕ RELATÓRIO DIÁRIO - SAFRA 2026*%0A` +
                `*------------------------------------*%0A%0A` +
                `Olá, *${apanhador.nome_apanhador}*!%0A` +
                `Aqui está o resumo da sua colheita de hoje:%0A%0A` +
                `📅 *Data:* ${dataExibicao}%0A` +
                `📦 *Quantidade:* ${totalSacas} sacas%0A%0A` +
                `*------------------------------------*%0A` +
                `_Gerado por FD.tech_`;

            const linkWa = apanhador.telefone_apanhador 
                ? `https://api.whatsapp.com/send?phone=55${apanhador.telefone_apanhador.replace(/\D/g, '')}&text=${mensagem}`
                : `https://api.whatsapp.com/send?text=${mensagem}`;

            window.open(linkWa, "_blank");
        } else {
            alert(`Nenhum lançamento encontrado para ${nomeSelecionado} hoje.`);
        }

    } catch (err) {
        console.error("Erro geral:", err);
    }
});

//Relatório Semanal
botaoRelatorioSemanal.addEventListener("click", async () => {
    const nomeSelecionado = apanhadoresSelect.value;

    if (!nomeSelecionado) {
        alert("⚠️ Selecione um apanhador primeiro!");
        return;
    }

    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) return;

    const hoje = new Date();
    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(hoje.getDate() - 7);

    try {
        const { data: apanhador, error } = await supabaseCliente
            .from("apanhadores")
            .select("id, nome_apanhador, telefone_apanhador")
            .eq("nome_apanhador", nomeSelecionado)
            .eq("idProd", session.user.id)
            .single();

        if (error || !apanhador) {
            console.error("Apanhador não encontrado");
            return;
        }

        const { data: lancamentos, error: errLancamentos } = await supabaseCliente
            .from("lancamentos_sacas")
            .select("quantidade")
            .eq("idApanhador", apanhador.id)
            .gte("data_lancamento", seteDiasAtras.toISOString().split('T')[0])
            .lte("data_lancamento", hoje.toISOString().split('T')[0]);

        if (errLancamentos) {
            console.error("Erro ao buscar lançamentos:", errLancamentos);
            return;
        }

        const totalSacas = lancamentos.reduce((acc, item) => acc + Number(item.quantidade), 0);

        if (totalSacas > 0) {
            let mensagem = `*☕ RELATÓRIO SEMANAL - SAFRA 2026*%0A` +
                `*------------------------------------*%0A%0A` +
                `Olá, *${apanhador.nome_apanhador}*!%0A` +
                `Aqui está o resumo da sua colheita dos últimos 7 dias:%0A%0A` +
                `📅 *Período:* ${seteDiasAtras.toLocaleDateString("pt-BR")} a ${hoje.toLocaleDateString("pt-BR")}%0A` +
                `📦 *Total:* ${totalSacas} sacas%0A%0A` +
                `*------------------------------------*%0A` +
                `_Gerado por FD.tech_`;

            // Abre o WhatsApp
            const linkWa = apanhador.telefone_apanhador 
                ? `https://api.whatsapp.com/send?phone=55${apanhador.telefone_apanhador.replace(/\D/g, '')}&text=${mensagem}`
                : `https://api.whatsapp.com/send?text=${mensagem}`;

            window.open(linkWa, "_blank");
        } else {
            alert(`Nenhuma colheita registrada para ${nomeSelecionado} nos últimos 7 dias.`);
        }

    } catch (err) {
        console.error("Erro geral:", err);
    }
});

