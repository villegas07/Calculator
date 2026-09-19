import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PowerUseCase } from '../../../src/application/use-cases/power.use-case.js';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { InMemoryStorage, NoopEventPublisher } from './test-doubles.js';

describe('PowerUseCase', () => {
    it('eleva la base al exponente y registra la calculacion', async () => {
        const storage = new InMemoryStorage();
        const recorder = new CalculationRecorder(storage, new NoopEventPublisher());
        const useCase = new PowerUseCase(new CalculatorService(), recorder);

        const result = await useCase.execute(2, 3);

        assert.equal(result.result, 8);
        assert.equal(result.operation, 'POWER');
        assert.equal((await storage.findAll()).length, 1);
    });
});
