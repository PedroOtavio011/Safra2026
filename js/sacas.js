import {supabaseCliente} from "./bancoDados.js";

const elementoSacas = document.querySelector(".sacas");


document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabaseCliente.auth.getSession();
    if (!session) {
        window.location.href = "index.html";
        return
    }

    const idProdutor = session.user.id;

    // Calcular a data 7 dias atrás  
    const umaSemana = new Date();
    umaSemana.setDate(umaSemana.getDate() - 7);
    const dataFiltro = umaSemana.toISOString();

    // Buscar lançamentos no banco
    const { data: lancamentos, error } = await supabaseCliente
    .from("lancamentos_sacas")
    .select("quantidade")
    .eq("idProd", idProdutor) // Filtra pelo dono da conta
    .gte("data_lancamento", dataFiltro) // gte = maior ou igual a sete dias atras

    if(error){
        console.error("Erro ao buscar lançamentos:", error);
        elementoSacas.innerText = "Erro ao buscar lançamentos"; 
        return;
    }else{
        let totalSacas = 0;
        lancamentos.forEach(lancamento => {
            totalSacas += Number(lancamento.quantidade);
        });
        elementoSacas.innerText = totalSacas + " sacas";
    ;

    }



    
})