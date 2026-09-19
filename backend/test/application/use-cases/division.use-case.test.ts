import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DivisionUseCase } from '../../../src/application/use-cases/division.use-case.js';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { DivisionByZeroError } from '../../../src/domain/errors/division-by-zero.error.js';
import { InMemoryStorage, NoopEventPublisher } from './test-doubles.js';

describe('DivisionUseCase', () => {
    it('divide dos numeros y registra la calculacion', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new DivisionUseCase(new CalculatorService(), recorder);

        const result = await useCase.execute(8, 2);

        assert.equal(result.result, 4);
        assert.equal(result.operation, 'DIVISION');
        assert.equal((await storage.findAll()).length, 1);
    });

    it('rechaza la division entre cero antes de tocar el storage', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new DivisionUseCase(new CalculatorService(), recorder);

        await assert.rejects(() => useCase.execute(5, 0), DivisionByZeroError);
        assert.equal((await storage.findAll()).length, 0);
    });
});
