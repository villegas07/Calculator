import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as net from 'node:net';
import { CalculatorHttpAdapter } from '../../../src/infrastructure/http/calculator-http.adapter.js';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { AdditionUseCase } from '../../../src/application/use-cases/addition.use-case.js';
import { DivisionUseCase } from '../../../src/application/use-cases/division.use-case.js';
import { PowerUseCase } from '../../../src/application/use-cases/power.use-case.js';
import { SubtractionUseCase } from '../../../src/application/use-cases/subtraction.use-case.js';
import { MultiplicationUseCase } from '../../../src/application/use-cases/multiplication.use-case.js';
import { SquareRootUseCase } from '../../../src/application/use-cases/square-root.use-case.js';
import { HistoryUseCase } from '../../../src/application/use-cases/history.use-case.js';
import type { CalculatorUseCases } from '../../../src/application/calculator-use-cases.js';
import { InMemoryStorage, NoopEventPublisher } from '../../application/use-cases/test-doubles.js';

async function findFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(0, () => {
            const address = server.address();
            if (address && typeof address === 'object') {
                const { port } = address;
                server.close(() => resolve(port));
            } else {
                server.close(() => reject(new Error('No se pudo obtener un puerto libre')));
            }
        });
    });
}

let adapter: CalculatorHttpAdapter;
let baseUrl: string;

before(async () => {
    const storage = new InMemoryStorage();
    const eventPublisher = new NoopEventPublisher();
    const calculatorService = new CalculatorService();
    const recorder = new CalculationRecorder(storage, eventPublisher);
    const useCases: CalculatorUseCases = {
        additionUseCase: new AdditionUseCase(calculatorService, recorder),
        subtractionUseCase: new SubtractionUseCase(calculatorService, recorder),
        multiplicationUseCase: new MultiplicationUseCase(calculatorService, recorder),
        divisionUseCase: new DivisionUseCase(calculatorService, recorder),
        powerUseCase: new PowerUseCase(calculatorService, recorder),
        squareRootUseCase: new SquareRootUseCase(calculatorService, recorder),
        historyUseCase: new HistoryUseCase(storage),
    };

    const port = await findFreePort();
    adapter = new CalculatorHttpAdapter(useCases);
    adapter.listen(port);
    baseUrl = `http://localhost:${port}`;
});

after(() => {
    adapter.close();
});

describe('CalculatorHttpAdapter', () => {
    it('responde 201 con el resultado de una suma valida', async () => {
        const response = await fetch(`${baseUrl}/calculate/add`, {
            method: 'POST',
            body: JSON.stringify({ a: 2, b: 3 }),
        });
        const body = await response.json();

        assert.equal(response.status, 201);
        assert.equal(body.result, 5);
    });

    it('responde 400 al dividir entre cero', async () => {
        const response = await fetch(`${baseUrl}/calculate/divide`, {
            method: 'POST',
            body: JSON.stringify({ a: 8, b: 0 }),
        });
        const body = await response.json();

        assert.equal(response.status, 400);
        assert.equal(body.error, 'No es posible dividir entre cero');
    });

    it('responde 404 para una ruta desconocida', async () => {
        const response = await fetch(`${baseUrl}/no-existe`);
        assert.equal(response.status, 404);
    });

    it('lista y limpia el historial', async () => {
        await fetch(`${baseUrl}/calculate/multiply`, {
            method: 'POST',
            body: JSON.stringify({ a: 2, b: 4 }),
        });

        const historyResponse = await fetch(`${baseUrl}/history`);
        const history = await historyResponse.json();
        assert.ok(history.length >= 1);

        const clearResponse = await fetch(`${baseUrl}/history`, { method: 'DELETE' });
        assert.equal(clearResponse.status, 204);

        const afterClear = await (await fetch(`${baseUrl}/history`)).json();
        assert.equal(afterClear.length, 0);
    });
});
