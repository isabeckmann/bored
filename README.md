# Bored API Service

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Framework-blue?logo=express" />
  <img src="https://img.shields.io/badge/SQLite-Database-orange?logo=sqlite" />
  <img src="https://img.shields.io/badge/Tests-Jest-red?logo=jest" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen" />
</p>

> Projeto desenvolvido para consumir a **Bored API** e fornecer sugestões de atividades com persistência local, tratamento de falhas e testes automatizados. Esse projeto tem como objetivo adquirir experiência prática aplicada à matéria de Reuso de Software, componente curricular do curso de Engenharia de Software, leciona pelo professor Júnior Marcos Bandeira na instituição de ensino superior Universidade Regional do Noroeste do Estado do Rio Grande do Sul (UNIJUÍ).

## Visão Geral

O **Bored API Service** é um microserviço Node.js/Express que consome a API pública [Bored API by App Brewery](https://bored-api.appbrewery.com) para sugerir atividades aleatórias ou filtradas por tipo (como *education*, *recreational*, *social*, etc.). A ideia é que ela sugira atividades para você fazer quando está entediado, por isso o nome "Bored API".

Cada atividade consultada é **salva em um banco de dados SQLite** local, permitindo histórico de consultas e testes de resiliência a falhas externas.

## Contexto de Negócio

O serviço se propõe a ajudar usuários indecisos a encontrarem atividades para fazer no tempo livre, com base em sugestões da Bored API. O contexto de negócio é classificado como <b>EAI — Enterprise Application Integration</b>, com integração a uma API pública e externa, integrando as informações em um sistema interno, aplicando lógica de negócio, persistência de dados local utilizando SQLite, demonstrando os endpoints e fornecendo o histórico e tratamento de falhas. Esse fluxo caracteriza uma integração entre aplicações dentro de um ecossistema interno (cliente local, microserviço, banco).

Esse contexto pode ser expandido para:
- **Aplicações de produtividade** (ex: pausas criativas no trabalho)
- **Aplicativos de bem-estar** (ex: dicas de lazer)
- **Plataformas educacionais** (ex: sugestões de estudo)

## Padrão Arquitetural e de Comunicação

| Tipo | Descrição |
|------|------------|
| **Padrão Arquitetural** | Arquitetura em **camadas (MVC simplificado)**, separando **Controllers**, **Services** e **Database Access Layer**. |
| **Padrão de Comunicação** | Comunicação **HTTP RESTful** com endpoints organizados e padronizados. |
| **Padrão de Integração Externa** | Consumo de API REST via `fetch`, com tratamento de erros e retries. |

## Funcionalidades Principais
- Consumo da [Bored API](https://bored-api.appbrewery.com)
- Persistência de histórico local via SQLite
- Tratamento de erros e tolerância a falhas
- Testes automatizados com Jest e Supertest
- Mock de falhas com `nock`
- Estrutura modular e de fácil manutenção  

## Estrutura do Projeto
A estrutura foi desenhada com **separação clara de responsabilidades** e **alta coesão interna** entre arquivos de mesmo domínio.

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

## Decisões Técnicas e Boas Práticas

| Categoria | Descrição |
|--------|------------|
| **Separação de responsabilidades** | Controllers lidam com requisições, Services com lógica de negócio, e Database com persistência. |
| **Arquitetura modular** | Cada parte da aplicação é independente e testável. |
| **Tolerância a falhas** | Try/catch robusto, códigos HTTP adequados e logs descritivos. |
| **Injeção de dependência** | URLs da API e caminho do banco configuráveis via .env. |
| **Boas práticas de código** | Uso de async/await, logs contextuais e funções puras. |
| **Testabilidade** | Uso de mocks e isolamento de dependências externas. |

## Banco de Dados (SQLite)

Tabela: historico
| Campo | Tipo | Descrição |
|--------|------|------------|
| **id** | INTEGER | Chave primária |
| **tipo** | TEXT | Tipo da atividade |
| **resposta** | TEXT | Objeto JSON completo da resposta |
| **data_consulta** | DATETIME | Data e hora da consulta |

##  Como Executar o Projeto

### 1️⃣ Clonar o repositório
git clone [https://github.com/isabeckmann/bored.git](https://github.com/isabeckmann/bored.git)
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

## Endpoints disponíveis

| Método | Endpoint | Descrição |
|--------|-----------|------------|
| **GET** | `/api/atividade` | Retorna uma atividade aleatória |
| **GET** | `/api/atividade/:type` | Retorna uma atividade por tipo (ex: education) |
| **GET** | `/api/historico` | Lista o histórico de atividades |
| **GET** | `/` | Verifica se o serviço está no ar |

## Fundamentação Teórica e Referências Bibliográficas

A elaboração deste projeto baseou-se em boas práticas de desenvolvimento de software e nas documentações oficiais das tecnologias utilizadas, conforme orientações de padrões arquiteturais, testes automatizados e integração de serviços.  
As referências a seguir reúnem as principais fontes teóricas e técnicas que sustentam a construção do **Bored API Service**.

### Referências

**BASS, L.; CLEMENTS, P.; KAZMAN, R.** *Software Architecture in Practice*. 4. ed. Boston: Addison-Wesley, 2021.

**FIELDING, R. T.** *Architectural Styles and the Design of Network-based Software Architectures*. 2000. Tese (Doutorado em Filosofia da Informação e Ciência da Computação) – University of California, Irvine. Disponível em: <https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm>. Acesso em: nov. 2025.

**FOWLER, M.** *Patterns of Enterprise Application Architecture*. Boston: Addison-Wesley, 2002.

**SOMMERVILLE, I.** *Engenharia de Software*. 10. ed. São Paulo: Pearson Education, 2020.

**NODE.JS FOUNDATION.** *Node.js Documentation*. Disponível em: <https://nodejs.org/en/docs>. Acesso em: nov. 2025.

**EXPRESS.JS TEAM.** *Express.js – Web framework for Node.js*. Disponível em: <https://expressjs.com/pt-br/>. Acesso em: nov. 2025.

**SQLITE CONSORTIUM.** *SQLite Documentation*. Disponível em: <https://www.sqlite.org/docs.html>. Acesso em: nov. 2025.

**JEST.** *Jest – Testing Framework*. Disponível em: <https://jestjs.io/docs/getting-started>. Acesso em: nov. 2025.

**SUPERTEST.** *Supertest – HTTP assertions made easy*. Disponível em: <https://github.com/ladjs/supertest>. Acesso em: nov. 2025.

**NOCK.** *Nock – HTTP server mocking and expectations library for Node.js*. Disponível em: <https://github.com/nock/nock>. Acesso em: nov. 2025.

**DOTENV.** *dotenv – Zero-dependency module that loads environment variables*. Disponível em: <https://github.com/motdotla/dotenv>. Acesso em: nov. 2025.

**CORS MIDDLEWARE.** *CORS for Express.js*. Disponível em: <https://github.com/expressjs/cors>. Acesso em: nov. 2025.

**THE APP BREWERY.** *Bored API*. Disponível em: <https://www.boredapi.com/>. Acesso em: nov. 2025.

**MOZILLA DEVELOPER NETWORK (MDN).** *JavaScript Guide e API Reference*. Disponível em: <https://developer.mozilla.org/pt-BR/docs/Web/JavaScript>. Acesso em: nov. 2025.

**STEMMLER, K.** *Clean Architecture for Node.js (artigo)*. Disponível em: <https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-nodejs-architecture/>. Acesso em: nov. 2025.
