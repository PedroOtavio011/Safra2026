import { supabaseCliente } from "./bancoDados.js";

const apanhadorSelect = document.getElementById("apanhadorSelect");
const valorAdiantamentoInput = document.getElementById("valorAdiantamento");
const botaoAdiantamento = document.getElementById('registrarAdiantamento');
const dataLancamentoInput = document.getElementById("dataLancamento");
botaoAdiantamento.addEventListener('click', async function() {
    
    const apanhador = apanhadorSelect.value;
    const valorAdiantamento = valorAdiantamentoInput.value;
    const dataLancamento = dataLancamentoInput.value;


    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) return;

    if (!apanhador) {
        alert("Por favor, selecione um apanhador.");
        return;
    }
    if (!valorAdiantamento || isNaN(valorAdiantamento) || Number(valorAdiantamento) <= 0) {
        alert("Por favor, insira um valor de adiantamento válido.");
        return;
    }

    // Aqui você pode adicionar a lógica para enviar os dados para o Supabase
    
    const { error } = await supabaseCliente
        .from('adiantamentos')
        .insert([{
            valorAdiantamento: Number(valorAdiantamento),
            id_apanhador: apanhador,
            id_produtor: session.user.id,
            data: dataLancamento
        }]);

    if (error) {
        console.error("Erro ao enviar adiantamento:", error);
        alert("Ocorreu um erro ao enviar o adiantamento. Por favor, tente novamente.");
    } else {
        alert("Adiantamento enviado com sucesso!");
        // Limpa os campos após o envio
        apanhadorSelect.value = "";
        valorAdiantamentoInput.value = "";
    }
        


})


    document.addEventListener("DOMContentLoaded", async () => {

        const { data: {session}, error } = await supabaseCliente.auth.getSession();
        if (error) {
            window.location.href = "index.html";
            return;
        }


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
}
);