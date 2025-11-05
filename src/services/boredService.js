// src/services/boredService.js - Serviço de integração com a Bored API

// CORREÇÃO: Usando import ES Module
import fetch from 'node-fetch';

const BORED_API_URL = 'https://www.boredapi.com/api/activity';

/**
 * Busca uma atividade aleatória na Bored API.
 * @returns {Promise<object>} Um objeto contendo a atividade ou erro.
 */
export async function getActivity() { // CORREÇÃO: Export nomeado
    console.log('[Bored API] Solicitando nova atividade...');

    try {
        const response = await fetch(BORED_API_URL);

        if (!response.ok) {
            // Se a resposta HTTP for um erro (4xx ou 5xx)
            console.error(`[Bored API] Erro HTTP: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP Error ${response.status}: Falha ao buscar atividade.`);
        }

        const data = await response.json();
        
        if (data.error) {
            // A API retorna { error: "No activity found with the specified parameters" } em alguns casos.
            console.error('[Bored API] API retornou erro no corpo da resposta:', data.error);
            // Lançamos um erro para ser capturado pelo controller/service
            throw new Error(data.error); 
        }

        return data;
    } catch (error) {
        // Captura erros de rede (ex: DNS, Timeout) ou erros lançados acima
        console.error(`[Bored API] Falha de rede/processamento: ${error.message}`);
        throw new Error(`API_INTEGRATION_ERROR: ${error.message}`);
    }
}


// NOTA: Se você tiver a função getBoredActivityByType no seu código original (atividadeController fazia referência a ela),
// você precisará implementá-la aqui e exportá-la também. Se ela for igual a getActivity (chamando a URL base), apenas exporte:
// export { getActivity, getActivity as getBoredActivityByType };
// Mas o código do BoredService que você enviou estava incompleto, então estou usando apenas getActivity.
// Se você precisar da função por tipo, ela deve ser implementada assim:

/**
 * Busca uma atividade por tipo.
 */
export async function getBoredActivityByType(type) {
     const response = await fetch(`${BORED_API_URL}?type=${type}`);
     // ... resto da lógica de erro e retorno
     if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Falha ao buscar atividade por tipo.`);
     }
     const data = await response.json();
     if (data.error) {
         throw new Error(data.error); 
     }
     return data;
}

// O export nomeado acima já resolve, não precisa de module.exports