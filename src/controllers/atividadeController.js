import * as BoredService from "../services/boredService.js";
import { salvarHistorico } from "../database/db.js";

export async function buscarAtividade(req, res) {
    const { type } = req.params;
    let atividade;

    try {
        if (type) {
        atividade = await BoredService.getBoredActivityByType(type);
        } else {
        atividade = await BoredService.getActivity();
        }

        if (Array.isArray(atividade) && atividade.length === 0) {
        return res
            .status(404)
            .json({ erro: "No activity found with the specified parameters" });
        }

        if (atividade.error) {
        return res.status(404).json({ erro: atividade.error });
        }

        const tipoAtividade = type || null;
        await salvarHistorico(tipoAtividade, atividade);

        res.status(200).json(atividade);
    } catch (error) {
        console.error("Erro ao buscar atividade:", error.message);

        let statusCode = error.status || 500;

        if (error.message.includes("No activity found")) {
        statusCode = 404;
        }

        if (
        error.message.includes("HTTP Error 503") ||
        error.message.includes("Falha ao obter atividade após")
        ) {
        statusCode = 503;
        }

        res
        .status(statusCode)
        .json({ erro: error.message || "Erro interno do servidor." });
    }
}
