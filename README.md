# Bored API Service

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Framework-blue?logo=express" />
  <img src="https://img.shields.io/badge/SQLite-Database-orange?logo=sqlite" />
  <img src="https://img.shields.io/badge/Tests-Jest-red?logo=jest" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen" />
</p>

> Projeto desenvolvido para consumir a **Bored API** e fornecer sugestões de atividades com persistência local, tratamento de falhas e testes automatizados. Esse projeto tem como objetivo adquirir experiência prática aplicada à matéria de Reuso de Software, componente curricular do curso de Engenharia de Software, leciona pelo professor Júnior Marcos Bandeira na instituição de ensino superior Universidade Regional do Noroeste do Estado do Rio Grande do Sul (UNIJUÍ).

---

## Visão Geral

O **Bored API Service** é um microserviço Node.js/Express que consome a API pública [Bored API by App Brewery](https://bored-api.appbrewery.com) para sugerir atividades aleatórias ou filtradas por tipo (como *education*, *recreational*, *social*, etc.). A ideia é que ela sugira atividades para você fazer quando está entediado, por isso o nome "Bored API".

Cada atividade consultada é **salva em um banco de dados SQLite** local, permitindo histórico de consultas e testes de resiliência a falhas externas.

---

## Contexto de Negócio

O serviço se propõe a ajudar usuários indecisos a encontrarem atividades para fazer no tempo livre, com base em sugestões da Bored API.

Este contexto pode ser expandido para:
- **Aplicações de produtividade** (ex: pausas criativas no trabalho)
- **Aplicativos de bem-estar** (ex: dicas de lazer)
- **Plataformas educacionais** (ex: sugestões de estudo)

---

## Padrão Arquitetural e de Comunicação

| Tipo | Descrição |
|------|------------|
| **Padrão Arquitetural** | Arquitetura em **camadas (MVC simplificado)**, separando **Controllers**, **Services**, e **Database Access Layer**. |
| **Padrão de Comunicação** | Comunicação **HTTP RESTful** com endpoints organizados e padronizados. |
| **Padrão de Integração Externa** | Consumo de API REST via `fetch`, com tratamento de erros e retries. |

---

## Funcionalidades Principais
- Consumo da [Bored API](https://bored-api.appbrewery.com)
- Persistência de histórico local via SQLite
- Tratamento de erros e tolerância a falhas
- Testes automatizados com Jest e Supertest
- Mock de falhas com `nock`
- Estrutura modular e de fácil manutenção  

---

## Estrutura do Projeto
A estrutura foi desenhada com **separação clara de responsabilidades** e **alta coesão interna** entre arquivos de mesmo domínio.

---

### Diagrama Simplificado

- [Cliente/Postman/Navegador]
        │   Requisição HTTP (GET)
        
- [Controller Layer]
        │   Chama serviço de integração
        
- [Service Layer]
        │   Consome API externa (Bored API)
        │   Valida / formata resposta
        
- [Data Access Layer]
        │   Salva no banco SQLite
        
- [Database (bored_api_history.sqlite)]

---

## Decisões Técnicas e Boas Práticas

| Categoria | Descrição |
|------|------------|
| **Separação de responsabilidades** | Controllers lidam com requisições, Services com lógica de negócio, e Database com persistência. |
| **Arquitetura modular** | Cada parte da aplicação é independente e testável. |
| **Tolerância a falhas** | Try/catch robusto, códigos HTTP adequados e logs descritivos. |
| **Injeção de dependência** | URLs da API e caminho do banco configuráveis via .env. |
| **Boas práticas de código** | Uso de async/await, logs contextuais e funções puras. |
| **Testabilidade** | Uso de mocks e isolamento de dependências externas. |

---

## Banco de Dados (SQLite)

Tabela: historico
| Campo | Tipo | Descrição |
|------|------------|-------------|
| **id** | INTEGER | Chave primária |
| **tipo** | TEXT | Tipo da atividade |
| **resposta** | TEXT | Objeto JSON completo da resposta |
| **data_consulta** | DATETIME | Data e hora da consulta |

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

---
## Endpoints disponíveis

| Método | Endpoint | Descrição |
|------|------------|-------------|
| **GET** | /api/atividade | Retorna uma atividade aleatória |
| **GET** | /api/atividade/:type | Retorna uma atividade por tipo (ex: education) |
| **GET** | /api/historico | Lista o histórico de atividades |
| **GET** | / | Verifica se o serviço está no ar |
