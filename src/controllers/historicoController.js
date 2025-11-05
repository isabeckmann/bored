// src/controllers/historicoController.js

// ✅ CORREÇÃO: Usa um alias para a função do DB para evitar conflito com a função do controller
import { listarHistorico as listarHistoricoDB } from "../database/db.js"; 

/**
 * Lida com a listagem do histórico e formata os dados.
 * Rota: GET /api/historico
 */
export async function listarHistorico(req, res) { 
    try {
        // Chama a função do banco de dados usando o alias
        const historico = await listarHistoricoDB(); 
        
        const historicoFormatado = historico.map(item => ({
            id: item.id,
            dataConsulta: item.data_consulta,
            tipoConsulta: item.tipo, // O campo na DB é 'tipo'
            resposta: item.resposta 
        }));

        return res.status(200).json(historicoFormatado);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error.message);
        return res.status(500).json({ erro: "Falha ao acessar o histórico de consultas." });
    }
}