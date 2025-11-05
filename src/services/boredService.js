import fetch from 'node-fetch';

const BORED_API_URL = 'https://www.boredapi.com/api/activity';

/**
 * Busca uma atividade aleatória na Bored API.
 * @returns {Promise<object>} Um objeto contendo a atividade ou erro.
 */
export async function getActivity() {
    console.log('[Bored API] Solicitando nova atividade...');

    try {
        const response = await fetch(BORED_API_URL);

        if (!response.ok) {
            console.error(`[Bored API] Erro HTTP: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP Error ${response.status}: Falha ao buscar atividade.`);
        }

        const data = await response.json();
        
        if (data.error) {
            console.error('[Bored API] API retornou erro no corpo da resposta:', data.error);
            throw new Error(data.error); 
        }

        return data;
    } catch (error) {
        console.error(`[Bored API] Falha de rede/processamento: ${error.message}`);
        throw new Error(`API_INTEGRATION_ERROR: ${error.message}`);
    }
}

export async function getBoredActivityByType(type) {
    const response = await fetch(`${BORED_API_URL}?type=${type}`);
    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Falha ao buscar atividade por tipo.`);
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error); 
    }
    return data;
}