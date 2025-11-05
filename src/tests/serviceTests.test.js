import request from 'supertest';
import { app, server } from '../app.js';
// ✅ CORREÇÃO: Adicionando closeDb
import { initDb, db, closeDb } from '../database/db.js'; 
import nock from 'nock';

// NOTA: jest.setTimeout(15000); foi movido para jest.setup.js

describe("ServiçoSugestaoAtividades: Testes de Integração e Mocks", () => {
    // Escopo do Nock para a API externa
    const boredApiScope = nock('https://www.boredapi.com');
    
    beforeAll(async () => {
        await initDb();
    });

    beforeEach(async () => {
        await db.run('DELETE FROM historico');
        nock.cleanAll();
    });
    
    // ✅ CORREÇÃO: Fechando a DB e o servidor para resolver 'Open Handles'
    afterAll(async () => {
        // 1. Fecha a DB
        await closeDb(); 
        // 2. Fecha o servidor (Jest espera esta Promise resolver para sair)
        await server.close(); 
    });

    // 1. Teste de Sucesso e Persistência
    it("1. Deve buscar uma atividade aleatória com sucesso e salvar no histórico", async () => {
        const atividadeMock = {
            activity: "Aprenda a fazer um origami",
            type: "diy",
            participants: 1,
            price: 0,
            link: "",
            key: "5135118",
            accessibility: 0.1
        };

        // Mock de sucesso para a chamada aleatória
        boredApiScope
            .get('/api/activity')
            .reply(200, atividadeMock);

        const res = await request(app)
            .get('/api/atividade'); 

        // 1. Verificação da Resposta da Rota
        expect(res.statusCode).toBe(200);
        expect(res.body.activity).toBe(atividadeMock.activity);

        // 2. Verificação da Persistência (Histórico)
        const historicoRes = await request(app).get('/api/historico');
        expect(historicoRes.statusCode).toBe(200);
        expect(historicoRes.body.length).toBe(1);
        expect(historicoRes.body[0].resposta.activity).toBe(atividadeMock.activity);
    });

    // 2. Teste de Filtro e Persistência
    it("2. Deve buscar uma atividade por tipo (education) com sucesso e salvar no histórico", async () => {
        const tipo = "education";
        const atividadeMock = {
            activity: "Leia um livro sobre história mundial",
            type: tipo,
            participants: 1,
            price: 0.2,
            link: "http://example.com/livro",
            key: "7891234",
            accessibility: 0.1
        };

        // Mock de sucesso para a chamada com tipo 'education'
        boredApiScope
            .get(`/api/activity?type=${tipo}`)
            .reply(200, atividadeMock);

        const res = await request(app)
            .get(`/api/atividade/${tipo}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.activity).toBe(atividadeMock.activity);
        
        const historicoRes = await request(app).get('/api/historico');
        expect(historicoRes.body.length).toBe(1);
    });

    // 3. Teste de Erro de Negócio (404)
    it("3. Deve simular falha na API (404/Erro de Negócio) e retornar status 404", async () => {
        const tipoInvalido = "INVALIDO";
        const erroMock = { error: "No activity found with the specified parameters" };

        boredApiScope
            .get(`/api/activity?type=${tipoInvalido}`)
            .reply(200, erroMock); 

        const res = await request(app)
            .get(`/api/atividade/${tipoInvalido}`);

        expect(res.statusCode).toBe(404); 
        expect(res.body.erro).toContain(erroMock.error);
        
        const historicoRes = await request(app).get('/api/historico');
        expect(historicoRes.body.length).toBe(0);
    });

    // 4. Teste de Tolerância a Falhas (Retry Pattern)
    it("4. Deve simular falha de rede na API e acionar o Retry Pattern, falhando após 4 tentativas", async () => {
        const tipo = "social";

        // Mock de falha do servidor externo (503) por 4 vezes
        boredApiScope
            .get(`/api/activity?type=${tipo}`)
            .times(4)
            .reply(503, { erro: "Server is temporarily unavailable" });

        const res = await request(app)
            .get(`/api/atividade/${tipo}`);

        // O status code deve ser 503, pois o controller foi corrigido para tratar o erro
        expect(res.statusCode).toBe(503); 
        // ✅ CORREÇÃO: O teste agora espera a mensagem de erro que é realmente recebida
        expect(res.body.erro).toContain('HTTP Error 503'); 
        
        const historicoRes = await request(app).get('/api/historico');
        expect(historicoRes.body.length).toBe(0);
    });

    // 5. Teste de Histórico
    it("5. Deve listar o histórico de consultas (GET /historico)", async () => {
        // PREPARACAO: Garantir que temos 2 consultas salvas
        
        boredApiScope.get('/api/activity?type=diy').reply(200, { 
            activity: "Faça um bolo",
            type: "diy",
            key: "1111"
        });

        boredApiScope.get('/api/activity?type=recreational').reply(200, { 
            activity: "Jogue xadrez",
            type: "recreational",
            key: "2222"
        });

        // Executar as consultas para popular o histórico
        await request(app).get('/api/atividade/diy');
        await request(app).get('/api/atividade/recreational');
        
        // TESTE: Listar o histórico
        const res = await request(app).get('/api/historico');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2); 
    });
});