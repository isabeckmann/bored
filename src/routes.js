import { Router } from 'express';
// 1. Corrigindo as importações: apenas a função buscarAtividade é exportada do controller
import { buscarAtividade } from "./controllers/atividadeController.js"; 
import { listarHistorico } from "./controllers/historicoController.js";

const router = Router();

// Rota de Health Check
router.get('/', (req, res) => {
    res.status(200).send("Serviço de Sugestão de Atividades UP");
});

// 2. Usando a rota principal de atividade (busca aleatória ou com filtro)
router.get('/api/atividade', buscarAtividade); // Busca Aleatória
router.get('/api/atividade/:type', buscarAtividade); // Busca por Tipo (ex: /social)

// Rota de Histórico
router.get('/api/historico', listarHistorico);

export default router;
