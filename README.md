# Bored API Service

> Projeto desenvolvido para consumir a **Bored API** e fornecer sugestões de atividades com persistência local, tratamento de falhas e testes automatizados. Esse projeto tem como objetivo adquirir experiência prática aplicada à matéria de Reuso de Software, componente curricular do curso de Engenharia de Software, leciona pelo professor Júnior Marcos Bandeira na instituição de ensino superior Universidade Regional do Noroeste do Estado do Rio Grande do Sul (UNIJUÍ).

---

## 📌 Sumário

1. [Visão Geral](#-visão-geral)  
2. [Contexto de Negócio](#-contexto-de-negócio)  
3. [Padrão Arquitetural e de Comunicação](#-padrão-arquitetural-e-de-comunicação)  
4. [Funcionalidades Principais](#-funcionalidades-principais)  
5. [Estrutura do Projeto](#-estrutura-do-projeto)  
6. [Como Executar o Projeto](#-como-executar-o-projeto)  
7. [Rotas Disponíveis (Postman / Navegador)](#-rotas-disponíveis-postman--navegador)  
8. [Persistência de Dados (SQLite)](#-persistência-de-dados-sqlite)  
9. [Tratamento de Falhas e Tolerância](#-tratamento-de-falhas-e-tolerância)  
10. [Testes Automatizados](#-testes-automatizados)  
11. [Decisões Técnicas e Boas Práticas](#-decisões-técnicas-e-boas-práticas)  
12. [Créditos e Licença](#-créditos-e-licença)

---

## 🧩 Visão Geral

O **Bored API Service** é um microserviço Node.js/Express que consome a API pública [Bored API by App Brewery](https://bored-api.appbrewery.com) para sugerir atividades aleatórias ou filtradas por tipo (como *education*, *recreational*, *social*, etc.).

Cada atividade consultada é **salva em um banco de dados SQLite** local, permitindo histórico de consultas e testes de resiliência a falhas externas.

---

## 💼 Contexto de Negócio

O serviço se propõe a ajudar usuários indecisos a encontrarem atividades para fazer no tempo livre, com base em sugestões da Bored API.

Este contexto pode ser expandido para:
- **Aplicações de produtividade** (ex: pausas criativas no trabalho)
- **Aplicativos de bem-estar** (ex: dicas de lazer)
- **Plataformas educacionais** (ex: sugestões de estudo)

---

## 🧱 Padrão Arquitetural e de Comunicação

| Tipo | Descrição |
|------|------------|
| **Padrão Arquitetural** | Arquitetura em **camadas (MVC simplificado)**, separando **Controllers**, **Services**, e **Database Access Layer**. |
| **Padrão de Comunicação** | Comunicação **HTTP RESTful** com endpoints organizados e padronizados. |
| **Padrão de Integração Externa** | Consumo de API REST via `fetch`, com tratamento de erros e retries. |

---

## ⚙️ Funcionalidades Principais

✅ Consumo da [Bored API](https://bored-api.appbrewery.com)  
✅ Persistência de histórico local via SQLite  
✅ Tratamento de erros e tolerância a falhas  
✅ Testes automatizados com Jest e Supertest  
✅ Mock de falhas com `nock`  
✅ Estrutura modular e de fácil manutenção  

---

## 🗂 Estrutura do Projeto
A estrutura foi desenhada com **separação clara de responsabilidades** e **alta coesão interna** entre arquivos de mesmo domínio.

---

### 🔹 Diagrama Simplificado

text
- [Cliente/Postman/Navegador]
        │   Requisição HTTP (GET)
        ▼
- [Controller Layer]
        │   Chama serviço de integração
        ▼
- [Service Layer]
        │   Consome API externa (Bored API)
        │   Valida / formata resposta
        ▼
- [Data Access Layer]
        │   Salva no banco SQLite
        ▼
- [Database (bored_api_history.sqlite)]

---

##  Como Executar o Projeto

### 1️⃣ Clonar o repositório
git clone https://github.com/seuusuario/bored_api_service.git
cd bored_api_service

### 2️⃣ Instalar dependências
npm install

### 3️⃣ Configurar variáveis de ambiente (opcional)
Crie um arquivo .env
PORT=3000
DB_PATH=./db/bored_api_history.sqlite

### 4️⃣ Executar o servidor
npm start

### 5️⃣ Rodar os testes
npm test

