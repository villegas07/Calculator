import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SubtractionUseCase } from '../../../src/application/use-cases/subtraction.use-case.js';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { InMemoryStorage, NoopEventPublisher } from './test-doubles.js';

describe('SubtractionUseCase', () => {
    it('resta dos numeros y registra la calculacion', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new SubtractionUseCase(new CalculatorService(), recorder);

        const result = await useCase.execute(9, 4);

        assert.equal(result.result, 5);
        assert.equal(result.operation, 'SUBTRACTION');
        assert.equal((await storage.findAll()).length, 1);
    });
});
