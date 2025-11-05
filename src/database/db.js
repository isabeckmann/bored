import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as dotenv from 'dotenv';

dotenv.config();

let db;
const DB_PATH = process.env.DB_PATH || './bored_api_history.sqlite';

/**
 * Inicializa a conexão com o banco de dados SQLite e cria a tabela de histórico.
 * @returns {Promise<void>}
 */
export async function initDb() {
    try {
        // Usa o driver sqlite3 e o pacote 'sqlite' para promisify
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });

        // Cria a tabela de histórico se ela não existir
        await db.exec(`
            CREATE TABLE IF NOT EXISTS historico (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT,
                resposta TEXT NOT NULL,
                data_consulta DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Banco SQLite para Bored API inicializado e conectado");

    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error.message);
        throw error;
    }
}

/**
 * Fecha a conexão com o banco de dados.
 * Usado primariamente para limpeza em ambientes de teste.
 * @returns {Promise<void>}
 */
export async function closeDb() {
    if (db) {
        await db.close();
        console.log("Conexão com o banco de dados SQLite fechada.");
    }
}

/**
 * Salva uma atividade consultada no histórico.
 * @param {string | null} tipo O tipo de atividade consultada (pode ser null para aleatória).
 * @param {object} resposta O objeto JSON da atividade.
 */
export async function salvarHistorico(tipo, resposta) { // <-- EXPORT CORRETO AQUI
    if (!db) {
        await initDb();
    }
    const respostaJson = JSON.stringify(resposta);
    await db.run(
        "INSERT INTO historico (tipo, resposta) VALUES (?, ?)",
        tipo,
        respostaJson
    );
}

/**
 * Lista todo o histórico de consultas.
 * @returns {Promise<Array<object>>} Lista de registros do histórico.
 */
export async function listarHistorico() { // <-- EXPORT CORRETO AQUI
    if (!db) {
        await initDb();
    }
    const results = await db.all("SELECT * FROM historico ORDER BY data_consulta DESC");

    // Faz o parse do campo 'resposta' de volta para objeto JSON
    return results.map(row => {
        // Seu código original já incluía o parse aqui, mas o historicoController também fazia.
        // É mais limpo que a camada DB retorne o objeto já parseado.
        return {
            ...row,
            resposta: JSON.parse(row.resposta)
        };
    });
}

// Exporta a instância do banco de dados (que é o objeto retornado por open()) e as funções
export { db };
// Note: As funções já estão exportadas acima, então esta linha final é apenas para a instância 'db'.
// Manter a exportação nomeada em cada função (export async function...) é a maneira mais limpa
// quando se usa type: "module".