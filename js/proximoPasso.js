// Botões interativos

const menuSaca = document.querySelector(".menuSaca")
const utilidades = document.querySelector(".utilidades")
const meusApanhadores = document.getElementById("meusApanhadores");
const lancarSacas = document.getElementById("anotarCafe");
const relatorioSemanal = document.getElementById("secRelatórios");
const enviarRelatorio = document.getElementById("enviarRelatorios");


//Botões para mostrar as telas correspondentes

const botaoMeusApanhadores = document.getElementById("panhadores");
const botaoLancarSacas = document.getElementById("lancar");
const botaoRelatorioSemanal = document.getElementById("relatorio");
const botaoEnviarRelatorio = document.getElementById("envRelatorios");


botaoLancarSacas.addEventListener("click", () => {
    menuSaca.style.display = "none";
    utilidades.style.display = "none";
    lancarSacas.style.display = "flex";
});

botaoMeusApanhadores.addEventListener("click", () => {
    menuSaca.style.display = "none";
    utilidades.style.display = "none";
    meusApanhadores.style.display = "flex";
});

botaoRelatorioSemanal.addEventListener("click", () => {
    menuSaca.style.display = "none";
    utilidades.style.display = "none";
    relatorioSemanal.style.display = "flex";
});

botaoEnviarRelatorio.addEventListener("click", () => {
    menuSaca.style.display = "none";
    utilidades.style.display = "none";
    enviarRelatorio.style.display = "inline-block";
});

const botoesVoltar = document.querySelectorAll(".btn-voltar");

botoesVoltar.forEach(btn => {
    btn.addEventListener("click", () => {
        console.log("Voltando ao menu..."); // Para você testar no F12

        // 1. Esconde todas as telas de funcionalidade
        // Use os mesmos nomes que você declarou no topo do arquivo
        meusApanhadores.style.display = "none";
        lancarSacas.style.display = "none";
        relatorioSemanal.style.display = "none";
        enviarRelatorio.style.display = "none";

        // 2. Mostra o menu principal e as utilidades novamente
        menuSaca.style.display = "flex";
        utilidades.style.display = "flex";
    });
});