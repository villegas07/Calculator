import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MultiplicationUseCase } from '../../../src/application/use-cases/multiplication.use-case.js';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { InMemoryStorage, NoopEventPublisher } from './test-doubles.js';

describe('MultiplicationUseCase', () => {
    it('multiplica dos numeros y registra la calculacion', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new MultiplicationUseCase(new CalculatorService(), recorder);

        const result = await useCase.execute(4, 3);

        assert.equal(result.result, 12);
        assert.equal(result.operation, 'MULTIPLICATION');
        assert.equal((await storage.findAll()).length, 1);
    });
});
