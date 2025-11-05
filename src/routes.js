import { Router } from 'express';import { buscarAtividade } from "./controllers/atividadeController.js"; 
import { listarHistorico } from "./controllers/historicoController.js";

const router = Router();

router.get('/', (req, res) => {
    res.status(200).send("Serviço de Sugestão de Atividades UP");
});

router.get('/api/atividade', buscarAtividade); 
router.get('/api/atividade/:type', buscarAtividade); 

router.get('/api/historico', listarHistorico);

export default router;
