import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SquareRootUseCase } from '../../../src/application/use-cases/square-root.use-case.js';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { InvalidSquareRootError } from '../../../src/domain/errors/invalid-square-root.error.js';
import { InMemoryStorage, NoopEventPublisher } from './test-doubles.js';

describe('SquareRootUseCase', () => {
    it('calcula la raiz cuadrada y registra la calculacion', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new SquareRootUseCase(new CalculatorService(), recorder);

        const result = await useCase.execute(9);

        assert.equal(result.result, 3);
        assert.equal(result.operation, 'SQUARE_ROOT');
        assert.equal((await storage.findAll()).length, 1);
    });

    it('rechaza numeros negativos antes de tocar el storage', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new SquareRootUseCase(new CalculatorService(), recorder);

        await assert.rejects(() => useCase.execute(-4), InvalidSquareRootError);
        assert.equal((await storage.findAll()).length, 0);
    });
});
