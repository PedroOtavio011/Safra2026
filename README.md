# 🚜 Safra 2026 — Gestão de Colheita & Apanhadores

O **Safra 2026** é o sistema definitivo para o controle operacional de colheita no campo. Desenvolvido de forma leve e ágil utilizando apenas tecnologias web nativas, a plataforma foi desenhada para resolver a gestão de mão de obra e o fluxo de colheita diária, eliminando cadernetas de papel e erros de contabilidade.

O sistema gerencia o cadastro de apanhadores, registra as sacas colhidas, controla adiantamentos financeiros e gera relatórios automáticos formatados prontos para envio direto no WhatsApp do trabalhador.

---

## 🎯 Menus & Funcionalidades Principais

* **👥 Cadastrar Apanhador:** Registro completo dos trabalhadores da colheita para controle e rastreabilidade de quem colheu cada lote.
* **📥 Entrada de Sacas & Adiantamentos:**
  * Lançamento rápido de sacas apanhadas por trabalhador ao longo do dia.
  * Registro de vales e adiantamentos em dinheiro feitos aos apanhadores, garantindo um fechamento financeiro sem furos.
* **📊 Relatórios Gerenciais:** Painel consolidado para o produtor visualizar o total colhido na propriedade, média por apanhador e saldo financeiro a pagar.
* **📱 Integração com WhatsApp (Relatórios Diários/Semanais):** Mecanismo que gera um resumo detalhado e transparente das sacas colhidas e adiantamentos do período, permitindo enviar o relatório diretamente para o WhatsApp de cada apanhador com apenas um clique.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído focando em performance, simplicidade e portabilidade para rodar direto no celular ou computador do produtor rural:

* **Estrutura:** HTML5 limpo e semântico.
* **Estilização:** CSS3 responsivo (adaptado para o uso debaixo de sol no campo).
* **Lógica:** JavaScript Puro (Vanilla JS) para processamento dos cálculos de saldo e integração com a API do WhatsApp (`https://api.whatsapp.com/send`).

---

## 💻 Como Executar o Projeto

Como o sistema utiliza tecnologias nativas da web (sem dependência de frameworks pesados ou servidores complexos), executá-lo é extremamente simples:

### Passo a Passo

1. **Clonar este repositório:**
