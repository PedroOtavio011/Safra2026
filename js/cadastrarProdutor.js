import { supabaseCliente } from "./bancoDados.js";

let nome = document.getElementById("nome");
let nomeFazenda= document.getElementById("nomeFazenda");
let telefone = document.getElementById("telefone");
let email = document.getElementById("email");
let senha = document.getElementById("senha");

async function irIndex(e) {
    if (e) e.preventDefault();

    try {
        // Tentativa de cadastro
        const { data, error } = await supabaseCliente.auth.signUp({
            email: email.value,
            password: senha.value
        });
        
        // Se o Supabase responder com erro controlado
        if (error) {
            console.error("Erro do Supabase:", error);
            alert("Erro no Login: " + error.message);
            return;
        }
            

        
        
        // Agora o Insert na tabela
        const { error: dbError } = await supabaseCliente
            .from("perfis_produtores")
            .insert({
                idProd: data.user.id,
                nome: nome.value,
                nomeFazenda: nomeFazenda.value,
                telefone: telefone.value,
            });

        if (dbError) {
            alert("Login criado, mas erro na tabela: " + dbError.message);
            return;
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "index.html";

    } catch (err) {
        console.error("Erro catastrófico:", err);
        alert("Erro crítico de conexão. Verifique se sua internet ou a URL do Supabase estão ok.");
    }
}


function proximoPasso(){
    if(!nome.value || !nomeFazenda.value || !telefone.value){
        alert("Preencha todos os campos");
        return;
    }else{
        let passo1 = document.getElementById("passo1");
        let passo2 = document.getElementById("passo2");
        let barraVerde = document.getElementsByClassName("barra-verde")[0]
        passo1.style.display = "none";
        passo2.style.display = "block";
        barraVerde.style.width = "80%";

    }
}

function voltarPasso(){
    let passo1 = document.getElementById("passo1");
    let passo2 = document.getElementById("passo2");
    let barraVerde = document.getElementsByClassName("barra-verde")[0]
    passo1.style.display = "block";
    passo2.style.display = "none";
    barraVerde.style.width = "50%";

}
window.proximoPasso = proximoPasso;
window.voltarPasso = voltarPasso;
window.irIndex = irIndex;

