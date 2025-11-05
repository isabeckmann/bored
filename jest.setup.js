// jest.setup.js

// ✅ CORREÇÃO: Importa Jest e Nock para resolver os ReferenceErrors
import { jest } from '@jest/globals'; 
import nock from 'nock'; 

// Desabilita conexões de rede exceto para localhost
nock.disableNetConnect();
nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);

// Define o timeout padrão para todos os testes 
jest.setTimeout(15000);