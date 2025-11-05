import { jest } from '@jest/globals'; 
import nock from 'nock'; 

nock.disableNetConnect();
nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);

jest.setTimeout(15000);