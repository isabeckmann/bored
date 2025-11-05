import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './database/db.js'; 
import routes from './routes.js';

dotenv.config();

export const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', routes);

let server; 

initDb()
    .then(() => {
        server = app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesso: http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error(`Falha crítica ao iniciar a aplicação: ${error}`);
    });

export { server };