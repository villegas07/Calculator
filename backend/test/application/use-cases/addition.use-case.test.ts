import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AdditionUseCase } from '../../../src/application/use-cases/addition.use-case.js';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { InMemoryStorage, NoopEventPublisher } from './test-doubles.js';

describe('AdditionUseCase', () => {
    it('suma dos numeros y registra la calculacion', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new AdditionUseCase(new CalculatorService(), recorder);

        const result = await useCase.execute(2, 3);

        assert.equal(result.result, 5);
        assert.equal(result.operation, 'ADDITION');
        assert.deepEqual(result.operands, [2, 3]);
        assert.equal((await storage.findAll()).length, 1);
    });
});
