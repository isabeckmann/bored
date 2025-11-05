import * as BoredService from '../services/boredService.js';
import { salvarHistorico } from '../database/db.js'; // Importação do DB OK

/**
 * Lida com a busca de atividade aleatória ou por tipo.
 * Rota: GET /api/atividade OU GET /api/atividade/:type
 */
export async function buscarAtividade(req, res) {
    const { type } = req.params;
    let atividade;

    try {
        if (type) {
            // Busca por tipo específico
            atividade = await BoredService.getBoredActivityByType(type);
        } else {
            // Busca aleatória
            // ✅ CORREÇÃO: Usando o nome correto da função do serviço
            atividade = await BoredService.getActivity(); 
        }

        // 2. Persistir no histórico
        const tipoAtividade = type || null; 
        
        await salvarHistorico(
            tipoAtividade,
            atividade
        );

        // 3. Responder ao cliente
        res.json(atividade);

    } catch (error) {
        console.error("Erro ao buscar atividade:", error.message);
        
        let statusCode = error.status || 500;
        
        // 1. Se a API externa não encontrar resultados (Erro de Negócio)
        if (error.message.includes("No activity found")) {
            statusCode = 404;
        }

        // 2. ✅ CORREÇÃO: Se o erro for uma falha de serviço persistente (Retry ou 503)
        // Isso resolve a falha no Teste 4 (Esperado 503, Recebido 500)
        if (error.message.includes("HTTP Error 503") || error.message.includes("Falha ao obter atividade após")) {
            statusCode = 503;
        }

        // Se o código for 503, respondemos com a mensagem de erro da retentativa
        if (statusCode === 503) {
            res.status(503).json({ erro: error.message });
            return;
        }

        // Resposta padrão para outros erros (incluindo 404 e 500 genérico)
        res.status(statusCode).json({ erro: error.message || "Erro interno do servidor." });
    }
}