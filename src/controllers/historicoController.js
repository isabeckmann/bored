import { listarHistorico as listarHistoricoDB } from "../database/db.js"; 

export async function listarHistorico(req, res) { 
    try {
        const historico = await listarHistoricoDB(); 
        
        const historicoFormatado = historico.map(item => ({
            id: item.id,
            dataConsulta: item.data_consulta,
            tipoConsulta: item.tipo, 
            resposta: item.resposta 
        }));

        return res.status(200).json(historicoFormatado);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error.message);
        return res.status(500).json({ erro: "Falha ao acessar o histórico de consultas." });
    }
}