import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './database/db.js';      // Importa a função de inicialização do DB
import routes from './routes.js';      // Importa o roteador padrão

dotenv.config();

// 1. Exporta app como uma exportação nomeada para os testes.
export const app = express(); 
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas: Todas as rotas (incluindo /api/atividade) são anexadas na raiz '/'
app.use('/', routes);

let server; // Variável para armazenar a instância do servidor

// Inicialização do banco de dados e do servidor
initDb() // Chamando a função initDb importada
    .then(() => {
        // 2. Captura a instância do servidor (app.listen) para poder exportá-la e fechá-la nos testes.
        server = app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesso: http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error(`Falha crítica ao iniciar a aplicação: ${error}`);
    });

// 3. Exporta a instância do servidor como uma exportação nomeada.
export { server };