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