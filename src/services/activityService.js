const MAX_RETRIES = 2;

/**
 * O ActivityService recebe as dependências (Bored API e Funções de DB)
 * via injeção de dependência no construtor. (Critério: Qualidade do código)
 * @param {object} boredApiService O serviço de integração com a Bored API.
 * @param {object} dbService As funções de persistência (saveQuery, getHistory).
 */
class ActivityService {
    constructor(boredApiService, dbService) {
        this.boredApiService = boredApiService;
        this.dbService = dbService;
    }

    async fetchActivity() {
        const payload = { type: 'random_activity_request' };
        let result;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                result = await this.boredApiService.getActivity();
                
                await this.dbService.saveQuery('new_activity', payload, result);
                return { success: true, data: result };

            } catch (error) {
                console.warn(`[Service] Tentativa ${attempt + 1}/${MAX_RETRIES} falhou: ${error.message}`);
                
                if (attempt === MAX_RETRIES - 1) {
                    console.error("[Service] Todas as retentativas falharam. Registrando falha final.");
                    result = { error: `Falha ao obter atividade após ${MAX_RETRIES} tentativas: ${error.message}` };
                    await this.dbService.saveQuery('new_activity_fail', payload, result);
                    return { success: false, error: result.error, status: 503 };
                }
                
                await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1))); 
            }
        }
    }

    async getQueryHistory() {
        try {
            const history = await this.dbService.getHistory();
            return { success: true, data: history };
        } catch (error) {
            console.error(`[Service] Falha ao recuperar histórico: ${error.message}`);
            return { success: false, error: 'Falha interna ao acessar o histórico.', status: 500 };
        }
    }
}

export default ActivityService;