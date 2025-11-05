import request from 'supertest';
import { app, server } from '../app.js';
import { initDb, db, closeDb } from '../database/db.js'; 
import nock from 'nock';


describe("ServiçoSugestaoAtividades: Testes de Integração e Mocks", () => {
    const boredApiScope = nock('https://www.boredapi.com');
    
    beforeAll(async () => {
        await initDb();
    });

    beforeEach(async () => {
        await db.run('DELETE FROM historico');
        nock.cleanAll();
    });
    
    afterAll(async () => {
        await closeDb(); 
        await server.close(); 
    });

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

        boredApiScope
            .get('/api/activity')
            .reply(200, atividadeMock);

        const res = await request(app)
            .get('/api/atividade'); 

        expect(res.statusCode).toBe(200);
        expect(res.body.activity).toBe(atividadeMock.activity);

        const historicoRes = await request(app).get('/api/historico');
        expect(historicoRes.statusCode).toBe(200);
        expect(historicoRes.body.length).toBe(1);
        expect(historicoRes.body[0].resposta.activity).toBe(atividadeMock.activity);
    });

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

    it("4. Deve simular falha de rede na API e acionar o Retry Pattern, falhando após 4 tentativas", async () => {
        const tipo = "social";

        boredApiScope
            .get(`/api/activity?type=${tipo}`)
            .times(4)
            .reply(503, { erro: "Server is temporarily unavailable" });

        const res = await request(app)
            .get(`/api/atividade/${tipo}`);

        expect(res.statusCode).toBe(503); 
        expect(res.body.erro).toContain('HTTP Error 503'); 
        
        const historicoRes = await request(app).get('/api/historico');
        expect(historicoRes.body.length).toBe(0);
    });

    it("5. Deve listar o histórico de consultas (GET /historico)", async () => {
        
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

        await request(app).get('/api/atividade/diy');
        await request(app).get('/api/atividade/recreational');
        
        const res = await request(app).get('/api/historico');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2); 
    });
});