import * as BoredService from '../services/boredService.js';
import { salvarHistorico } from '../database/db.js'; 

export async function buscarAtividade(req, res) {
    const { type } = req.params;
    let atividade;

    try {
        if (type) {
            atividade = await BoredService.getBoredActivityByType(type);
        } else {
            atividade = await BoredService.getActivity(); 
        }

        const tipoAtividade = type || null; 
        
        await salvarHistorico(
            tipoAtividade,
            atividade
        );

        res.json(atividade);

    } catch (error) {
        console.error("Erro ao buscar atividade:", error.message);
        
        let statusCode = error.status || 500;
        
        if (error.message.includes("No activity found")) {
            statusCode = 404;
        }

        if (error.message.includes("HTTP Error 503") || error.message.includes("Falha ao obter atividade após")) {
            statusCode = 503;
        }

        if (statusCode === 503) {
            res.status(503).json({ erro: error.message });
            return;
        }

        res.status(statusCode).json({ erro: error.message || "Erro interno do servidor." });
    }
}